// public/sw.js

// Listen for messages from the client
self.addEventListener("message", (event) => {
  const { title, body } = event.data;

  self.registration.showNotification(title, {
    body,
    icon: "/icon.png" // optional
  });
});

// Handle notification click
self.addEventListener("message", (event) => {
  const { title, body } = event.data;
  self.registration.showNotification(title, { body, icon: "/icon.png" });
});
