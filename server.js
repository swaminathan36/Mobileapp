// require('dotenv').config();
// const express = require('express');
// const bodyParser = require('body-parser');
// const cors = require('cors');
// const twilio = require('twilio');

// const app = express();
// const port = 3000;

// app.use(cors());
// app.use(bodyParser.json());

// const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// app.post('/send-donation', async (req, res) => {
//   const {wasteType, weight } = req.body;

//   if (!wasteType || !weight) {
//     return res.status(400).json({ success: false, message: 'All fields are required.' });
//   }

//   // Construct SMS message
//   const smsMessage = `Thank you! Your ${wasteType} donation (${weight} kg) is recorded.`;

//   try {
//     const msg = await client.messages.create({
//       body: smsMessage,
//       from: process.env.TWILIO_PHONE_NUMBER,
//       to: process.env.MY_PHONE_NUMBER// assuming username is the phone number
//     });

//     res.json({ success: true, sid: msg.sid });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ success: false, message: err.message });
//   }
// });

// app.listen(port, () => console.log(`🚀 Server running at http://localhost:${port}`));
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const twilio = require('twilio');

const app = express();
const port = process.env.PORT || 10000;

app.use(cors());
app.use(bodyParser.json());

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

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
      to: process.env.RECIPIENT_NUMBER  // always sends to predefined number
    });

    res.json({ success: true, sid: msg.sid });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
});


app.listen(port, () => console.log(`🚀 Server running at http://localhost:${port}`));

