// Service Worker for GbadeData PWA and Push Notifications

self.addEventListener('push', function (event) {
  if (event.data) {
    try {
      const data = event.data.json();
      const options = {
        body: data.body || 'New message update!',
        icon: data.icon || '/favicon.ico',
        badge: '/favicon.ico',
        vibrate: [100, 50, 100],
        data: {
          dateOfArrival: Date.now(),
          primaryKey: '1',
        },
      };
      event.waitUntil(self.registration.showNotification(data.title || 'Notification', options));
    } catch (err) {
      // Fallback if data is not JSON
      const text = event.data.text();
      event.waitUntil(
        self.registration.showNotification('Data Analyst Alert', {
          body: text,
          icon: '/favicon.ico',
        })
      );
    }
  }
});

self.addEventListener('notificationclick', function (event) {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('/')
  );
});
