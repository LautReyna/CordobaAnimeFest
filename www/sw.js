// Evento que se dispara cuando se recibe un push (notificación push)
self.addEventListener('push', event => {
    // Datos por defecto de la notificación
    let data = { title: 'Notificacion', body: 'Hay una notificacion', url:'/'}
    // Si el evento trae datos, intenta obtenerlos como JSON
    if(event.data){
        try{
            data = event.data.json()
        }catch(error){
            // Si no es JSON, usa el texto como body
            data.body = event.data.text()
        }
    }

    // Opciones de la notificación (icono, badge, url, etc)
    const options = {
        body: data.body,
        icon: '/recursos/logoCAF.png',
        badge: '/recursos/logoCAF.png',
        data: { url: data.url || '/' }
    }

    // Muestra la notificación al usuario
    event.waitUntil(self.registration.showNotification(data.title, options))
})

// Evento que se dispara cuando el usuario hace click en la notificación
self.addEventListener('notificationclick', event => {
    // Cierra la notificación
    event.notification.close()
    // Obtiene la URL asociada a la notificación, o una por defecto
    const url = event.notification.data?.url || '/www/index.html'
    // Busca si ya hay una ventana abierta con esa URL, si no la abre
    event.waitUntil(
        clients.matchAll({ type: 'window' }).then(windowClients => {
            for(const client of windowClients){
                // Si ya hay una ventana con esa URL, la enfoca
                if(client.url === url && 'focus' in client) return client.focus()
            }
            // Si no existe, abre una nueva ventana con la URL
            if(clients.openWindow) return clients.openWindow(url)
        })
    )
})