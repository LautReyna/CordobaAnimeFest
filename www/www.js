async function obtenerRegistros(ruta) {
    try {
        const respuesta = await fetch(ruta)
        return await respuesta.json()
    } catch (error) {
        console.log(error)
        throw error
    }
}

function carteleraMeet(datosEventos){
    try{
        const contenedorMeet = document.getElementById('contenedor-meet')

        let columnas = ''
        let filas = ''
        let count = 0

        const eventosMeet = datosEventos.filter(e => {
            const primeraPalabra = e.nombre?.split(' ')[0].toLowerCase()
            const ubicacion = e.ubicacion?.toLowerCase()
            return primeraPalabra === 'meet' || ubicacion === 'meet'
        })

        eventosMeet.forEach((evento)=>{
            columnas += `
                <div class="col-3">
                    <div class="zoom-img">
                        <button type="button" class="btn p-0 border-0 bg-transarent"data-bs-toggle="modal" data-bs-target="#evento-${evento.id}">
                            <img src="${evento.imagen}"alt="${evento.nombre}">
                        </button>

                        <div class="modal fade" id="evento-${evento.id}" tabindex="-1" aria-labelledby="eventoLabel-${evento.id}" aria-hidden="true">
                            <div class="modal-dialog">
                                <div class="modal-content">
                                    <div class="modal-header">
                                        <h5 class="modal-title fs-5" id="eventoLabel-${evento.id}">${evento.nombre}</h5>
                                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
                                    </div>
                                    <div class="modal-body">
                                        <p><strong>Descripción:</strong> ${evento.descripcion}</p>
                                        <p><strong>Ubicación:</strong> ${evento.ubicacion}</p>
                                        <table class="table table-bordered align-middle">
                                            <thead>
                                                <tr>
                                                    <th>Hora de inicio</th>
                                                    <th>Hora de finalizacion</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td>${evento.horainicio?.substring(0,5)}</td>
                                                    <td>${evento.horafin?.substring(0,5)}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <div class="modal-footer">
                                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                                        <button type="button" class="btn btn-primary">Programar Alerta</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `
            count++

            if(count % 4 === 0){
                filas += `<div class="row g-0">${columnas}</div>`
                columnas = ''
            }
        })

        if(columnas.length > 0){
            filas += `<div class="row g-0">${columnas}</div>`
        }

        contenedorMeet.innerHTML = filas;

    }catch(error){
        console.log(error)
    }
}

function carteleraEventos(datosEventos) {

    try {
        const contenedorEventos = document.getElementById('contenedor-eventos')

        let columnas = ''
        let filas = ''
        let cont = 0
        const grupos = {}

        datosEventos.forEach((evento) => {
            if (!grupos[evento.imagen]){
                grupos[evento.imagen] = []
            }
            grupos[evento.imagen].push(evento)
        })
    
        for (const [imagen, eventos] of Object.entries(grupos)) {
            cont++
            if(eventos.length === 1){
                let evento = eventos[0]
                columnas += `
                    <div class="col-3">
                        <div class="zoom-img">
                            <button type="button" class="btn p-0 border-0 bg-transarent"data-bs-toggle="modal" data-bs-target="#evento-${evento.id}">
                                <img src="${evento.imagen}"alt="${evento.nombre}">
                            </button>

                            <div class="modal fade" id="evento-${evento.id}" tabindex="-1" aria-labelledby="eventoLabel-${evento.id}" aria-hidden="true">
                                <div class="modal-dialog">
                                    <div class="modal-content">
                                        <div class="modal-header">
                                            <h5 class="modal-title fs-5" id="eventoLabel-${evento.id}">${evento.nombre}</h5>
                                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
                                        </div>
                                        <div class="modal-body">
                                            <p><strong>Descripción:</strong> ${evento.descripcion}</p>
                                            <p><strong>Ubicación:</strong> ${evento.ubicacion}</p>
                                            <table class="table table-bordered align-middle">
                                                <thead>
                                                    <tr>
                                                        <th>Hora de inicio</th>
                                                        <th>Hora de finalizacion</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td>${evento.horainicio?.substring(0,5)}</td>
                                                        <td>${evento.horafin?.substring(0,5)}</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                        <div class="modal-footer">
                                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                                            <button type="button" class="btn btn-primary">Programar Alerta</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `   
            }else{
                let carouselItems = ''
        
                eventos.forEach((evento, index) => {
                    carouselItems += `
                        <div class="carousel-item ${index===0 ? 'active' : ''}" data-event-name="${evento.nombre}">
                            <p><strong>Descripción:</strong> ${evento.descripcion}</p>
                            <p><strong>Ubicación:</strong> ${evento.ubicacion}</p>
                            <table class="table table-bordered align-middle">
                                <thead>
                                    <tr>
                                        <th>Hora de inicio</th>
                                        <th>Hora de finalizacion</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>${evento.horainicio?.substring(0,5)}</td>
                                        <td>${evento.horafin?.substring(0,5)}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    `
                })
        
                columnas += `
                    <div class="col-3">
                        <div class="zoom-img">
                            <button 
                                type="button" 
                                class="btn p-0 border-0 bg-transparent" 
                                data-bs-toggle="modal" 
                                data-bs-target="#modal-${btoa(imagen)}">
                                <img src="${imagen}" alt="${eventos[0].nombre}">
                            </button>
        
                            <!-- Modal -->
                            <div class="modal fade" id="modal-${btoa(imagen)}" tabindex="-1" aria-labelledby="label-${btoa(imagen)}" aria-hidden="true">
                                <div class="modal-dialog">
                                    <div class="modal-content">
                                        <div class="modal-header">
                                           <h5 id="label-${btoa(imagen)}">${eventos[0].nombre}</h5>
                                           <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                        </div>
                                        <div class="modal-body">
                                           <div id="carousel-${btoa(imagen)}" class="carousel slide" data-bs-ride="carousel">
                                              <div class="carousel-inner">
                                                 ${carouselItems}
                                              </div>
                                              <button class="carousel-control-prev" type="button" data-bs-target="#carousel-${btoa(imagen)}" data-bs-slide="prev">
                                                 <span aria-hidden="true">‹</span>
                                              </button>
                                              <button class="carousel-control-next" type="button" data-bs-target="#carousel-${btoa(imagen)}" data-bs-slide="next">
                                                 <span aria-hidden="true">›</span>
                                              </button>
                                           </div>
                                        </div>
                                        <div class="modal-footer">
                                           <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                                           <button type="button" class="btn btn-primary">Programar Alerta</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `
            }
            if(cont % 4 === 0){
                filas += `<div class="row g-0">${columnas}</div>`
                columnas = ''
            }
        }
        if(columnas.length > 0){
            filas += `<div class="row g-0">${columnas}</div>`
        }

        contenedorEventos.innerHTML = filas

        document.querySelectorAll('.carousel').forEach((carousel) => {
            carousel.addEventListener('slid.bs.carousel', (event) => {

                const active = event.relatedTarget
                const nombre = active.dataset.eventName
                const modal = event.target.closest('.modal')
                const title = modal.querySelector('.modal-header')
        
                title.textContent =  `<h5>${nombre}</h6><button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>`
                title.innerHTML = title.textContent
            })
        })
    } catch (error) {
        console.log(error)
    }
}

