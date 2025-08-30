// client/public/service-worker.js

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

// Handle notification click
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(clients.openWindow(event.notification.data.url));
});
