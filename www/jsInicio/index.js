import { 
    obtenerRegistros, 
    carteleraMeet, 
    carteleraEventos, 
    cronogramaEventos, 
    renderizarMapa,
    modalMapa
} from './funciones.js'

// Función para manejar clicks en botones "Programar Alerta"
function configurarBotonesProgramarAlerta() {
    document.addEventListener('click', async (e) => {
        const btn = e.target.closest('.btn-programar-alerta')
        if (!btn) return
        e.preventDefault()

        // Determinar idEvento
        let idEvento = btn.dataset.eventId
        
        if (!idEvento) {
            // Buscar item activo del carousel dentro del mismo modal
            const modal = btn.closest('.modal')
            const activeItem = modal?.querySelector('.carousel-item.active')
            idEvento = activeItem?.dataset.eventId
        }
        
        if (!idEvento) {
            console.warn('No se pudo determinar idEvento para programar alerta')
            return
        }
        
        // Validar que idEvento sea un número válido
        const idEventoNumero = parseInt(idEvento)
        if (isNaN(idEventoNumero)) {
            console.error('Error: idEvento no es un número válido:', idEvento)
            return
        }
        
        
        if (window.abrirModalProgramarAlerta) {
            window.abrirModalProgramarAlerta(idEventoNumero)
        } else {
            console.warn('No se encontró abrirModalProgramarAlerta')
        }
    })
}

// Función principal para inicializar la página
async function inicializarPagina() {
    try {
        // Obtener datos de la API
        const [datosEventos, datosStands] = await Promise.all([
            obtenerRegistros('/api/v1/eventos/caf/activa'),
            obtenerRegistros('/api/v1/stands/caf/activa')
        ])

        // Renderizar componentes
        carteleraEventos(datosEventos)
        carteleraMeet(datosEventos)
        cronogramaEventos(datosEventos)
        renderizarMapa()
        modalMapa(datosEventos, datosStands)

        // Configurar eventos
        configurarBotonesProgramarAlerta()
        
    } catch (error) {
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

// Inicializar cuando se carga la página
document.addEventListener('DOMContentLoaded', inicializarPagina)