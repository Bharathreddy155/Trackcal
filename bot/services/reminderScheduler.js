// bot/services/reminderScheduler.js
import cron from 'node-cron';
import { getTrackcalData, getTodayDateStr } from './firebaseService.js';

let activeSocket = null;
let userJid = null;

export function setSocketInstance(sock, jid) {
  activeSocket = sock;
  userJid = jid;
}

/**
 * Sends an outbound WhatsApp message via Baileys socket
 */
export async function sendWhatsAppAlert(messageText) {
  if (!activeSocket || !userJid) {
    console.warn('[WhatsApp Bot] Cannot send alert: WhatsApp is not connected.');
    return false;
  }

  try {
    await activeSocket.sendMessage(userJid, { text: messageText });
    console.log('[WhatsApp Bot] Alert sent successfully to WhatsApp!');
    return true;
  } catch (err) {
    console.error('[WhatsApp Bot] Error sending WhatsApp message:', err.message);
    return false;
  }
}

/**
 * Initializes Scheduled Daily Cron Reminders
 */
export function initReminderScheduler(syncCode, sock, jid) {
  setSocketInstance(sock, jid);
  console.log('[WhatsApp Bot] Initializing daily scheduled reminders...');

  // 1. 9:00 PM Evening Supplement & Creatine Check (0 21 * * *)
  cron.schedule('0 21 * * *', async () => {
    console.log('[WhatsApp Bot] Running 9:00 PM supplement check...');
    const todayStr = getTodayDateStr();
    const data = await getTrackcalData(syncCode);
    const todayLog = data?.dailyLogs?.[todayStr];

    const creatineTaken = todayLog?.supplements?.creatine?.taken;
    const wheyTaken = todayLog?.supplements?.whey?.taken;

    if (!creatineTaken || !wheyTaken) {
      let msg = `⏰ *Trackcal Evening Check-in (${todayStr})*\n\nHey Bharath! Quick reminder for your daily bulking routine:\n`;
      if (!creatineTaken) msg += `\n⚡ *Creatine (3g)* is pending! Reply *creatine* when taken.`;
      if (!wheyTaken) msg += `\n🥛 *Whey Protein* is pending! Reply *whey* when taken.`;
      msg += `\n\nStay consistent! 💪`;
      await sendWhatsAppAlert(msg);
    }
  });

  // 2. 10:30 PM Night Calorie & Macro Report (30 22 * * *)
  cron.schedule('30 22 * * *', async () => {
    console.log('[WhatsApp Bot] Running 10:30 PM daily summary report...');
    const todayStr = getTodayDateStr();
    const data = await getTrackcalData(syncCode);
    const todayLog = data?.dailyLogs?.[todayStr] || {};
    const targets = data?.targets || { calories: 2725, protein: 105 };

    const workoutDone = todayLog?.workout?.completed ? '✅ Done' : '❌ Missed';
    const creatineDone = todayLog?.supplements?.creatine?.taken ? '✅ Taken' : '❌ Missed';

    const msg = (
      `🌙 *Trackcal End-of-Day Summary (${todayStr})*\n\n` +
      `⚡ *Creatine:* ${creatineDone}\n` +
      `💪 *Workout:* ${workoutDone}\n` +
      `⚖️ *Weight:* ${todayLog.weight ? `${todayLog.weight} kg` : 'Not logged'}\n\n` +
      `Target: *${targets.calories} kcal* • *${targets.protein}g Protein*\n\n` +
      `Great effort today! Rest well and recover for tomorrow. 🛌`
    );

    await sendWhatsAppAlert(msg);
  });

  console.log('[WhatsApp Bot] Daily reminders scheduled: 9:00 PM (Supplements) and 10:30 PM (Macro Report).');
}
