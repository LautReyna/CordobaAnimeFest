import { obtenerSubscription, crearOActualizarAlerta, listarAlertas, eliminarAlerta, renderizarAlertas } from './funciones.js'

// Variables globales para el modal
let modalEl, bsModal, eventoActual = null

// Crear modal para programar alertas
function crearModalProgramarAlerta() {
    modalEl = document.createElement('div')
    modalEl.className = 'modal fade'
    modalEl.id = 'modal-programar-alerta'
    modalEl.innerHTML = `
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Programar alerta</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="mb-3">
            <label class="form-label">Modo</label>
            <select id="modo-alerta" class="form-select">
              <option value="todos" selected>Cada cambio de estado</option>
              <option value="por_iniciar">Cuando esté por iniciar</option>
              <option value="en_curso">Cuando esté en curso</option>
            </select>
          </div>
          <div id="msg-alerta" class="small"></div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
          <button type="button" class="btn btn-primary" id="btn-guardar-alerta">Guardar</button>
        </div>
      </div>
    </div>`
    document.body.appendChild(modalEl)
    
    // Inicializar Bootstrap modal
    bsModal = new bootstrap.Modal(modalEl)
    
    // Event listener para guardar
    modalEl.querySelector('#btn-guardar-alerta').addEventListener('click', async () => {
        const select = modalEl.querySelector('#modo-alerta')
        const modo = select.value
        const msg = modalEl.querySelector('#msg-alerta')
        msg.textContent = 'Guardando...'
        
        try {
            const r = await crearOActualizarAlerta(eventoActual, modo)
            msg.textContent = r.mensaje || 'Listo'
            setTimeout(() => {
                bsModal.hide()
            }, 600)
        } catch (error) {
            msg.textContent = error.message || 'Error'
        }
    })
}

// Función para abrir modal (expuesta globalmente)
window.abrirModalProgramarAlerta = function(idEvento) {
    if (!modalEl) crearModalProgramarAlerta()
    
    eventoActual = idEvento
    modalEl.querySelector('#msg-alerta').textContent = ''
    bsModal.show()
}

// Función para editar alerta (expuesta globalmente)
window.editarAlerta = async function(id) {
    // Por ahora, solo eliminar y recrear
    if (confirm('¿Editar esta alerta?')) {
        // Aquí podrías abrir un modal de edición
        console.log('Editar alerta:', id)
    }
}

// Función para eliminar alerta (expuesta globalmente)
window.eliminarAlerta = async function(id) {
    if (confirm('¿Eliminar esta alerta?')) {
        try {
            await eliminarAlerta(id)
            await cargarAlertas() // Recargar lista
        } catch (error) {
            alert('Error eliminando alerta: ' + error.message)
        }
    }
}

// Cargar y mostrar alertas del usuario
async function cargarAlertas() {
    try {
        const alertas = await listarAlertas()
        renderizarAlertas(alertas)
    } catch (error) {
        console.error('Error cargando alertas:', error)
        const contenedor = document.getElementById('contenedor-alertas')
        if (contenedor) {
            contenedor.innerHTML = '<p class="text-center text-danger">Error cargando alertas</p>'
        }
    }
}

// Suscribirse a notificaciones (botón en alertas.html)
async function suscribirse() {
    try {
        const sub = await obtenerSubscription()
        alert('Suscripto a notificaciones correctamente')
    } catch (error) {
        console.error('Error suscripcion', error)
        alert('No se pudo suscribir: ' + error.message)
    }
}

// Inicializar cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    // Si estamos en la página de alertas, cargar las alertas
    if (document.getElementById('contenedor-alertas')) {
        cargarAlertas()
    }
    
    // Event listener para el botón de suscripción
document.addEventListener('click', (e) => {
    const btn = e.target.closest('#btn-notificacion')
        if (btn) {
        e.preventDefault()
            suscribirse()
        }
    })
})
