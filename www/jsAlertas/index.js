import { obtenerSubscription, crearOActualizarAlerta, listarAlertas, eliminarAlerta as eliminarAlertaAPI, renderizarAlertas } from './funciones.js'

// Variables globales para el modal
let modalEl, bsModal, eventoActual = null
let datosEventosGlobales = []

// Crear modal para programar alertas
function crearModalProgramarAlerta() {
    modalEl = document.createElement('div')
    modalEl.className = 'modal fade'
    modalEl.id = 'modal-programar-alerta'
    modalEl.innerHTML = `
    <div class="modal-dialog modal-lg">
      <div class="modal-content shadow-lg">
        <div class="modal-header bg-primary text-white">
          <h5 class="modal-title fw-bold fs-4">
            <i class="bi bi-bell me-2"></i>
            Programar Alerta
          </h5>
          <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Cerrar"></button>
        </div>
        <div class="modal-body">
          <div class="row">
            <div class="col-md-8">
              <div class="mb-4">
                <label class="form-label fw-semibold">
                  <i class="bi bi-gear me-1"></i>
                  Tipo de Notificación
                </label>
                <select id="modo-alerta" class="form-select form-select-lg">
                  <option value="todos" selected>
                    <i class="bi bi-bell-fill me-1"></i>
                    Cada cambio de estado
                  </option>
                  <option value="por_iniciar">
                    <i class="bi bi-clock me-1"></i>
                    Cuando esté por iniciar
                  </option>
                  <option value="en_curso">
                    <i class="bi bi-play-circle me-1"></i>
                    Cuando esté en curso
                  </option>
                </select>
                <div class="form-text">
                  <i class="bi bi-info-circle me-1"></i>
                  Selecciona cuándo quieres recibir notificaciones sobre este evento
                </div>
              </div>
              
              <div class="card bg-light">
                <div class="card-body">
                  <h6 class="fw-bold text-primary mb-3">
                    <i class="bi bi-info-circle me-1"></i>
                    Información de la Alerta
                  </h6>
                  <div class="row">
                    <div class="col-6">
                      <div class="border-end">
                        <h6 class="fw-bold text-success mb-1">Estado Actual</h6>
                        <span class="badge bg-success fs-6" id="estado-actual">Pendiente</span>
                      </div>
                    </div>
                    <div class="col-6">
                      <h6 class="fw-bold text-primary mb-1">Notificaciones</h6>
                      <span class="badge bg-primary fs-6" id="tipo-notificacion">Configuradas</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="col-md-4 text-center">
              <div class="bg-light rounded p-4">
                <i class="bi bi-bell-fill text-primary" style="font-size: 3rem;"></i>
                <h6 class="mt-3 mb-2 fw-bold">Sistema de Alertas</h6>
                <p class="text-muted small mb-0">
                  Recibe notificaciones automáticas sobre cambios en tus eventos favoritos
                </p>
              </div>
            </div>
          </div>
          
          <div id="msg-alerta" class="mt-3"></div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary btn-lg" data-bs-dismiss="modal">
            <i class="bi bi-x-circle me-1"></i>
            Cancelar
          </button>
          <button type="button" class="btn btn-primary btn-lg" id="btn-guardar-alerta">
            <i class="bi bi-check-circle me-1"></i>
            Guardar Alerta
          </button>
        </div>
      </div>
    </div>`
    document.body.appendChild(modalEl)
    
    // Inicializar Bootstrap modal
    bsModal = new bootstrap.Modal(modalEl)
    
    // Event listener para actualizar información cuando cambia el modo
    modalEl.querySelector('#modo-alerta').addEventListener('change', () => {
        if (eventoActual) {
            actualizarInformacionEvento(eventoActual)
        }
    })
    // Event listener para guardar
    modalEl.querySelector('#btn-guardar-alerta').addEventListener('click', async () => {
        const select = modalEl.querySelector('#modo-alerta')
        const modo = select.value
        const msg = modalEl.querySelector('#msg-alerta')
        
        // Validaciones
        if (!eventoActual || isNaN(eventoActual)) {
            msg.textContent = 'Error: No se ha seleccionado un evento válido'
            return
        }
        
        if (!modo) {
            msg.textContent = 'Error: Debe seleccionar un tipo de notificación'
            return
        }
        
        msg.textContent = 'Guardando...'
        
        try {
            console.log('Creando alerta para evento:', eventoActual, 'modo:', modo)
            const r = await crearOActualizarAlerta(eventoActual, modo)
            msg.textContent = r.mensaje || 'Listo'
            
            // Recargar alertas si estamos en la página de alertas
            if (document.getElementById('contenedor-alertas')) {
                // Mostrar indicador de carga
                const contenedor = document.getElementById('contenedor-alertas')
                contenedor.innerHTML = `
                    <div class="text-center py-5">
                        <div class="spinner-border text-primary" role="status">
                            <span class="visually-hidden">Actualizando...</span>
                        </div>
                        <p class="mt-3 text-muted">Actualizando alertas...</p>
                    </div>
                `
                await cargarAlertas()
            }
            
            setTimeout(() => {
                bsModal.hide()
            }, 600)
        } catch (error) {
            console.error('Error creando alerta:', error)
            msg.textContent = error.message || 'Error'
        }
    })
}

