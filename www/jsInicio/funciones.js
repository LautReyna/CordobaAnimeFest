// Función para obtener registros de la API
export async function obtenerRegistros(ruta) {
    try {
        const respuesta = await fetch(ruta)
        return await respuesta.json()
    } catch (error) {
        console.log(error)
        throw error
    }
}

// Función para renderizar cartelera de Meet N Greet
export function carteleraMeet(datosEventos) {
    try {
        const contenedorMeet = document.getElementById('contenedor-meet')
        if (!contenedorMeet) return

        let columnas = ''
        let filas = ''
        let count = 0

        const eventosMeet = datosEventos.filter(e => {
            const primeraPalabra = e.nombre?.split(' ')[0].toLowerCase()
            const ubicacion = e.nombrezona?.toLowerCase()
            return primeraPalabra === 'meet' || ubicacion === 'meet'
        })

        eventosMeet.forEach((evento) => {
            columnas += `
                <div class="col-6 col-md-4 col-lg-3 mb-4">
                    <div class="zoom-img">
                        <button type="button" class="btn p-0 border-0 bg-transparent" data-bs-toggle="modal" data-bs-target="#meet-evento-${evento.id}">
                            <img src="${evento.imagen}" alt="${evento.nombre}" class="img-fluid rounded shadow-sm">
                        </button>

                        <div class="modal fade" id="meet-evento-${evento.id}" tabindex="-1" aria-labelledby="meetEventoLabel-${evento.id}" aria-hidden="true">
                            <div class="modal-dialog modal-lg">
                                <div class="modal-content shadow-lg">
                                    <div class="modal-header bg-primary text-white">
                                        <h5 class="modal-title fw-bold fs-4" id="meetEventoLabel-${evento.id}">
                                            <i class="bi bi-calendar-event me-2"></i>
                                            ${evento.nombre}
                                        </h5>
                                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Cerrar"></button>
                                    </div>
                                    <div class="modal-body">
                                        <div class="row">
                                            <div class="col-md-4 text-center mb-3">
                                                <img src="${evento.imagen}" alt="${evento.nombre}" class="img-fluid rounded shadow">
                                            </div>
                                            <div class="col-md-8">
                                                <div class="mb-3">
                                                    <h6 class="fw-bold text-primary mb-2">
                                                        <i class="bi bi-text-paragraph me-1"></i>
                                                        Descripción
                                                    </h6>
                                                    <p class="mb-0">${evento.descripcion}</p>
                                                </div>
                                                <div class="mb-3">
                                                    <h6 class="fw-bold text-primary mb-2">
                                                        <i class="bi bi-geo-alt me-1"></i>
                                                        Ubicación
                                                    </h6>
                                                    <p class="mb-0">${evento.nombrezona}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="card bg-light">
                                            <div class="card-body">
                                                <h6 class="fw-bold text-primary mb-3">
                                                    <i class="bi bi-clock me-1"></i>
                                                    Horarios del Evento
                                                </h6>
                                                <div class="row text-center">
                                                    <div class="col-6">
                                                        <div class="border-end">
                                                            <h6 class="fw-bold text-success mb-1">Inicio</h6>
                                                            <span class="badge bg-success fs-6">${evento.horainicio?.substring(0,5)}</span>
                                                        </div>
                                                    </div>
                                                    <div class="col-6">
                                                        <h6 class="fw-bold text-danger mb-1">Fin</h6>
                                                        <span class="badge bg-danger fs-6">${evento.horafin?.substring(0,5)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="modal-footer">
                                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                                            <i class="bi bi-x-circle me-1"></i>
                                            Cerrar
                                        </button>
                                        <button type="button" class="btn btn-primary btn-programar-alerta" data-event-id="${evento.id}">
                                            <i class="bi bi-bell me-1"></i>
                                            Programar Alerta
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `
            count++

            if (count % 4 === 0) {
                filas += `<div class="row g-0">${columnas}</div>`
                columnas = ''
            }
        })

        if (columnas.length > 0) {
            filas += `<div class="row g-0">${columnas}</div>`
        }

        contenedorMeet.innerHTML = filas
    } catch (error) {
        console.log(error)
    }
}

