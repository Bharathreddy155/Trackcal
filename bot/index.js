// bot/index.js
import makeWASocket, {
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion
} from '@whiskeysockets/baileys';
import qrcode from 'qrcode-terminal';
import pino from 'pino';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { handleWhatsAppMessage } from './services/commandHandler.js';
import { initReminderScheduler } from './services/reminderScheduler.js';
import { getTodayDateStr } from './services/firebaseService.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SYNC_CODE = process.env.TRACKCAL_SYNC_CODE || 'bharath-bulking-70kg';
const AUTH_DIR = path.join(__dirname, 'auth_info_baileys');

// Cache to prevent responding to our own bot replies
const sentMessageIds = new Set();

/**
 * Extracts plain text from various WhatsApp message structures
 */
function extractMessageText(msg) {
  if (!msg.message) return '';
  const m = msg.message;

  return (
    m.conversation ||
    m.extendedTextMessage?.text ||
    m.imageMessage?.caption ||
    m.videoMessage?.caption ||
    m.documentMessage?.caption ||
    m.ephemeralMessage?.message?.conversation ||
    m.ephemeralMessage?.message?.extendedTextMessage?.text ||
    m.viewOnceMessage?.message?.conversation ||
    m.viewOnceMessage?.message?.extendedTextMessage?.text ||
    m.viewOnceMessageV2?.message?.conversation ||
    m.viewOnceMessageV2?.message?.extendedTextMessage?.text ||
    ''
  ).trim();
}

/**
 * Checks if text is an automated bot response
 */
function isBotResponse(text) {
  const botPrefixes = ['🤖', '📊', '⚡', '🥛', '⚖️', '✅', '💪', '👋', '⏰', '🌙', '⚠️', '🚀'];
  return botPrefixes.some((p) => text.startsWith(p));
}

async function startWhatsAppBot() {
  const { state, saveCreds } = await useMultiFileAuthState(AUTH_DIR);
  const { version } = await fetchLatestBaileysVersion();

  console.log(`\n====================================================`);
  console.log(`🤖 Trackcal WhatsApp QR Bot Starting...`);
  console.log(`📱 Cloud Sync Code: ${SYNC_CODE}`);
  console.log(`====================================================\n`);

  const sock = makeWASocket({
    version,
    auth: state,
    logger: pino({ level: 'silent' }),
    printQRInTerminal: false,
    generateHighQualityLinkPreview: true,
    syncFullHistory: false
  });

  // Connection Updates
  sock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
      console.log('\n📲 SCAN THIS QR CODE WITH WHATSAPP (Settings > Linked Devices):\n');
      qrcode.generate(qr, { small: true });
      console.log('\nWaiting for QR scan...\n');
    }

    if (connection === 'close') {
      const statusCode = lastDisconnect?.error?.output?.statusCode;
      const shouldReconnect = statusCode !== DisconnectReason.loggedOut;
      console.log(`⚠️ Connection closed (${statusCode}). Reconnecting: ${shouldReconnect}...`);
      if (shouldReconnect) {
        setTimeout(startWhatsAppBot, 3000);
      } else {
        console.log('❌ Logged out. Delete bot/auth_info_baileys/ and restart to link again.');
      }
    } else if (connection === 'open') {
      const myNumber = sock.user?.id ? sock.user.id.split(':')[0] : 'User';
      const userJid = sock.user?.id ? `${myNumber}@s.whatsapp.net` : null;

      console.log('\n✅ ============================================');
      console.log(`✅ WhatsApp Connected Successfully!`);
      console.log(`📱 Phone: +${myNumber} (${sock.user?.name || 'Bharath'})`);
      console.log(`⚡ Daily Reminders: Active (9:00 PM & 10:30 PM)`);
      console.log(`💬 Open WhatsApp and text "status" or "help" to yourself!`);
      console.log('✅ ============================================\n');

      if (userJid) {
        initReminderScheduler(SYNC_CODE, sock, userJid);
      }
    }
  });

  // Save auth state
  sock.ev.on('creds.update', saveCreds);

  // Incoming Messages Handler
  sock.ev.on('messages.upsert', async ({ messages, type }) => {
    if (type !== 'notify' && type !== 'append') return;

    for (const msg of messages) {
      const msgId = msg.key?.id;
      const remoteJid = msg.key?.remoteJid;
      const fromMe = Boolean(msg.key?.fromMe);

      // Skip status broadcasts and group messages
      if (!remoteJid || remoteJid === 'status@broadcast' || remoteJid.endsWith('@g.us')) {
        continue;
      }

      // If this message was sent by our bot, skip it to avoid reply loops
      if (msgId && sentMessageIds.has(msgId)) {
        sentMessageIds.delete(msgId);
        continue;
      }

      const text = extractMessageText(msg);
      if (!text) continue;

      // Skip if it is an automated bot response header
      if (isBotResponse(text)) continue;

      console.log(`📩 [WhatsApp Message] from: ${remoteJid} (fromMe: ${fromMe}) | text: "${text}"`);

      try {
        const replyText = await handleWhatsAppMessage(text, SYNC_CODE);

        // Send reply
        const sent = await sock.sendMessage(remoteJid, { text: replyText }, { quoted: msg });
        if (sent?.key?.id) {
          sentMessageIds.add(sent.key.id);
        }
        console.log(`📤 [WhatsApp Reply Sent] to: ${remoteJid}`);
      } catch (err) {
        console.error('[Error handling message]:', err);
        await sock.sendMessage(remoteJid, {
          text: '⚠️ An error occurred processing your request. Please try again.'
        });
      }
    }
  });
}

startWhatsAppBot().catch((err) => console.error('Fatal Bot Error:', err));
