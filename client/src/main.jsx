import "./index.css";
import NotificationScheduler from "./components/NotificationScheduler";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Register service worker
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((reg) => {
        console.log("✅ Service Worker registered:", reg);
      })
      .catch((err) => {
        console.error("❌ Service Worker registration failed:", err);
      });
  });
}

