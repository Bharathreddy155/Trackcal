# 🤖 Trackcal WhatsApp Daily Reminder & Chat-to-Log Bot

Automated daily bulking reminders and 2-way chat-to-log assistant on WhatsApp connected directly to your **Trackcal** cloud database (`bharath-bulking-70kg`).

---

## ⚡ Quick 2-Minute Setup

### 1. Install Dependencies
Open terminal and run:
```bash
cd bot
npm install
```

### 2. Configure Twilio WhatsApp Sandbox (Free)
1. Go to [console.twilio.com](https://console.twilio.com/) (sign up for free).
2. Go to **Messaging → Try it out → Send a WhatsApp message**.
3. Send the join code shown (e.g. `join simple-word`) from your personal WhatsApp to Twilio's number `+1 415 523 8886`.
4. Copy your **Account SID** and **Auth Token** from your Twilio Console.
5. Create a `.env` file in the `bot/` folder (or copy from `.env.example`):
```env
TWILIO_ACCOUNT_SID=your_actual_account_sid
TWILIO_AUTH_TOKEN=your_actual_auth_token
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
MY_WHATSAPP_NUMBER=whatsapp:+91XXXXXXXXXX
TRACKCAL_SYNC_CODE=bharath-bulking-70kg
PORT=5001
```

### 3. Start the Bot
```bash
npm start
```

### 4. Connect Twilio Webhook (for receiving chat replies)
If running locally, use ngrok to expose your port:
```bash
npx ngrok http 5001
```
Copy the Forwarding URL (e.g., `https://xxxx.ngrok-free.app`) and paste it into **Twilio Console → Messaging → Settings → WhatsApp Sandbox Settings → "WHEN A MESSAGE COMES IN"**:
```
https://xxxx.ngrok-free.app/whatsapp/webhook
```

---

## 💬 WhatsApp Chat Commands

| Command | Action |
| :--- | :--- |
| **`status`** / **`today`** | View today's live calories, protein left, and supplement status |
| **`creatine`** | Mark today's 3g Creatine as taken |
| **`whey`** or **`whey 2`** | Mark Whey Protein as taken (adds 26g protein) |
| **`weight 58.2`** | Update your body weight (e.g. 58.2 kg) |
| **`log breakfast`** | Mark breakfast meal as logged |
| **`log lunch`** | Mark lunch meal as logged |
| **`log snack`** | Mark snack meal as logged |
| **`log dinner`** | Mark dinner meal as logged |
| **`workout`** | Log today's workout session completed |
| **`help`** | List all available bot commands |

---

## ⏰ Automated Scheduled Reminders
* **9:00 PM Daily Check**: Reminds you if Creatine or Whey is still unlogged.
* **10:30 PM Night Report**: Sends daily calories & macro adherence score.
