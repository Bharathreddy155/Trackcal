// bot/server.js
import express from 'express';
import dotenv from 'dotenv';
import twilio from 'twilio';
import { handleWhatsAppMessage } from './services/commandHandler.js';
import { initReminderScheduler, sendWhatsAppAlert } from './services/reminderScheduler.js';
import { getTrackcalData, getTodayDateStr } from './services/firebaseService.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;
const SYNC_CODE = process.env.TRACKCAL_SYNC_CODE || 'bharath-bulking-70kg';

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Health Check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Trackcal WhatsApp Bot',
    syncCode: SYNC_CODE,
    today: getTodayDateStr(),
    timestamp: new Date().toISOString()
  });
});

/**
 * Twilio Inbound Webhook:
 * When you text the bot on WhatsApp, Twilio POSTs the message here.
 */
app.post('/whatsapp/webhook', async (req, res) => {
  const fromNumber = req.body.From; // e.g. whatsapp:+91XXXXXXXXXX
  const messageBody = req.body.Body; // e.g. "creatine" or "status"

  console.log(`[WhatsApp Inbound] From: ${fromNumber} | Message: "${messageBody}"`);

  try {
    const replyText = await handleWhatsAppMessage(messageBody, SYNC_CODE);

    const twiml = new twilio.twiml.MessagingResponse();
    twiml.message(replyText);

    res.writeHead(200, { 'Content-Type': 'text/xml' });
    res.end(twiml.toString());
  } catch (err) {
    console.error('[WhatsApp Inbound Error]:', err);
    const twiml = new twilio.twiml.MessagingResponse();
    twiml.message('⚠️ An error occurred processing your request. Please try again.');
    res.writeHead(200, { 'Content-Type': 'text/xml' });
    res.end(twiml.toString());
  }
});

/**
 * Manual test endpoint: triggers immediate reminder message to your WhatsApp
 */
app.post('/test-reminder', async (req, res) => {
  const todayStr = getTodayDateStr();
  const testMsg = (
    `🚀 *Trackcal WhatsApp Bot Connected!*\n\n` +
    `Hey Bharath! Your WhatsApp bot is active and synced with your Trackcal cloud account (*${SYNC_CODE}*).\n\n` +
    `Try replying with:\n` +
    `• *status* — View today's stats\n` +
    `• *creatine* — Log daily 3g creatine\n` +
    `• *weight 58.2* — Log weight\n` +
    `• *help* — View all commands`
  );

  const success = await sendWhatsAppAlert(testMsg);
  res.json({ success, message: success ? 'Test WhatsApp message sent!' : 'Failed to send. Check Twilio credentials in bot/.env' });
});

// Start Server and Cron Scheduler
app.listen(PORT, () => {
  console.log(`===========================================`);
  console.log(`🤖 Trackcal WhatsApp Bot running on port ${PORT}`);
  console.log(`🔗 Webhook URL: http://localhost:${PORT}/whatsapp/webhook`);
  console.log(`📱 Trackcal Cloud Sync: ${SYNC_CODE}`);
  console.log(`===========================================`);

  initReminderScheduler(SYNC_CODE);
});
