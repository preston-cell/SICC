// Service Worker for Push Notifications
// Estate Planning Assistant

const CACHE_NAME = "estate-plan-v1";

// Install event - cache essential assets
self.addEventListener("install", (event) => {
  console.log("Service Worker: Installing...");
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  console.log("Service Worker: Activating...");
  event.waitUntil(clients.claim());
});

// Push notification event
self.addEventListener("push", (event) => {
  console.log("Service Worker: Push received");

  let data = {
    title: "Estate Planning Reminder",
    body: "You have a pending reminder",
    icon: "/icon-192.png",
    badge: "/badge-72.png",
    url: "/",
  };

  // Parse push data if available
  if (event.data) {
    try {
      data = { ...data, ...event.data.json() };
    } catch (e) {
      console.error("Error parsing push data:", e);
    }
  }

  const options = {
    body: data.body,
    icon: data.icon || "/icon-192.png",
    badge: data.badge || "/badge-72.png",
    vibrate: [100, 50, 100],
    data: {
      url: data.url || "/",
      dateOfArrival: Date.now(),
    },
    actions: [
      {
        action: "view",
        title: "View",
        icon: "/icon-view.png",
      },
      {
        action: "snooze",
        title: "Snooze",
        icon: "/icon-snooze.png",
      },
    ],
    tag: data.tag || "estate-plan-reminder",
    renotify: true,
    requireInteraction: data.priority === "urgent",
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Notification click event
self.addEventListener("notificationclick", (event) => {
  console.log("Service Worker: Notification clicked");

  event.notification.close();

  const action = event.action;
  const notificationData = event.notification.data;

  if (action === "snooze") {
    // Handle snooze action - call snooze API
    event.waitUntil(
      fetch("/api/reminders/snooze?days=1", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reminderId: notificationData.reminderId }),
      })
    );
  } else {
    // Default: open the app to the reminders page
    const urlToOpen = notificationData?.url || "/";

    event.waitUntil(
      clients
        .matchAll({ type: "window", includeUncontrolled: true })
        .then((windowClients) => {
          // Check if there is already a window/tab open
          for (const client of windowClients) {
            if (client.url.includes(urlToOpen) && "focus" in client) {
              return client.focus();
            }
          }
          // If no window is open, open a new one
          if (clients.openWindow) {
            return clients.openWindow(urlToOpen);
          }
        })
    );
  }
});

// Notification close event
self.addEventListener("notificationclose", (event) => {
  console.log("Service Worker: Notification closed");
});
