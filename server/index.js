// server/index.js
require("dotenv").config();
const express = require("express");
const webpush = require("web-push");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Set VAPID from .env
webpush.setVapidDetails(
  "mailto:you@example.com",
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

// In-memory store for demo (use DB in production)
const subscriptions = [];

// ✅ Subscribe route
app.post("/subscribe", (req, res) => {
  const { subscription } = req.body;

  // avoid duplicates
  const exists = subscriptions.find(
    (sub) => JSON.stringify(sub) === JSON.stringify(subscription)
  );
  if (!exists) subscriptions.push(subscription);

  console.log("Saved subscription:", subscription);
  res.status(201).json({ ok: true });
});

// ✅ Immediate push
app.post("/send", async (req, res) => {
  const { subscription, message } = req.body;

  try {
    await webpush.sendNotification(
      subscription,
      JSON.stringify({
        title: "Immediate Notification",
        body: message || "Hello from server",
        icon: "/icon.png",
        url: "/",
      })
    );
    res.json({ sent: true });
  } catch (err) {
    console.error("Send failed", err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ Scheduled push
app.post("/schedule", (req, res) => {
  const { subscription, message = "Scheduled notification", time } = req.body;
  const when = new Date(time).getTime();
  const now = Date.now();
  const delay = Math.max(0, when - now);

  setTimeout(async () => {
    try {
      await webpush.sendNotification(
        subscription,
        JSON.stringify({
          title: "Scheduled Notification",
          body: message,
          icon: "/icon.png",
          url: "/",
        })
      );
      console.log("Scheduled push delivered");
    } catch (err) {
      console.error("Scheduled push failed", err);
    }
  }, delay);

  res.json({ scheduled: true, delayMs: delay });
});

// ✅ Server listen
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
