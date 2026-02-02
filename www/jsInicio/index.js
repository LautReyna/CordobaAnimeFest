// Importa las funciones necesarias
import { 
    obtenerRegistros, 
    carteleraMeet, 
    carteleraEventos, 
    cronogramaEventos, 
    renderizarMapa,
    modalMapa
} from './funciones.js'

// Esta función configura el evento click para los botones "Programar Alerta"
function configurarBotonesProgramarAlerta() {
    document.addEventListener('click', async (e) => {
        // Busca el botón más cercano con la clase .btn-programar-alerta
        const btn = e.target.closest('.btn-programar-alerta')
        if (!btn) return // Si no es el botón, no hace nada
        e.preventDefault()

        // Intenta obtener el id del evento desde el atributo data-event-id
        let idEvento = btn.dataset.eventId
        
        if (!idEvento) {
            // Si no lo encuentra, busca el item activo del carousel dentro del mismo modal
            const modal = btn.closest('.modal')
            const activeItem = modal?.querySelector('.carousel-item.active')
            idEvento = activeItem?.dataset.eventId
        }
        
        if (!idEvento) {
            // Si aún no encuentra el id, muestra una advertencia y termina
            console.warn('No se pudo determinar idEvento para programar alerta')
            return
        }
        
        // Valida que el idEvento sea un número válido
        const idEventoNumero = parseInt(idEvento)
        if (isNaN(idEventoNumero)) {
            console.error('Error: idEvento no es un número válido:', idEvento)
            return
        }
        
        // Llama a la función global para abrir el modal de programar alerta, si existe
        if (window.abrirModalProgramarAlerta) {
            window.abrirModalProgramarAlerta(idEventoNumero)
        } else {
            console.warn('No se encontró abrirModalProgramarAlerta')
        }
    })
}

// Función principal para inicializar la página y cargar los datos
async function inicializarPagina() {
    try {
        // Obtiene los datos de eventos y stands de la API en paralelo
        const [datosEventos, datosStands] = await Promise.all([
            obtenerRegistros('/api/v1/eventos/caf/activa'),
            obtenerRegistros('/api/v1/stands/caf/activa')
        ])

        // Renderiza los diferentes componentes de la página con los datos obtenidos
        carteleraEventos(datosEventos)
        carteleraMeet(datosEventos)
        cronogramaEventos(datosEventos)
        renderizarMapa()
        modalMapa(datosEventos, datosStands)

        // Configura los eventos para los botones de programar alerta
        configurarBotonesProgramarAlerta()
        
    } catch (error) {
        // Si ocurre un error, lo muestra en consola y notifica al usuario en los contenedores principales
        console.error('Error inicializando página:', error)
        // Mostrar mensaje de error al usuario si es necesario
        const contenedores = [
            'contenedor-eventos',
            'contenedor-meet', 
            'cronograma-eventos'
        ]
        
        contenedores.forEach(id => {
            const elemento = document.getElementById(id)
            if (elemento) {
                elemento.innerHTML = '<p class="text-center text-danger">Error cargando datos</p>'
            }
        })
    }
}

// Cuando el DOM esté completamente cargado, inicializa la página
document.addEventListener('DOMContentLoaded', inicializarPagina)