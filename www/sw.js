self.addEventListener('push', event => {
    let data = { title: 'Notificacion', body: 'Hay una notificacion', url:'/'}
    if(event.data){
        try{
            data = event.data.json()
        }catch(error){
            data.body = event.data.text()
        }
    }

    const options = {
        body: data.body,
        icon: '/recursos/logoCAF.png',
        badge: '/recursos/logoCAF.png',
        data: { url: data.url || '/' }
    }

    event.waitUntil(self.registration.showNotification(data.title, options))
})

self.addEventListener('notificationclick', event => {
    event.notification.close()
    const url = event.notification.data?.url || '/www/index.html'
    event.waitUntil(
        clients.matchAll({ type: 'window' }).then(windowClients => {
            for(const client of windowClients){
                if(client.url === url && 'focus' in client) return client.focus()
            }
            if(clients.openWindow) return clients.openWindow(url)
        })
    )
})