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
                link: data.link
            }
        }

        event.waitUntil(self.registration.showNotification(data.title, options))
    }
})

self.addEventListener('notificationclick', (event) => {
    event.notification.close()
    // Open the page the notification is about (older notifications used singular paths like /map/foo)
    let link = (event.notification.data && event.notification.data.link) || "/"
    link = link.replace(/^\/(map|datapack|resourcepack)\//, "/$1s/")
    const url = new URL(link, self.location.origin)
    // Only ever open pages on this site
    const target = url.origin === self.location.origin ? url.href : self.location.origin
    event.waitUntil(clients.openWindow(target))
})