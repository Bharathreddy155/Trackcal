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

// PAUSE SWITCH: Set to true to completely disable WhatsApp connection and messages
const IS_PAUSED = process.env.BOT_PAUSED !== 'false'; // Paused by default

// Cache to prevent responding to our own bot replies
const sentMessageIds = new Set();
let isWhatsAppConnected = false;
let connectedUser = null;
let myPhoneClean = null;
let myLidClean = null;
let myUserJid = null;

/**
 * Lightweight HTTP server for Render Health Checks & Keep-Alive
 */
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(
    JSON.stringify({
      status: IS_PAUSED ? 'paused' : 'online',
      botActive: !IS_PAUSED,
      whatsapp: isWhatsAppConnected ? 'connected' : 'disabled_or_paused',
      user: connectedUser,
      today: getTodayDateStr(),
      syncCode: SYNC_CODE,
      timestamp: new Date().toISOString()
    })
  );
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`🌐 Web Health Server running on http://0.0.0.0:${PORT}`);
  if (IS_PAUSED) {
    console.log(`⏸️ Trackcal WhatsApp Bot is currently PAUSED. WhatsApp connection is disabled.`);
  }
});

/**
 * Self-ping mechanism to keep Render Free Tier awake 24/7
 */
function initKeepAlive() {
  const renderUrl = process.env.RENDER_EXTERNAL_URL;
  if (renderUrl && !IS_PAUSED) {
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
  if (IS_PAUSED) {
    console.log(`\n====================================================`);
    console.log(`⏸️ TRACKCAL BOT IS PAUSED`);
    console.log(`WhatsApp connection and cron reminders are disabled.`);
    console.log(`====================================================\n`);
    return;
  }

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
      myPhoneClean = sock.user?.id ? sock.user.id.split(':')[0].replace(/[^0-9]/g, '') : '';
      myLidClean = sock.user?.lid ? sock.user.lid.split(':')[0].replace(/[^0-9]/g, '') : '';
      myUserJid = myPhoneClean ? `${myPhoneClean}@s.whatsapp.net` : null;
      connectedUser = sock.user?.name || `+${myPhoneClean}`;

      console.log('\n✅ ============================================');
      console.log(`✅ WhatsApp Connected Successfully!`);
      console.log(`📱 User Phone: +${myPhoneClean} (${connectedUser})`);
      if (myLidClean) console.log(`🆔 User LID: ${myLidClean}`);
      console.log(`🔒 Security: ONLY responding to self-chat (+${myPhoneClean})`);
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

      // Check if message is from the user's self-chat ("Message Yourself")
      const isSelfChat =
        fromMe ||
        (myUserJid && remoteJid === myUserJid) ||
        (myPhoneClean && remoteJid.includes(myPhoneClean)) ||
        (myLidClean && remoteJid.includes(myLidClean)) ||
        (sock.user?.id && remoteJid === sock.user.id) ||
        (sock.user?.lid && remoteJid === sock.user.lid);

      if (!isSelfChat) {
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

      console.log(`📩 [Self-Chat Command] from: ${remoteJid} (fromMe: ${fromMe}) | text: "${text}"`);

      try {
        const replyText = await handleWhatsAppMessage(text, SYNC_CODE);

        if (!replyText) {
          continue;
        }

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
