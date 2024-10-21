self.addEventListener('push', (event) => {
    if(event.data) {
        const data = event.data.json()
        const options = {
            body: data.body,
            icon: data.icon ?? '/mcc_scaffold_cube.png',
            badge: data.badge ?? '/mcc_scaffold_cube.png',
            tag: data.tag,
            data: {
                dateOfArrival: Date.now(),
                primaryKey: '2'
            }
        }

        event.waitUntil(self.registration.showNotification(data.title, options))
    }
})

self.addEventListener('notificationclick', (event) => {
    event.notification.close()
    event.waitUntil(clients.openWindow("https://mccreations.net"))
})