// Función para renderizar cartelera de eventos
export function carteleraEventos(datosEventos) {
    try {
        const contenedorEventos = document.getElementById('contenedor-eventos')
        if (!contenedorEventos) return

        let columnas = ''
        let filas = ''
        let cont = 0
        const grupos = {}

        // Filtrar eventos que NO sean de Meet & Greet
        const eventosNoMeet = datosEventos.filter(e => {
            const primeraPalabra = e.nombre?.split(' ')[0].toLowerCase()
            const ubicacion = e.nombrezona?.toLowerCase()
            return primeraPalabra !== 'meet' && ubicacion !== 'meet'
        })

        // Agrupar eventos por imagen
        eventosNoMeet.forEach((evento) => {
            if (!grupos[evento.imagen]) {
                grupos[evento.imagen] = []
            }
            grupos[evento.imagen].push(evento)
        })

        for (const [imagen, eventos] of Object.entries(grupos)) {
            cont++
            if (eventos.length === 1) {
                let evento = eventos[0]
                columnas += crearModalEventoSimple(evento)
            } else {
                columnas += crearModalEventoCarousel(imagen, eventos)
            }
            
            if (cont % 4 === 0) {
                filas += `<div class="row g-0">${columnas}</div>`
                columnas = ''
            }
        }
        
        if (columnas.length > 0) {
            filas += `<div class="row g-0">${columnas}</div>`
        }

        contenedorEventos.innerHTML = filas
        configurarCarouseles()
    } catch (error) {
        console.log(error)
    }
}

// Función auxiliar para crear modal de evento simple
function crearModalEventoSimple(evento) {
    return `
        <div class="col-6 col-md-4 col-lg-3 mb-4">
            <div class="zoom-img">
                <button type="button" class="btn p-0 border-0 bg-transparent" data-bs-toggle="modal" data-bs-target="#evento-general-${evento.id}">
                    <img src="${evento.imagen}" alt="${evento.nombre}" class="img-fluid rounded shadow-sm">
                </button>

                <div class="modal fade" id="evento-general-${evento.id}" tabindex="-1" aria-labelledby="eventoGeneralLabel-${evento.id}" aria-hidden="true">
                    <div class="modal-dialog modal-lg">
                        <div class="modal-content shadow-lg">
                            <div class="modal-header bg-primary text-white">
                                <h5 class="modal-title fw-bold fs-4" id="eventoGeneralLabel-${evento.id}">
                                    <i class="bi bi-calendar-event me-2"></i>
                                    ${evento.nombre}
                                </h5>
                                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Cerrar"></button>
                            </div>
                            <div class="modal-body">
                                <div class="row">
                                    <div class="col-md-4 text-center mb-3">
                                        <img src="${evento.imagen}" alt="${evento.nombre}" class="img-fluid rounded shadow">
                                    </div>
                                    <div class="col-md-8">
                                        <div class="mb-3">
                                            <h6 class="fw-bold text-primary mb-2">
                                                <i class="bi bi-text-paragraph me-1"></i>
                                                Descripción
                                            </h6>
                                            <p class="mb-0">${evento.descripcion}</p>
                                        </div>
                                        <div class="mb-3">
                                            <h6 class="fw-bold text-primary mb-2">
                                                <i class="bi bi-geo-alt me-1"></i>
                                                Ubicación
                                            </h6>
                                            <p class="mb-0">${evento.nombrezona}</p>
                                        </div>
                                        <div class="mb-3">
                                            <h6 class="fw-bold text-primary mb-2">
                                                <i class="bi bi-circle-fill me-1"></i>
                                                Estado
                                            </h6>
                                            <p class="mb-0">${evento.estado}</p>
                                        </div>
                                    </div>
                                </div>
                                <div class="card bg-light">
                                    <div class="card-body">
                                        <h6 class="fw-bold text-primary mb-3">
                                            <i class="bi bi-clock me-1"></i>
                                            Horarios del Evento
                                        </h6>
                                        <div class="row text-center">
                                            <div class="col-6">
                                                <div class="border-end">
                                                    <h6 class="fw-bold text-success mb-1">Inicio</h6>
                                                    <span class="badge bg-success fs-6">${evento.horainicio?.substring(0,5)}</span>
                                                </div>
                                            </div>
                                            <div class="col-6">
                                                <h6 class="fw-bold text-danger mb-1">Fin</h6>
                                                <span class="badge bg-danger fs-6">${evento.horafin?.substring(0,5)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                                    <i class="bi bi-x-circle me-1"></i>
                                    Cerrar
                                </button>
                                <button type="button" class="btn btn-primary btn-programar-alerta" data-event-id="${evento.id}">
                                    <i class="bi bi-bell me-1"></i>
                                    Programar Alerta
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `
}

