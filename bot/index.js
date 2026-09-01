// bot/index.js
import makeWASocket, {
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion
} from '@whiskeysockets/baileys';
import qrcode from 'qrcode-terminal';
import pino from 'pino';
import path from 'path';
import http from 'http';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { handleWhatsAppMessage } from './services/commandHandler.js';
import { initReminderScheduler } from './services/reminderScheduler.js';
import { getTodayDateStr } from './services/firebaseService.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 10000;
const SYNC_CODE = process.env.TRACKCAL_SYNC_CODE || 'bharath-bulking-70kg';
const AUTH_DIR = path.join(__dirname, 'auth_info_baileys');

// Cache to prevent responding to our own bot replies
const sentMessageIds = new Set();
let isWhatsAppConnected = false;
let connectedUser = null;
let myPhoneNumber = null;
let myUserJid = null;

/**
 * Lightweight HTTP server for Render Health Checks & Keep-Alive
 */
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(
    JSON.stringify({
      status: 'online',
      whatsapp: isWhatsAppConnected ? 'connected' : 'disconnected',
      user: connectedUser,
      today: getTodayDateStr(),
      syncCode: SYNC_CODE,
      timestamp: new Date().toISOString()
    })
  );
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`🌐 Web Health Server running on http://0.0.0.0:${PORT} for Render Keep-Alive.`);
});

/**
 * Self-ping mechanism to keep Render Free Tier awake 24/7
 */
function initKeepAlive() {
  const renderUrl = process.env.RENDER_EXTERNAL_URL;
  if (renderUrl) {
    console.log(`⏰ Keep-alive active: Pinging ${renderUrl} every 10 minutes.`);
    setInterval(async () => {
      try {
        await fetch(renderUrl);
        console.log(`[Keep-Alive] Pinged ${renderUrl} successfully.`);
      } catch (err) {
        console.warn(`[Keep-Alive] Ping error:`, err.message);
      }
    }, 10 * 60 * 1000); // 10 mins
  }
}

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
  console.log(`🤖 Trackcal WhatsApp QR Bot Starting (Baileys v${version.join('.')})`);
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
      isWhatsAppConnected = false;
      const statusCode = lastDisconnect?.error?.output?.statusCode;
      const shouldReconnect = statusCode !== DisconnectReason.loggedOut;
      console.log(`⚠️ Connection closed (${statusCode}). Reconnecting: ${shouldReconnect}...`);
      if (shouldReconnect) {
        setTimeout(startWhatsAppBot, 3000);
      } else {
        console.log('❌ Logged out. Delete bot/auth_info_baileys/ and restart to link again.');
      }
    } else if (connection === 'open') {
      isWhatsAppConnected = true;
      myPhoneNumber = sock.user?.id ? sock.user.id.split(':')[0] : null;
      myUserJid = myPhoneNumber ? `${myPhoneNumber}@s.whatsapp.net` : null;
      connectedUser = sock.user?.name || `+${myPhoneNumber}`;

      console.log('\n✅ ============================================');
      console.log(`✅ WhatsApp Connected Successfully!`);
      console.log(`📱 Authenticated User Phone: +${myPhoneNumber} (${connectedUser})`);
      console.log(`🔒 Security: ONLY responding to self-chat (+${myPhoneNumber})`);
      console.log(`⚡ Daily Reminders: Active (9:00 PM & 10:30 PM)`);
      console.log('✅ ============================================\n');

      if (myUserJid) {
        initReminderScheduler(SYNC_CODE, sock, myUserJid);
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

      // Skip status broadcasts, groups, or invalid IDs
      if (!remoteJid || remoteJid === 'status@broadcast' || remoteJid.endsWith('@g.us')) {
        continue;
      }

      // CRITICAL SECURITY FIX: ONLY respond in your own self-chat ("Message Yourself")
      // NEVER reply to other contacts, friends, family, or external numbers!
      const isSelfChat =
        (myUserJid && remoteJid === myUserJid) ||
        (myPhoneNumber && remoteJid.startsWith(myPhoneNumber));

      if (!isSelfChat) {
        // Silently ignore all other chats!
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

      console.log(`📩 [Self-Chat Command] from: ${remoteJid} | text: "${text}"`);

      try {
        const replyText = await handleWhatsAppMessage(text, SYNC_CODE);

        // If message is not a recognized command, do not send any message
        if (!replyText) {
          continue;
        }

        // Send reply to self-chat
        const sent = await sock.sendMessage(remoteJid, { text: replyText });
        if (sent?.key?.id) {
          sentMessageIds.add(sent.key.id);
        }
        console.log(`📤 [Reply Sent to Self-Chat]`);
      } catch (err) {
        console.error('[Error handling message]:', err);
      }
    }
  });
}

initKeepAlive();
startWhatsAppBot().catch((err) => console.error('Fatal Bot Error:', err));
