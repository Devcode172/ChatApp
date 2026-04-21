// This service worker listens for web push notifications

self.addEventListener('push', function(event) {
    if (event.data) {
        const data = event.data.json()
        const title = data.title || 'New Message'
        const options = {
            body: data.body,
            icon: data.icon || '/TalkNest_logo.png',
            badge: data.icon || '/TalkNest_logo.png',
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
// This simple pass-through fetch does not cache aggressively, but satisfies the PWA installability requirements.
self.addEventListener('fetch', function(event) {
    event.respondWith(
        fetch(event.request).catch(function() {
            // Optional: return cached offline fallback page here if implemented
        })
    )
})