// Función auxiliar para crear modal de evento con carousel
function crearModalEventoCarousel(imagen, eventos) {
    let carouselItems = ''
    
    eventos.forEach((evento, index) => {
        carouselItems += `
            <div class="carousel-item ${index === 0 ? 'active' : ''}" data-event-name="${evento.nombre}" data-event-id="${evento.id}">
                <div class="row">
                    <div class="col-md-4 text-center mb-3">
                        <img src="${imagen}" alt="${evento.nombre}" class="img-fluid rounded shadow">
                    </div>
                    <div class="col-md-8">
                        <div class="mb-3">
                            <h6 class="fw-bold text-primary mb-2">
                                <i class="bi bi-text-paragraph me-1"></i>
                                Descripción
                            </h6>
                            <p class="mb-0">${evento.descripcion}</p>
                        </div>
                        <div class="mb-3">
                            <h6 class="fw-bold text-primary mb-2">
                                <i class="bi bi-geo-alt me-1"></i>
                                Ubicación
                            </h6>
                            <p class="mb-0">${evento.nombrezona}</p>
                        </div>
                        <div class="mb-3">
                            <h6 class="fw-bold text-primary mb-2">
                                <i class="bi bi-circle-fill me-1"></i>
                                Estado
                            </h6>
                            <p class="mb-0">${evento.estado}</p>
                        </div>
                    </div>
                </div>
                <div class="card bg-light">
                    <div class="card-body">
                        <h6 class="fw-bold text-primary mb-3">
                            <i class="bi bi-clock me-1"></i>
                            Horarios del Evento
                        </h6>
                        <div class="row text-center">
                            <div class="col-6">
                                <div class="border-end">
                                    <h6 class="fw-bold text-success mb-1">Inicio</h6>
                                    <span class="badge bg-success fs-6">${evento.horainicio?.substring(0,5)}</span>
                                </div>
                            </div>
                            <div class="col-6">
                                <h6 class="fw-bold text-danger mb-1">Fin</h6>
                                <span class="badge bg-danger fs-6">${evento.horafin?.substring(0,5)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `
    })

    // Validar que el primer evento tenga ID
    if (!eventos[0]?.id) {
        console.error('Error: El primer evento no tiene ID válido')
        return ''
    }

    // Crear un ID único basado en el hash de la imagen
    const imagenHash = imagen.split('/').pop().replace(/[^a-zA-Z0-9]/g, '') || 'imagen'
    const modalId = `carousel-modal-${imagenHash}-${eventos[0].id}`

    return `
        <div class="col-6 col-md-4 col-lg-3 mb-4">
            <div class="zoom-img">
                <button 
                    type="button" 
                    class="btn p-0 border-0 bg-transparent" 
                    data-bs-toggle="modal" 
                    data-bs-target="#${modalId}">
                    <img src="${imagen}" alt="${eventos[0].nombre}" class="img-fluid rounded shadow-sm">
                </button>

                <div class="modal fade" id="${modalId}" tabindex="-1" aria-labelledby="label-${modalId}" aria-hidden="true">
                    <div class="modal-dialog modal-lg">
                        <div class="modal-content shadow-lg">
                            <div class="modal-header bg-primary text-white">
                               <h5 class="fw-bold fs-4" id="label-${modalId}">
                                   <i class="bi bi-calendar-event me-2"></i>
                                   ${eventos[0].nombre}
                               </h5>
                               <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                               <div id="carousel-${modalId}" class="carousel slide" data-bs-ride="carousel">
                                  <div class="carousel-inner">
                                     ${carouselItems}
                                  </div>
                                  <button class="carousel-control-prev" type="button" data-bs-target="#carousel-${modalId}" data-bs-slide="prev">
                                     <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                                     <span class="visually-hidden">Anterior</span>
                                  </button>
                                  <button class="carousel-control-next" type="button" data-bs-target="#carousel-${modalId}" data-bs-slide="next">
                                     <span class="carousel-control-next-icon" aria-hidden="true"></span>
                                     <span class="visually-hidden">Siguiente</span>
                                  </button>
                               </div>
                            </div>
                            <div class="modal-footer">
                               <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                                   <i class="bi bi-x-circle me-1"></i>
                                   Cerrar
                               </button>
                               <button type="button" class="btn btn-primary btn-programar-alerta" data-event-id="${eventos[0].id}">
                                   <i class="bi bi-bell me-1"></i>
                                   Programar Alerta
                               </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `
}

