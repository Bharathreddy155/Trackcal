// bot/services/reminderScheduler.js
import cron from 'node-cron';
import twilio from 'twilio';
import { getTrackcalData, getTodayDateStr } from './firebaseService.js';

let twilioClient = null;

function getTwilioClient() {
  if (!twilioClient && process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
    twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
  }
  return twilioClient;
}

/**
 * Sends an outbound WhatsApp message to the user
 */
export async function sendWhatsAppAlert(messageText) {
  const client = getTwilioClient();
  const to = process.env.MY_WHATSAPP_NUMBER;
  const from = process.env.TWILIO_WHATSAPP_NUMBER || 'whatsapp:+14155238886';

  if (!client || !to) {
    console.warn('[WhatsApp Bot] Cannot send alert: TWILIO credentials or MY_WHATSAPP_NUMBER not set in .env');
    return false;
  }

  try {
    const res = await client.messages.create({
      body: messageText,
      from: from,
      to: to
    });
    console.log(`[WhatsApp Bot] Alert sent successfully! SID: ${res.sid}`);
    return true;
  } catch (err) {
    console.error('[WhatsApp Bot] Error sending WhatsApp message:', err.message);
    return false;
  }
}

/**
 * Initializes Scheduled Daily Cron Reminders
 */
export function initReminderScheduler(syncCode) {
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
