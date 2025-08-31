import "./index.css";
import NotificationScheduler from "./components/NotificationScheduler";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./App.css";
import OneSignal from "react-onesignal";

async function initOneSignal() {
  await OneSignal.init({
    appId: "YOUR_ONESIGNAL_APP_ID", // replace with your real OneSignal App ID
    safari_web_id: "", // optional, only for Safari web push
    allowLocalhostAsSecureOrigin: true,
    notifyButton: {
      enable: true, // floating bell icon
    },
  });
}

initOneSignal();

if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/service-worker.js")
    .then((reg) => console.log("Service Worker registered:", reg))
    .catch((err) => console.error("Service Worker registration failed:", err));
}


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
