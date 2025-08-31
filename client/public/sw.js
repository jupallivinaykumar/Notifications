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

self.addEventListener("push", (event) => {
  console.log("Push received:", event);

  const data = event.data.json();
  const options = {
    body: data.body,
    icon: data.icon || "/icon.png",
    data: { url: data.url || "/" },
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(clients.openWindow(event.notification.data.url));
});


// --- Notification click event ---
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(clients.openWindow(event.notification.data.url));
});
