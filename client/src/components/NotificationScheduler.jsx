import React, { useState } from "react";

export default function NotificationScheduler() {
  const [scheduled, setScheduled] = useState([]);
  const [dateTime, setDateTime] = useState("");
  const [message, setMessage] = useState("");

  // Ask for permission to send notifications
  const requestPermission = async () => {
    if ("Notification" in window) {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        alert("Please allow notifications in your browser.");
      }
    }
  };

  // Schedule notification
  const handleSchedule = () => {
    if (!dateTime) {
      alert("Please select a date and time.");
      return;
    }

    const targetTime = new Date(dateTime).getTime();
    const now = Date.now();
    const delay = targetTime - now;

    if (delay <= 0) {
      alert("Please select a future date and time for the notification.");
      return;
    }

    const id = Date.now();
    const newItem = { id, time: targetTime, message };
    setScheduled([...scheduled, newItem]);

    alert(`Notification scheduled for ${new Date(targetTime).toLocaleString()}!`);

    // Schedule actual notification
    setTimeout(() => {
      new Notification("Reminder 🔔", {
        body: message || "This is your scheduled notification.",
        icon: "/icon.png",
      });
    }, delay);

    setDateTime("");
    setMessage("");
  };

  // Remove scheduled notification
  const handleRemove = (id) => {
    setScheduled(scheduled.filter((item) => item.id !== id));
  };

  return (
    <div className="page-container">
      <div className="card">
        <h2 className="text-xl font-bold mb-4">Schedule a Notification</h2>

        <input
          type="datetime-local"
          value={dateTime}
          onChange={(e) => setDateTime(e.target.value)}
          className="border p-2 w-full rounded mb-3"
        />

        <input
          type="text"
          placeholder="Notification message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="border p-2 w-full rounded mb-3"
        />

        <button
          onClick={() => {
            requestPermission();
            handleSchedule();
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded w-full"
        >
          Schedule Notification
        </button>

        <h3 className="mt-6 font-semibold">Scheduled Notifications:</h3>
        <ul className="mt-2">
          {scheduled.map((item) => (
            <li
              key={item.id}
              className="flex justify-between items-center border p-2 rounded mb-2"
            >
              <span>
                {new Date(item.time).toLocaleString()} →{" "}
                {item.message || "No message"}
              </span>
              <button
                onClick={() => handleRemove(item.id)}
                className="bg-red-500 text-white px-2 py-1 rounded"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