// Función para cargar datos de eventos globales
async function cargarDatosEventos() {
    try {
        const response = await fetch('/api/v1/eventos/caf/activa')
        datosEventosGlobales = await response.json()
    } catch (error) {
        console.error('Error cargando eventos:', error)
        datosEventosGlobales = []
    }
}

// Función para abrir modal (expuesta globalmente)
window.abrirModalProgramarAlerta = function(idevento) {
    if (!modalEl) crearModalProgramarAlerta()
    
    
    if (!idevento) {
        console.error('Error: No se proporcionó idEvento')
        return
    }
    
    
    eventoActual = idevento
    console.log('eventoActual asignado:', eventoActual)
    
    modalEl.querySelector('#msg-alerta').textContent = ''
    // Actualizar información del evento en el modal
    actualizarInformacionEvento(idevento)
    bsModal.show()
}
// Función para actualizar la información del evento en el modal
function actualizarInformacionEvento(idevento) {
    // Buscar el evento en los datos globales
    const evento = datosEventosGlobales?.find(e => e.id === idevento)
    
    if (evento) {
        // Actualizar estado actual
        const estadoActual = modalEl.querySelector('#estado-actual')
        if (estadoActual) {
            estadoActual.textContent = evento.estado || 'Pendiente'
            
            // Cambiar color del badge según el estado
            estadoActual.className = 'badge fs-6'
            switch(evento.estado) {
                case 'En Curso':
                    estadoActual.classList.add('bg-success')
                    break
                case 'Por Iniciar':
                    estadoActual.classList.add('bg-warning')
                    break
                case 'Finalizado':
                    estadoActual.classList.add('bg-secondary')
                    break
                default:
                    estadoActual.classList.add('bg-info')
            }
        }
        
        // Actualizar tipo de notificación según la selección
        const tipoNotificacion = modalEl.querySelector('#tipo-notificacion')
        const modoAlerta = modalEl.querySelector('#modo-alerta')
        
        if (tipoNotificacion && modoAlerta) {
            const modoTexto = {
                'todos': 'Todos los cambios',
                'por_iniciar': 'Por iniciar',
                'en_curso': 'En curso'
            }[modoAlerta.value] || 'Configuradas'
            
            tipoNotificacion.textContent = modoTexto
        }
    }
}

// Función para editar alerta (expuesta globalmente)
window.editarAlerta = async function(id) {
    console.log('Editando alerta:', id)
    
    try {
        // Buscar la alerta en los datos actuales
        const alertas = await listarAlertas()
        const alerta = alertas.find(a => a.id === id)
        
        if (!alerta) {
            alert('No se encontró la alerta')
            return
        }
        
        // Validar que la alerta tenga idEvento
        if (!alerta.idevento) {
            console.error('Error: La alerta no tiene idEvento válido:', alerta)
            alert('Error: La alerta no tiene información del evento válida')
            return
        }
        
        // Abrir el modal de programar alerta con los datos de la alerta existente
        if (window.abrirModalProgramarAlerta) {
            window.abrirModalProgramarAlerta(alerta.idevento)
            
            // Cambiar el modo de la alerta después de que se abra el modal
            setTimeout(() => {
                const selectModo = document.querySelector('#modo-alerta')
                if (selectModo) {
                    selectModo.value = alerta.modo
                }
            }, 100)
        } else {
            alert('Error: No se pudo abrir el modal de edición')
        }
    } catch (error) {
        console.error('Error en editarAlerta:', error)
        alert('Error editando alerta: ' + error.message)
    }
}

// Función para eliminar alerta (expuesta globalmente)
window.eliminarAlerta = async function(id) {
    console.log('Eliminando alerta:', id)
    
    if (confirm('¿Estás seguro de que quieres eliminar esta alerta?')) {
        try {
            await eliminarAlertaAPI(id)
            await cargarAlertas() // Recargar lista
            console.log('Alerta eliminada correctamente')
        } catch (error) {
            console.error('Error eliminando alerta:', error)
            alert('Error eliminando alerta: ' + error.message)
        }
    }
}

// Cargar y mostrar alertas del usuario
async function cargarAlertas() {
    try {
        console.log('Recargando alertas...')
        const alertas = await listarAlertas()
        renderizarAlertas(alertas)
        console.log('Alertas recargadas correctamente')
    } catch (error) {
        console.error('Error cargando alertas:', error)
        const contenedor = document.getElementById('contenedor-alertas')
        if (contenedor) {
            contenedor.innerHTML = `
                <div class="text-center py-5">
                    <i class="bi bi-exclamation-triangle text-danger" style="font-size: 3rem;"></i>
                    <h5 class="mt-3 text-danger">Error cargando alertas</h5>
                    <p class="text-muted">${error.message || 'Error desconocido'}</p>
                    <button class="btn btn-primary" onclick="cargarAlertas()">
                        <i class="bi bi-arrow-clockwise me-1"></i>
                        Reintentar
                    </button>
                </div>
            `
        }
    }
}

// La función suscribirse() ya no es necesaria
// La suscripción se maneja automáticamente en crearOActualizarAlerta()

// Inicializar cuando se carga la página
document.addEventListener('DOMContentLoaded', async () => {
    // Cargar datos de eventos globales
    await cargarDatosEventos()
    
    // Si estamos en la página de alertas, cargar las alertas
    if (document.getElementById('contenedor-alertas')) {
        cargarAlertas()
    }
    
    // El botón de suscripción separado ya no es necesario
    // La suscripción se maneja automáticamente al crear alertas
})
