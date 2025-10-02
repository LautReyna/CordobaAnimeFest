async function obtenerSubscription(){
    if(!('serviceWorker' in navigator)) throw new Error('No SW support')
    const reg = await navigator.serviceWorker.getRegistration('/www/') || await navigator.serviceWorker.register('/www/sw.js')
    let sub = await reg.pushManager.getSubscription()
    
    if(!sub){
        // pedir clave pública y crear suscripción
        const keyRes = await fetch('/notificaciones/vapidPublicKey')
        const { publicKey } = await keyRes.json()
        const appServerKey = (function urlBase64ToUnit8Array(base64String){
            const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
            const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
            const rawData = atob(base64)
            return Uint8Array.from([...rawData].map(c => c.charCodeAt(0)))
        })(publicKey)
        sub = await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: appServerKey })
    }
    
    // SIEMPRE guardar/actualizar la suscripción en el backend
    try {
        await fetch('/notificaciones/subscribe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(sub)
        })
    } catch(error) {
        console.warn('Error guardando suscripción:', error)
    }
    
    return sub
}


async function crearOActualizarAlerta(idEvento, modo){
    const sub = await obtenerSubscription()
    const res = await fetch('/api/v1/alertas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ endpoint: sub.endpoint, idEvento, modo })
    })
    const data = await res.json()
    if(!res.ok) throw new Error(data?.mensaje || 'Error creando alerta')
    return data
}

async function listarAlertas(){
    const sub = await obtenerSubscription()
    const res = await fetch('/api/v1/alertas?endpoint=' + encodeURIComponent(sub.endpoint))
    const data = await res.json()
    if(!res.ok) throw new Error(data?.mensaje || 'Error listando alertas')
    return data
}

async function eliminarAlerta(id){
    const sub = await obtenerSubscription()
    const res = await fetch('/api/v1/alertas/' + id, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ endpoint: sub.endpoint })
    })
    const data = await res.json()
    if(!res.ok) throw new Error(data?.mensaje || 'Error eliminando alerta')
    return data
}

// Función para renderizar alertas del usuario
export function renderizarAlertas(datosAlertas) {
    const contenedorAlertas = document.getElementById('contenedor-alertas')
    if (!contenedorAlertas) return
    
    if (!datosAlertas || datosAlertas.length === 0) {
        contenedorAlertas.innerHTML = '<p class="text-center">No tienes alertas programadas</p>'
        return
    }
    
    let html = '<div class="row">'
    datosAlertas.forEach(alerta => {
        const modoTexto = {
            'todos': 'Todos los cambios',
            'por_iniciar': 'Por iniciar',
            'en_curso': 'En curso'
        }[alerta.modo] || alerta.modo
        
        html += `
            <div class="col-md-6 col-lg-4 mb-3">
                <div class="card h-100">
                    <div class="card-body">
                        <h5 class="card-title">Evento #${alerta.idEvento}</h5>
                        <p class="card-text">Modo: ${modoTexto}</p>
                        <small class="text-muted">Creada: ${new Date(alerta.created_at).toLocaleDateString()}</small>
                    </div>
                    <div class="card-footer">
                        <button class="btn btn-sm btn-outline-primary me-2" onclick="editarAlerta(${alerta.id})">Editar</button>
                        <button class="btn btn-sm btn-outline-danger" onclick="eliminarAlerta(${alerta.id})">Eliminar</button>
                    </div>
                </div>
            </div>
        `
    })
    html += '</div>'
    contenedorAlertas.innerHTML = html
}

export { obtenerSubscription, crearOActualizarAlerta, listarAlertas, eliminarAlerta }