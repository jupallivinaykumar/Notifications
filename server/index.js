// server/index.js
require('dotenv').config();
const express = require('express');
const webpush = require('web-push');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// set VAPID from .env
webpush.setVapidDetails(
  'mailto:you@example.com',
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

// in-memory store for demo (use DB for production)
const subscriptions = [];

app.post('/subscribe', (req, res) => {
  const { subscription } = req.body;
  // save subscription (avoid duplicates)
  subscriptions.push(subscription);
  console.log('Saved subscription');
  res.status(201).json({ ok: true });
});

app.post('/send', async (req, res) => {
  const { subscription, message } = req.body;
  try {
    await webpush.sendNotification(subscription, JSON.stringify({
      title: 'Immediate Notification',
      body: message || 'Hello from server',
      url: '/'
    }));
    res.json({ sent: true })
  } catch (err) {
    console.error('Send failed', err);
    res.status(500).json({ error: err.message })
  }
});

// Schedule endpoint: accepts subscription, message, time (ISO string)
app.post('/schedule', (req, res) => {
  const { subscription, message = 'Scheduled notification', time } = req.body;
  const when = new Date(time).getTime();
  const now = Date.now();
  const delay = Math.max(0, when - now);

  // Save subscription for demo
  subscriptions.push(subscription);

  setTimeout(async () => {
    try {
      await webpush.sendNotification(subscription, JSON.stringify({
        title: 'Scheduled Notification',
        body: message,
        url: '/'
      }));
      console.log('Scheduled push delivered');
    } catch (err) {
      console.error('Scheduled push failed', err);
    }
  }, delay);

  res.json({ scheduled: true, delayMs: delay });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));

