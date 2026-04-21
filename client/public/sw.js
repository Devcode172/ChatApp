// This service worker listens for web push notifications

self.addEventListener('push', function(event) {
    if (event.data) {
        const data = event.data.json()
        const title = data.title || 'New Message'
        const options = {
            body: data.body,
            icon: data.icon || '/AV1.png',
            badge: data.icon || '/AV1.png',
            data: {
                url: '/' // When clicked, it will open the chat app
            }
        }

        event.waitUntil(self.registration.showNotification(title, options))
    }
})

self.addEventListener('notificationclick', function(event) {
    event.notification.close()

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
            // If the app is already open in a tab, focus it
            for (let i = 0; i < clientList.length; i++) {
                const client = clientList[i]
                if (client.url.includes(self.location.origin) && 'focus' in client) {
                    return client.focus()
                }
            }
            // Otherwise, open a new window
            if (clients.openWindow) {
                return clients.openWindow(event.notification.data.url)
            }
        })
    )
})

// A basic fetch handler is required for some browsers (like Chrome) to trigger the PWA "Add to Home Screen" prompt.
// We keep it empty to just pass the PWA requirement without interfering with network requests.
self.addEventListener('fetch', function(event) {
    // Do nothing. The browser will handle the request normally.
})
