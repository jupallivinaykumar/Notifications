// client/public/service-worker.js

// --- Install event ---
self.addEventListener("install", (event) => {
  console.log("Service Worker installed");
  self.skipWaiting(); // activate immediately
});

// --- Activate event ---
self.addEventListener("activate", (event) => {
  console.log("Service Worker activated");
  return self.clients.claim(); // take control of all open tabs
});

// --- Fetch event (optional for caching later) ---
self.addEventListener("fetch", (event) => {
  // Currently just lets requests pass through
});

// --- Push Notification event ---
self.addEventListener("push", (event) => {
  console.log("Push received:", event);

  let data = {};
  try {
    data = event.data.json();
  } catch (e) {
    data = { title: "Notification", body: event.data.text() };
  }

  const options = {
    body: data.body,
    icon: data.icon || "/icon.png",
    data: { url: data.url || "/" },
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// --- Notification click event ---
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(clients.openWindow(event.notification.data.url));
});