// Función para configurar eventos de carousel
function configurarCarouseles() {
    document.querySelectorAll('.carousel').forEach((carousel) => {
        carousel.addEventListener('slid.bs.carousel', (event) => {
            const active = event.relatedTarget
            const nombre = active.dataset.eventName
            const eventId = active.dataset.eventId
            const modal = event.target.closest('.modal')
            const title = modal.querySelector('.modal-header h5')
            const btnProgramarAlerta = modal.querySelector('.btn-programar-alerta')
            
            if (title) {
                title.textContent = nombre
            }
            
            if (btnProgramarAlerta && eventId) {
                btnProgramarAlerta.dataset.eventId = eventId
                console.log('Actualizado data-event-id del botón:', eventId)
            }
        })
    })
}

// Función para renderizar cronograma de eventos
export function cronogramaEventos(datosEventos) {
    try {
        const contenedorEventos = document.getElementById('cronograma-eventos')
        if (!contenedorEventos) return

        // Ordenar eventos por hora de inicio
        const eventosOrdenados = [...datosEventos].sort((a, b) => a.horainicio.localeCompare(b.horainicio))

        let filas = ''
        
        eventosOrdenados.forEach((evento) => {
            filas += `
                <tr>
                    <td scope="col">${evento.horainicio?.substring(0,5)} - ${evento.horafin?.substring(0,5)}</td>
                    <td scope="col">${evento.nombre}</td>
                    <td scope="col">${evento.nombrezona}</td>
                    <td scope="col">
                        <div class="descripcion">
                            <p>${evento.descripcion}</p>
                            <button class="boton">...</button>
                        </div>
                    </td>
                </tr>
            `
        })
        
        contenedorEventos.innerHTML = filas
        configurarBotonesDescripcion()
    } catch (error) {
        console.log(error)
    }
}

// Función para configurar botones de descripción expandible
function configurarBotonesDescripcion() {
    document.querySelectorAll('.boton').forEach((boton) => {
        boton.addEventListener('click', (e) => {
            const contenedor = e.target.closest('.descripcion')
            contenedor.classList.toggle('expandida')
            e.target.textContent = contenedor.classList.contains('expandida') ? 'Mostrar menos' : '...'
        })
    })
}

// funcion para renderizar mapa
export async function renderizarMapa() {
    const mapa = document.getElementById('contenedor-mapa')

    console.log('Iniciando renderizado del mapa...')
    
    const cafActiva = await obtenerRegistros('/api/v1/caf/activa')
    const zonas = await obtenerRegistros(`/api/v1/zonas/caf/${cafActiva.id}`)

    console.log('Zonas cargadas:', zonas);
    if (!mapa) return
    
    const img = new Image()
    img.src = cafActiva.mapa
    img.alt = 'Mapa de la CAF'
    img.onload = () => {
        const width = img.naturalWidth
        const height = img.naturalHeight

        console.log('Dimensiones de la imagen:', { width, height });
        console.log('Zonas cargadas:', zonas);

        mapa.innerHTML = `
            <div class="mapa-svg-container">
                <img src="${cafActiva.mapa}" alt="Mapa de la CAF">
                <svg class="mapa-overlay-svg" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
                    ${zonas.map(zona => {
                        console.log(`Zona ${zona.nombre}:`, zona.coordenadas);
                        return `
                        <polygon 
                            points="${zona.coordenadas}" 
                            class="area-svg"
                            data-espacio="${zona.nombre}"
                            data-zona-id="${zona.id}"
                            fill="transparent" 
                            stroke="transparent" 
				            stroke-width="0"
                            style="cursor: pointer;">
                            <title>${zona.nombre}</title>
                        </polygon>
                    `;
                    }).join('')}
                </svg>
            </div>
        `
        
        // Configurar eventos de click después de crear los elementos SVG
        configurarEventosMapa()
    }

}

// Variables globales para datos de eventos y stands
let datosEventosGlobales = []
let datosStandsGlobales = []

// Función para configurar modal del mapa
export function modalMapa(datosEventos, datosStands) {
    // Guardar datos globalmente para usar en configurarEventosMapa
    datosEventosGlobales = datosEventos
    datosStandsGlobales = datosStands
}

