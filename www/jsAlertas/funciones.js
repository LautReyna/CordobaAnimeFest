// Función para obtener la suscripción de notificaciones push
async function obtenerSubscription(){
    // Verifica si el navegador soporta Service Workers
    if(!('serviceWorker' in navigator)) throw new Error('No SW support')
    // Obtiene el registro del Service Worker o lo registra si no existe
    const reg = await navigator.serviceWorker.getRegistration('/www/') || await navigator.serviceWorker.register('/www/sw.js')
    // Intenta obtener la suscripción existente
    let sub = await reg.pushManager.getSubscription()
    
    if(!sub){
        // Si no hay suscripción, solicita la clave pública al backend
        const keyRes = await fetch('/notificaciones/vapidPublicKey')
        const { publicKey } = await keyRes.json()
        // Convierte la clave pública de base64 a Uint8Array
        const appServerKey = (function urlBase64ToUnit8Array(base64String){
            const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
            const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
            const rawData = atob(base64)
            return Uint8Array.from([...rawData].map(c => c.charCodeAt(0)))
        })(publicKey)
        // Crea la suscripción push
        sub = await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: appServerKey })
    }
    
    // Siempre guarda o actualiza la suscripción en el backend
    try {
        await fetch('/notificaciones/subscribe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(sub)
        })
    } catch(error) {
        // Si hay error al guardar la suscripción, solo muestra advertencia
        console.warn('Error guardando suscripción:', error)
    }
    
    // Devuelve la suscripción
    return sub
}


// Función para crear o actualizar una alerta de evento
async function crearOActualizarAlerta(idEvento, modo){
    console.log('Iniciando crearOActualizarAlerta con:', { idEvento, modo })
    
    try {
        // Obtiene la suscripción push (la crea si no existe)
        const sub = await obtenerSubscription()
        
        // Envía la solicitud al backend para crear/actualizar la alerta
        const res = await fetch('/api/v1/alertas', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ endpoint: sub.endpoint, idEvento, modo })
        })
        
        const data = await res.json()
        
        // Si la respuesta no es exitosa, lanza error
        if(!res.ok) throw new Error(data?.mensaje || 'Error creando alerta')
        
        // Devuelve el mensaje del backend o uno por defecto
        const mensajeMejorado = data.mensaje || 'Alerta creada correctamente'
        return { ...data, mensaje: mensajeMejorado }
        
    } catch (error) {
        console.error('Error en crearOActualizarAlerta:', error)
        
        // Si el error es por permisos de notificaciones, muestra mensaje claro al usuario
        if (error.message.includes('No SW support') || error.message.includes('permission')) {
            throw new Error('Para recibir notificaciones, necesitas permitir las notificaciones en tu navegador. Por favor, habilita las notificaciones y vuelve a intentar.')
        }
        
        throw error
    }
}

// Función para listar todas las alertas del usuario
async function listarAlertas(){
    // Obtiene la suscripción push
    const sub = await obtenerSubscription()
    // Solicita al backend la lista de alertas asociadas al endpoint
    const res = await fetch('/api/v1/alertas?endpoint=' + encodeURIComponent(sub.endpoint))
    const data = await res.json()
    // Si hay error, lanza excepción
    if(!res.ok) throw new Error(data?.mensaje || 'Error listando alertas')
    return data
}

// Función para eliminar una alerta específica
async function eliminarAlerta(id){
    // Obtiene la suscripción push
    const sub = await obtenerSubscription()
    // Envía la solicitud DELETE al backend para eliminar la alerta
    const res = await fetch('/api/v1/alertas/' + id, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ endpoint: sub.endpoint })
    })
    const data = await res.json()
    // Si hay error, lanza excepción
    if(!res.ok) throw new Error(data?.mensaje || 'Error eliminando alerta')
    return data
}

// Función para renderizar alertas del usuario en el DOM
export function renderizarAlertas(datosAlertas) {
    // Obtiene el contenedor donde se mostrarán las alertas
    const contenedorAlertas = document.getElementById('contenedor-alertas')
    if (!contenedorAlertas) return
    
    // Si no hay alertas, muestra mensaje
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
    
    // Si hay alertas, genera el HTML para cada una
    let html = '<div class="row g-4">'
    datosAlertas.forEach(alerta => {
        // Traduce el modo a texto legible
        const modoTexto = {
            'todos': 'Todos los cambios',
            'por_iniciar': 'Por iniciar',
            'en_curso': 'En curso'
        }[alerta.modo] || alerta.modo
        
        // Selecciona el ícono según el modo
        const modoIcono = {
            'todos': 'bi-bell-fill',
            'por_iniciar': 'bi-clock',
            'en_curso': 'bi-play-circle'
        }[alerta.modo] || 'bi-bell'
        
        // Selecciona el color según el modo
        const modoColor = {
            'todos': 'primary',
            'por_iniciar': 'warning',
            'en_curso': 'success'
        }[alerta.modo] || 'secondary'
        
        // Genera el HTML de la tarjeta de alerta
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
    // Inserta el HTML generado en el contenedor
    contenedorAlertas.innerHTML = html
}

// Exporta las funciones principales para uso externo
export { obtenerSubscription, crearOActualizarAlerta, listarAlertas, eliminarAlerta }