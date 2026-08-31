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
import { initReminderScheduler, setSocketInstance } from './services/reminderScheduler.js';
import { getTodayDateStr } from './services/firebaseService.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SYNC_CODE = process.env.TRACKCAL_SYNC_CODE || 'bharath-bulking-70kg';
const AUTH_DIR = path.join(__dirname, 'auth_info_baileys');

async function startWhatsAppBot() {
  const { state, saveCreds } = await useMultiFileAuthState(AUTH_DIR);
  const { version, isLatest } = await fetchLatestBaileysVersion();

  console.log(`====================================================`);
  console.log(`🤖 Starting Trackcal WhatsApp QR Bot (v${version.join('.')})`);
  console.log(`📱 Cloud Sync Code: ${SYNC_CODE}`);
  console.log(`====================================================`);

  const sock = makeWASocket({
    version,
    auth: state,
    logger: pino({ level: 'silent' }),
    printQRInTerminal: false,
    generateHighQualityLinkPreview: true
  });

  // Listen for Connection State (QR Code generation & Ready state)
  sock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
      console.log('\n📲 SCAN THIS QR CODE WITH WHATSAPP (Settings > Linked Devices):\n');
      qrcode.generate(qr, { small: true });
      console.log('\nWaiting for QR scan...\n');
    }

    if (connection === 'close') {
      const shouldReconnect =
        lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
      console.log(`⚠️ Connection closed. Reconnecting: ${shouldReconnect}...`);
      if (shouldReconnect) {
        setTimeout(startWhatsAppBot, 3000);
      } else {
        console.log('❌ Logged out. Delete bot/auth_info_baileys/ and restart to scan again.');
      }
    } else if (connection === 'open') {
      const userJid = sock.user?.id ? sock.user.id.split(':')[0] + '@s.whatsapp.net' : null;

      console.log('✅ ============================================');
      console.log(`✅ WhatsApp Connected Successfully!`);
      console.log(`📱 User: ${sock.user?.name || 'Bharath'} (${userJid})`);
      console.log(`⚡ Daily Reminders: Active (9:00 PM & 10:30 PM)`);
      console.log('✅ ============================================\n');

      if (userJid) {
        initReminderScheduler(SYNC_CODE, sock, userJid);

        // Send a welcome message to yourself on first connect
        try {
          await sock.sendMessage(userJid, {
            text:
              `🚀 *Trackcal WhatsApp Bot Connected!*\n\n` +
              `Hey Bharath! Your personal WhatsApp bulking assistant is now active and synced with your Trackcal cloud account (*${SYNC_CODE}*).\n\n` +
              `Try replying with:\n` +
              `• *status* — View today's calories & macros\n` +
              `• *creatine* — Log daily 3g creatine\n` +
              `• *whey* — Log 1 scoop whey protein\n` +
              `• *weight 58.2* — Log today's weight\n` +
              `• *help* — View all commands`
          });
        } catch (e) {
          // non-critical
        }
      }
    }
  });

  // Save authentication credentials when updated
  sock.ev.on('creds.update', saveCreds);

  // Listen for Incoming Messages
  sock.ev.on('messages.upsert', async ({ messages, type }) => {
    if (type !== 'notify') return;

    for (const msg of messages) {
      // Ignore messages sent by bot itself unless in self-chat
      const fromMe = msg.key.fromMe;
      const remoteJid = msg.key.remoteJid;

      // Extract message text from regular text or extended text message
      const messageText =
        msg.message?.conversation ||
        msg.message?.extendedTextMessage?.text ||
        msg.message?.imageMessage?.caption ||
        '';

      if (!messageText.trim()) continue;

      // Only respond to 1-on-1 private messages (including message-to-yourself chat)
      if (remoteJid.endsWith('@s.whatsapp.net')) {
        console.log(`[WhatsApp Message] from: ${remoteJid} | text: "${messageText}"`);

        try {
          const replyText = await handleWhatsAppMessage(messageText, SYNC_CODE);
          await sock.sendMessage(remoteJid, { text: replyText }, { quoted: msg });
        } catch (err) {
          console.error('[Error handling message]:', err);
          await sock.sendMessage(remoteJid, {
            text: '⚠️ An error occurred processing your request. Please try again.'
          });
        }
      }
    }
  });
}

startWhatsAppBot().catch((err) => console.error('Fatal Bot Error:', err));