function cronogramaEventos(datosEventos){
    try{
        const contenedorEventos = document.getElementById('cronograma-eventos')

        datosEventos.sort((a, b) => a.horainicio.localeCompare(b.horainicio))

        let filas = ''
        
        datosEventos.forEach((evento) => {
            filas += `
                <tr>
                    <td scope="col">${evento.horainicio?.substring(0,5)} - ${evento.horafin?.substring(0,5)}</td>
                    <td scope="col">${evento.nombre}</td>
                    <td scope="col">${evento.ubicacion}</td>
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

        document.querySelectorAll('.boton').forEach((boton) => {
            boton.addEventListener('click',(e) => {
                const contenedor = e.target.closest('.descripcion')
                contenedor.classList.toggle('expandida')
                e.target.textContent = contenedor.classList.contains('expandida') ? 'Mostrar menos' : '...'
            })
        })

    }catch(error){
        console.log(error)
    }
}

function modalMapa(datosEventos){

    function mostrarModalEventos(lugar, eventos){
        
        const modal = document.querySelector('#modal-eventos')
        
        const modalTitle = modal.querySelector('.modal-title')
        const modalBody = modal.querySelector('.modal-body')

        modalTitle.textContent = lugar

        modalBody.innerHTML = ''
        if(eventos.length > 0){

            modalBody.innerHTML = `<div class="accordion accordion-flush" id="accordion-eventos"><div>`
            const accordion = modalBody.querySelector("#accordion-eventos")

            eventos.forEach((evento, index)=>{
                accordion.innerHTML += `
                    <div class="accordion-item">
                        <h2 class="accordion-header" id="heading${index}">
                            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${index}" aria-expanded="false" aria-controls="collapse${index}">
                                ${evento.nombre}
                            </button>
                        </h2>
                        <div id="collapse${index}" class="accordion-collapse collapse" aria-labelledby="heading${index}" data-bs-parent="#accordion-eventos">
                            <div class="accordion-body">
                                <p>Descripción: ${evento.descripcion}</p>
                                <p>Horario: ${evento.horainicio?.substring(0,5)} - ${evento.horafin?.substring(0,5)}</p>
                                <p>Ubicación: ${evento.ubicacion}</p>
                            </div>
                        </div>
                    </div>`
            })
            modalBody.innerHTML += `</div>`
        }else{
            modalBody.innerHTML = '<p>No se encuentran eventos para este lugar</p>'
        }

        new bootstrap.Modal(modal).show()
    }

    document.querySelectorAll('area[data-espacio]').forEach((area)=>{
        area.addEventListener('click', (e)=>{
            e.preventDefault()

            const lugar = area.dataset.espacio

            const eventosFiltrados = datosEventos.filter(e => e.ubicacion === lugar)

            console.log(lugar)
            mostrarModalEventos(lugar, eventosFiltrados)
        })
    })
}

const datosEventos = await obtenerRegistros('/api/v1/eventos')
carteleraEventos(datosEventos)
carteleraMeet(datosEventos)
cronogramaEventos(datosEventos)
modalMapa(datosEventos)