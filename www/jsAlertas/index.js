// Registramos el service worker
async function registrarSW(){
    if(!('serviceWorker' in navigator)) throw new Error('No SW support')
    const reg = await navigator.serviceWorker.register('/www/sw.js')
    console.log('SW registrado', reg)
    return reg
}

// hepler para convertir la key
function urlBase64ToUnit8Array(base64String){
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
    const rawData = atob(base64)
    return Uint8Array.from([...rawData].map(c => c.charCodeAt(0)))
}

// subscribimos al usuario
async function suscribirse(){
    try{
        const keyRes = await fetch('/notificaciones/vapidPublicKey')
        const { publicKey } = await keyRes.json()

        console.log('PublicKey dede backend', publicKey, typeof publicKey)
        console.log('Array:', urlBase64ToUnit8Array(publicKey))
        const reg = await registrarSW()
        const subscription = await reg.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUnit8Array(publicKey)
        })

        // enviamos la suscripcion al backend
        const res = await fetch('/notificaciones/subscribe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(subscription)
        })
        
        const info = await res.json()        
        alert(info.mensaje ||'Suscripto')
    }catch(error){
        console.error('Error suscripcion', error)
        alert('No se pudo suscribir' + error.mensaje)
    }
}


// ejecutar
document.addEventListener('click', (e) => {
    const btn = e.target.closest('#btn-notificacion')
    if(btn){
        e.preventDefault()
        try{
            suscribirse()
        }catch(error){
            console.log(error)
        }
    }
})