// server.js
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const twilio = require('twilio');

const app = express();

// ✅ Use Railway dynamic port
const port = process.env.PORT || 10000;

app.use(cors());
app.use(bodyParser.json());

// 🔹 Check required environment variables before initializing Twilio
const requiredEnv = [
  'TWILIO_ACCOUNT_SID',
  'TWILIO_AUTH_TOKEN',
  'TWILIO_PHONE_NUMBER',
  'RECIPIENT_NUMBER'
];

const missingEnv = requiredEnv.filter((key) => !process.env[key]);
if (missingEnv.length > 0) {
  console.error(`❌ Missing environment variables: ${missingEnv.join(', ')}`);
  process.exit(1); // stop the server if any env variable is missing
}

// 🔹 Initialize Twilio client
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// 🔹 Root route for health check
app.get('/', (req, res) => {
  res.send('✅ Donation backend is running!');
});

// 🔹 Donation POST route
app.post('/send-donation', async (req, res) => {
  const { wasteType, weight } = req.body;

  if (!wasteType || !weight) {
    return res.status(400).json({ success: false, message: 'All fields are required.' });
  }

  const smsMessage = `New donation recorded: ${wasteType} (${weight} kg).`;

  try {
    const msg = await client.messages.create({
      body: smsMessage,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: process.env.RECIPIENT_NUMBER
    });

    res.json({ success: true, sid: msg.sid });
  } catch (err) {
    console.error('Twilio error:', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

// 🔹 Start server
app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${port}`);
  console.log('PORT env variable =', process.env.PORT);
});