// Función para configurar eventos de click en el mapa
function configurarEventosMapa() {
    const selectorAreas = '.area-svg[data-espacio]'
    document.querySelectorAll(selectorAreas).forEach((area) => {
        area.addEventListener('click', (e) => {
            e.preventDefault()
            const lugar = area.dataset.espacio
            const zonaId = area.dataset.zonaId
            
            console.log('Click en zona:', lugar, 'ID:', zonaId)
            console.log('Datos eventos:', datosEventosGlobales)
            console.log('Datos stands:', datosStandsGlobales)
            
            // Filtrado por nombre de zona (ahora que viene directamente de la DB)
            const eventosFiltrados = datosEventosGlobales.filter(evento => 
                evento.nombrezona && evento.nombrezona.trim().toLowerCase() === lugar.trim().toLowerCase()
            )
            const standsFiltrados = datosStandsGlobales.filter(stand => 
                stand.nombrezona && stand.nombrezona.trim().toLowerCase() === lugar.trim().toLowerCase()
            )
            
            console.log('Eventos encontrados:', eventosFiltrados)
            console.log('Stands encontrados:', standsFiltrados)
            
            mostrarModal(lugar, eventosFiltrados, standsFiltrados)
        })
    })
}

function mostrarModal(lugar, eventos, stands) {
    const modal = document.querySelector('#modal-eventos')
    if (!modal) {
        console.error('Modal #modal-eventos no encontrado')
        return
    }
    
    const modalTitle = modal.querySelector('.modal-title')
    const modalBody = modal.querySelector('.modal-body')

    modalTitle.textContent = lugar
    modalBody.innerHTML = ''
    
    let contenido = ''
    
    // Agregar eventos si existen
    if (eventos.length > 0) {
        contenido += `
            <div class="mb-4">
                <h5 class="text-primary">Eventos</h5>
                <div class="accordion accordion-flush" id="accordion-eventos-modal">
        `
        
        eventos.forEach((evento, index) => {
            const horainicio = evento.horainicio || evento.horaInicio || ''
            const horafin = evento.horafin || evento.horaFin || ''
            
            contenido += `
                <div class="accordion-item">
                    <h2 class="accordion-header" id="heading-evento-${index}">
                        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse-evento-${index}" aria-expanded="false" aria-controls="collapse-evento-${index}">
                            ${evento.nombre}
                        </button>
                    </h2>
                    <div id="collapse-evento-${index}" class="accordion-collapse collapse" aria-labelledby="heading-evento-${index}" data-bs-parent="#accordion-eventos-modal">
                        <div class="accordion-body">
                            <p><strong>Descripción:</strong> ${evento.descripcion || 'Sin descripción'}</p>
                            <p><strong>Horario:</strong> ${horainicio.substring(0,5)} - ${horafin.substring(0,5)}</p>
                            <p><strong>Ubicación:</strong> ${evento.nombrezona}</p>
                        </div>
                    </div>
                </div>`
        })
        
        contenido += '</div></div>'
    }
    
    // Agregar stands si existen
    if (stands.length > 0) {
        contenido += `
            <div class="mb-4">
                <h5 class="text-success">Stands</h5>
                <div class="accordion accordion-flush" id="accordion-stands-modal">
        `
        
        stands.forEach((stand, index) => {
            contenido += `
                <div class="accordion-item">
                    <h2 class="accordion-header" id="heading-stand-${index}">
                        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse-stand-${index}" aria-expanded="false" aria-controls="collapse-stand-${index}">
                            ${stand.nombre}
                        </button>
                    </h2>
                    <div id="collapse-stand-${index}" class="accordion-collapse collapse" aria-labelledby="heading-stand-${index}" data-bs-parent="#accordion-stands-modal">
                        <div class="accordion-body">
                            <p><strong>Descripción:</strong> ${stand.descripcion || 'Sin descripción'}</p>
                            <p><strong>Ubicación:</strong> ${stand.nombrezona}</p>
                        </div>
                    </div>
                </div>`
        })
        
        contenido += '</div></div>'
    }
    
    // Si no hay eventos ni stands
    if (eventos.length === 0 && stands.length === 0) {
        contenido = '<p class="text-muted">No se encuentran eventos ni stands para este lugar</p>'
    }
    
    modalBody.innerHTML = contenido
    new bootstrap.Modal(modal).show()
}
