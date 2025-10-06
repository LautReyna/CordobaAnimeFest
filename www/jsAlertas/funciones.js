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
    console.log('Iniciando crearOActualizarAlerta con:', { idEvento, modo })
    
    try {
        // Obtener suscripción (esto maneja automáticamente la suscripción si no existe)
        const sub = await obtenerSubscription()
        console.log('Subscription obtenida:', sub)
        
        const res = await fetch('/api/v1/alertas', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ endpoint: sub.endpoint, idEvento, modo })
        })
        
        console.log('Respuesta del servidor:', res.status)
        const data = await res.json()
        console.log('Datos de respuesta:', data)
        
        if(!res.ok) throw new Error(data?.mensaje || 'Error creando alerta')
        
        // Mensaje mejorado que indica que la suscripción se activó automáticamente
        const mensajeMejorado = data.mensaje || 'Alerta creada correctamente'
        return { ...data, mensaje: mensajeMejorado }
        
    } catch (error) {
        console.error('Error en crearOActualizarAlerta:', error)
        
        // Si el error es por permisos de notificaciones, dar mensaje más claro
        if (error.message.includes('No SW support') || error.message.includes('permission')) {
            throw new Error('Para recibir notificaciones, necesitas permitir las notificaciones en tu navegador. Por favor, habilita las notificaciones y vuelve a intentar.')
        }
        
        throw error
    }
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
        contenedorAlertas.innerHTML = `
            <div class="text-center py-5">
                <i class="bi bi-bell-slash text-muted" style="font-size: 3rem;"></i>
                <h5 class="mt-3 text-muted">No tienes alertas programadas</h5>
                <p class="text-muted">¡Programa alertas para tus eventos favoritos!</p>
            </div>
        `
        return
    }
    
    let html = '<div class="row g-4">'
    datosAlertas.forEach(alerta => {
        const modoTexto = {
            'todos': 'Todos los cambios',
            'por_iniciar': 'Por iniciar',
            'en_curso': 'En curso'
        }[alerta.modo] || alerta.modo
        
        const modoIcono = {
            'todos': 'bi-bell-fill',
            'por_iniciar': 'bi-clock',
            'en_curso': 'bi-play-circle'
        }[alerta.modo] || 'bi-bell'
        
        const modoColor = {
            'todos': 'primary',
            'por_iniciar': 'warning',
            'en_curso': 'success'
        }[alerta.modo] || 'secondary'
        
        console.log(alerta.nombreEvento)
        html += `
            <div class="col-md-6 col-lg-4"> 
                <div class="card h-100 shadow-sm border-0">
                    <div class="card-header bg-${modoColor} text-white">
                        <div class="d-flex justify-content-between align-items-center">
                            <h6 class="mb-0 fw-bold">
                                <i class="bi ${modoIcono} me-2"></i>
                                ${alerta.nombreevento || `Evento #${alerta.idevento}`}
                            </h6>
                            <span class="badge bg-light text-dark">${modoTexto}</span>
                        </div>
                    </div>
                    <div class="card-body">
                        <div class="mb-3">
                            <h6 class="fw-bold text-primary mb-2">
                                <i class="bi bi-gear me-1"></i>
                                Configuración
                            </h6>
                            <p class="mb-0 text-muted">Modo: <span class="fw-semibold">${modoTexto}</span></p>
                        </div>
                        ${alerta.nombreZona ? `
                        <div class="mb-3">
                            <h6 class="fw-bold text-primary mb-2">
                                <i class="bi bi-geo-alt me-1"></i>
                                Ubicación
                            </h6>
                            <p class="mb-0 text-muted">${alerta.nombreZona}</p>
                        </div>
                        ` : ''}
                        <div class="mb-3">
                            <h6 class="fw-bold text-primary mb-2">
                                <i class="bi bi-calendar me-1"></i>
                                Fecha de Creación
                            </h6>
                            <p class="mb-0 text-muted">${new Date(alerta.created_at).toLocaleDateString('es-ES', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            })}</p>
                        </div>
                    </div>
                    <div class="card-footer bg-light">
                        <div class="d-flex gap-2">
                            <button class="btn btn-outline-primary btn-sm flex-fill" onclick="editarAlerta(${alerta.id})">
                                <i class="bi bi-pencil me-1"></i>
                                Editar
                            </button>
                            <button class="btn btn-outline-danger btn-sm flex-fill" onclick="eliminarAlerta(${alerta.id})">
                                <i class="bi bi-trash me-1"></i>
                                Eliminar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `
    })
    html += '</div>'
    contenedorAlertas.innerHTML = html
}

export { obtenerSubscription, crearOActualizarAlerta, listarAlertas, eliminarAlerta }