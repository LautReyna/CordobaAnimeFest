// Importaciones de utilidades y funciones
import { obtenerRegistros, mostrarMensaje, altaRegistroConArchivo } from "../recursos/utilidades.js"
import { renderizarListadoEventos } from "../jsEventos/funciones.js"
import { renderizarListadoStands } from "../jsStands/funciones.js"

// Funcion principal para crear enlaces de navegacion segun permisos del usuario
export async function crearEnlaces() {
    try {
      // Obtener datos del usuario autenticado
      const respuesta = await fetch('/miUsuario', { credentials: "include" })
      if (!respuesta.ok) throw Error('No autenticado')
  
      const usuario = await respuesta.json()
      const enlaces = document.getElementById('enlaces')
      const mensaje = document.getElementById('mensaje-bienvenida')
      const contenedorCaf = document.getElementById('contenedor-caf')

      // Obtener datos de la CAF activa
      const resCaf = await obtenerRegistros('/api/v1/caf/activa')
      const cafActiva = await resCaf.json()

      // Crear boton de logout
      enlaces.innerHTML = `
        <li class="nav-item">
          <button id="btn-logout" class="btn btn-danger">
            <i class="bi bi-box-arrow-left"></i> 
          </button>
        </li>
      `
      // Crear mensaje de bienvenida
      if(mensaje){
        mensaje.innerHTML = `
          <h1 class="d-flex justify-content-center title">BIENVENIDO ${usuario.nombre.toUpperCase()}</h1> 
        `
      }
  
      // Crear enlaces segun categoria del usuario
      if (usuario.categoria === 'Eventos' || usuario.categoria === 'Admin') {
        enlaces.insertAdjacentHTML("afterbegin", `
          <li class="nav-item"><a href="/admin/eventos.html" class="nav-link">Eventos</a></li>
        `)
      }
      if (usuario.categoria === 'Stands' || usuario.categoria === 'Admin') {
        enlaces.insertAdjacentHTML("afterbegin", `
          <li class="nav-item"><a href="/admin/stands.html" class="nav-link">Stands</a></li>
        `)
      }
      if (usuario.categoria === 'Admin') {
        enlaces.insertAdjacentHTML("afterbegin", `
          <li class="nav-item"><a href="/admin/usuarios.html" class="nav-link">Usuarios</a></li>
          <li class="nav-item"><a href="/admin/auditoria.html" class="nav-link">Auditoria</a></li>
        `)
  
        // Renderizar interfaz de gestion de CAF
        if(contenedorCaf){
          contenedorCaf.innerHTML = ''
          if(cafActiva){
            // Mostrar CAF activa con opciones de gestion
            contenedorCaf.innerHTML = `
              <div class="container">
                <div class="row justify-content-center">
                  <div class="col-lg-8">
                    <div class="card shadow-lg border-0 mt-4">
                      <div class="card-header bg-success text-white">
                        <div class="d-flex justify-content-between align-items-center">
                          <div>
                            <h4 class="mb-0 fw-bold">
                              <i class="bi bi-calendar-check me-2"></i>
                              CAF Activa
                            </h4>
                            <p class="mb-0 mt-1 opacity-75">
                              <i class="bi bi-info-circle me-1"></i>
                              Evento actual en curso
                            </p>
                          </div>
                          <div class="d-flex gap-2">
                            <button 
                              data-bs-toggle="modal" data-bs-target="#modal-modificar-caf" 
                              id="btn-modificar"
                              class="btn btn-outline-light btn-sm">
                              <i class="bi bi-pencil-square me-1"></i>
                              Modificar
                            </button>
                            <button id="btn-finalizar"
                              class="btn btn-outline-light btn-sm">
                              <i class="bi bi-stop-circle me-1"></i>
                              Finalizar
                            </button>
                          </div>
                        </div>
                      </div>
                      <div class="card-body">
                        <div class="row align-items-center">
                          <div class="col-md-8">
                            <h2 class="fw-bold text-success mb-3">
                              <i class="bi bi-calendar-event me-2"></i>
                              ${cafActiva.fecha}
                            </h2>
                            <div class="row text-center">
                              <div class="col-4">
                                <div class="border-end">
                                  <h5 class="fw-bold text-primary mb-1">Estado</h5>
                                  <span class="badge bg-success fs-6">Activa</span>
                                </div>
                              </div>
                              <div class="col-4">
                                <div class="border-end">
                                  <h5 class="fw-bold text-primary mb-1">Mapa</h5>
                                  <span class="badge bg-info fs-6">Configurado</span>
                                </div>
                              </div>
                              <div class="col-4">
                                <h5 class="fw-bold text-primary mb-1">Gestión</h5>
                                <span class="badge bg-warning fs-6">Disponible</span>
                              </div>
                            </div>
                          </div>
                          <div class="col-md-4 text-center">
                            <div class="bg-light rounded p-3">
                              <i class="bi bi-calendar-heart text-success" style="font-size: 3rem;"></i>
                              <p class="mt-2 mb-0 fw-semibold text-muted">Córdoba Anime Fest</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            `
          }else{
            // Mostrar formulario de creacion de CAF
            contenedorCaf.innerHTML = `
              <div class="container">
                <div class="row justify-content-center">
                  <div class="col-lg-8">
                    <div class="card shadow-lg border-0 mt-4">
                      <div class="card-header bg-primary text-white">
                        <h4 class="mb-0 fw-bold">
                          <i class="bi bi-plus-circle me-2"></i>
                          Crear Nueva CAF
                        </h4>
                        <p class="mb-0 mt-1 opacity-75">
                          <i class="bi bi-info-circle me-1"></i>
                          Configura una nueva edición del evento
                        </p>
                      </div>
                      <div class="card-body">
                        <form id="form-crear-caf">
                          <div class="row g-4">
                            <div class="col-md-12">
                              <div class="mb-3">
                                <label for="fecha" class="form-label fw-semibold">
                                  <i class="bi bi-calendar-event me-1"></i>
                                  Fecha del Evento
                                </label>
                                <input type="date" name="fecha" class="form-control form-control-lg" min="${new Date().toISOString().split('T')[0]}" required>
                                <div class="form-text">
                                  <i class="bi bi-info-circle me-1"></i>
                                  Selecciona la fecha para la nueva edición de CAF
                                </div>
                              </div>
                            </div>
                            <div class="col-md-12">
                              <div class="mb-3">
                                <label for="mapa" class="form-label fw-semibold">
                                  <i class="bi bi-image me-1"></i>
                                  Mapa del Evento
                                </label>
                                <input type="file" name="mapa" accept="image/*" class="form-control form-control-lg" required>
                                <div class="form-text">
                                  <i class="bi bi-info-circle me-1"></i>
                                  Sube el mapa con las zonas del evento
                                </div>
                              </div>
                            </div>
                            <div class="col-12">
                              <div class="d-grid gap-2">
                                <button type="submit" class="btn btn-primary btn-lg">
                                  <i class="bi bi-plus-circle me-2"></i>
                                  Crear Nueva CAF
                                </button>
                              </div>
                            </div>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            `
          }
        }
      }
    } catch (error) {
      console.error(error)
      window.location.href = '/login'
    }
}

// Funcion para verificar si hay una CAF activa
export async function verificarCafActiva(){
  try{
    const respuesta = await fetch('/caf/activa')
    const datos = await respuesta.json()

    const section = document.getElementById('section-gestor')

    if(!datos.activa){
      // Mostrar mensaje si no hay una CAF activa
      section.innerHTML = `
        <div class="alert alert-warning text-center mt-5">
          No hay una CAF activa. Pídele al Admin que active una.
        </div>
      `
      section.classList.remove('hidden')
    }else{
      section.classList.remove('hidden')
    }
  }catch(error){
    console.error("Error verificando caf activa", error)
  }
}

// Función auxiliar para actualizar el comboBox de CAF
export function actualizarComboBox(idCaf) {
  const combos = document.querySelectorAll('.cbCaf')
  combos.forEach(cb => {
    cb.value = idCaf
    console.log('ComboBox actualizado a CAF:', idCaf)
  })
}

// Función para cargar el comboBox de CAF
export async function cargarComboBox(datosCaf, cafActiva = null){
  try {
    const combos = document.querySelectorAll('.cbCaf')
    if(!combos.length) return

    combos.forEach(cb => {
      cb.innerHTML = datosCaf.map(c => `
        <option value="${c.id}" ${c.id === cafActiva.id ? "selected" : ""}>
          ${new Date(c.fecha).toLocaleDateString()} ${c.activa ? "(ACTIVA)" : ""}
        </option>
      `).join("")
    })
    
  }catch (error) {
    console.error('Error cargando comboBox', error)    
  }
}

// Función para manejar cambios en el comboBox de CAF
export async function cambiarComboBox(datosCaf, callback){
  try{
    const combos = document.querySelectorAll('.cbCaf')
    if(!combos.length) return

    combos.forEach(cb => {
      // Remover listeners anteriores para evitar duplicados
      cb.removeEventListener("change", cb._changeHandler)
      
      // Crear nuevo handler
      cb._changeHandler = async () => {
        const idCaf = cb.value
        const caf = datosCaf.find(c => c.id == idCaf)
        
        console.log('CAF seleccionada:', { idCaf, caf })
        
        if (caf) {
          callback(idCaf, caf)
        } else {
          console.error('CAF no encontrada:', idCaf)
        }
      }
      
      // Agregar el nuevo listener
      cb.addEventListener("change", cb._changeHandler)
    })
  }catch(error){
    console.error('Error cambiando comboBox', error)
  }
}

// Función para mostrar eventos segun la CAF seleccionada
export async function mostrarEventosSegunCaf(idCaf, cafSeleccionada) {
  const sectionGestor = document.getElementById('section-gestor')
  const sectionPasada = document.getElementById('section-pasada')

  // Actualizar el comboBox para mostrar la CAF seleccionada
  actualizarComboBox(idCaf)

  const res = await obtenerRegistros(`/api/v1/eventos/caf/${idCaf}`)
  const eventos = await res.json()

  if (cafSeleccionada.activa) {
    // Mostrar eventos de CAF activa
    sectionGestor.classList.remove('hidden')
    sectionPasada.classList.add('hidden')
    renderizarListadoEventos(eventos, 'contenedor-eventos')
  } else {
    // Mostrar eventos de CAF pasada
    sectionPasada.classList.remove('hidden')
    sectionGestor.classList.add('hidden')

    renderizarListadoEventos(eventos, 'contenedor-eventos-pasada')
  }
}

// Función para mostrar stands segun la CAF seleccionada
export async function mostrarStandsSegunCaf(idCaf, cafSeleccionada) {
  const sectionGestor = document.getElementById('section-gestor')
  const sectionPasada = document.getElementById('section-pasada')

  // Actualizar el comboBox para mostrar la CAF seleccionada
  actualizarComboBox(idCaf)

  const res = await obtenerRegistros(`/api/v1/stands/caf/${idCaf}`)
  const stands = await res.json()

  if (cafSeleccionada.activa) {
    // Mostrar stands de CAF activa
    sectionGestor.classList.remove('hidden')
    sectionPasada.classList.add('hidden')
    renderizarListadoStands(stands, 'contenedor-stands')
  } else {
    // Mostrar stands de CAF pasada
    sectionPasada.classList.remove('hidden')
    sectionGestor.classList.add('hidden')

    renderizarListadoStands(stands, 'contenedor-stands-pasada')
  }
}

// Función para renderizar el formulario de modificacion de CAF
export function renderizarFormulario(datosCaf){
  try {
      document.querySelector('#form-modificar-caf input[name="id"]').value = datosCaf.id
      document.querySelector('#form-modificar-caf input[name="fecha"]').value = datosCaf.fecha
  } catch (error) {
      console.log(error)
  }
}

// Función para cargar el comboBox de zonas
export async function cargarComboBoxZonas(contenedorId) {
  try {
    const contenedorZonas = document.getElementById(contenedorId)

    const resCaf = await obtenerRegistros('/api/v1/caf/activa')
    const cafActiva = await resCaf.json()
    const res = await obtenerRegistros(`/api/v1/zonas/caf/${cafActiva.id}`)
    const datosZonas = await res.json()

    if(!datosZonas.length) return
    
    let filas = ''
    datosZonas.forEach(zona => {
      filas += `
        <option value="${zona.id}">${zona.nombre}</option>
      `
    })

    contenedorZonas.innerHTML = filas

  } catch (error) {
    console.log(error)
  }
}

// Función para cerrar sesión
export function cerrarSesion(){
    document.getElementById('enlaces').addEventListener('click', async (e) => {
        if (e.target.id === 'btn-logout' || e.target.closest('#btn-logout')) {
          try {
            await fetch('/autenticacion/logout', { method: 'POST', credentials: "include" })
            window.location.href = '/login'
          } catch (error) {
            console.error('Error en el logout', error)
          }
        }
    })
}

// FUNCIONES DEL MODAL DE ZONAS
// Variables globales para el modal de zonas
let zonasProcesadas = []
let formDataCaf = null
let archivoMapa = null

// Función para mostrar el modal de creación de zonas
export function mostrarModalZonas(archivo, formData) {
    archivoMapa = archivo
    formDataCaf = formData
    
    // Limpiar datos anteriores
    zonasProcesadas = []
    document.getElementById('codigo-html-zonas').value = ''
    document.getElementById('vista-previa-zonas').classList.add('d-none')
    document.getElementById('btn-crear-caf-con-zonas').classList.add('d-none')
    
    // Mostrar el modal
    const modal = new bootstrap.Modal(document.getElementById('modal-crear-zonas'))
    modal.show()
}

// Función para procesar el código HTML de image-map.net
export function procesarZonas() {
    const codigoHTML = document.getElementById('codigo-html-zonas').value.trim()
    
    if (!codigoHTML) {
        alert('Por favor, pega el código HTML de image-map.net')
        return
    }
    
    try {
        // Crear un elemento temporal para parsear el HTML
        const tempDiv = document.createElement('div')
        tempDiv.innerHTML = codigoHTML
        
        // Buscar elementos <area> en el HTML
        const areas = tempDiv.querySelectorAll('area')
        
        if (areas.length === 0) {
            alert('No se encontraron zonas en el código HTML. Asegúrate de copiar el código completo de image-map.net')
            return
        }
        
        zonasProcesadas = []
        
        areas.forEach((area, index) => {
            const nombre = area.getAttribute('alt') || area.getAttribute('title') || `Zona ${index + 1}`
            const coordenadas = area.getAttribute('coords')
            let shape = area.getAttribute('shape')
            
            // Si el shape está vacío, es null, undefined, o tiene valor "0", usar 'rect' como predeterminado
            if (!shape || shape.trim() === '' || shape === '0') {
                shape = 'rect'
                console.log(`Zona ${index + 1}: Shape vacío detectado, usando 'rect' como predeterminado`)
            }
            
            if (coordenadas) {
                // Convertir coordenadas según el tipo de forma
                let coordenadasConvertidas = ''
                
                if (shape === 'poly') {
                    // Para polígonos, las coordenadas ya están en el formato correcto
                    coordenadasConvertidas = coordenadas.replace(/,/g, ' ')
                } else if (shape === 'rect') {
                    // Para rectángulos, convertir a polígono
                    const coords = coordenadas.split(',')
                    if (coords.length === 4) {
                        const [x1, y1, x2, y2] = coords.map(Number)
                        coordenadasConvertidas = `${x1} ${y1} ${x2} ${y1} ${x2} ${y2} ${x1} ${y2}`
                    }
                } else if (shape === 'circle') {
                    // Para círculos, crear un polígono aproximado
                    const coords = coordenadas.split(',')
                    if (coords.length === 3) {
                        const [cx, cy, r] = coords.map(Number)
                        const puntos = []
                        for (let i = 0; i < 8; i++) {
                            const angle = (i * Math.PI * 2) / 8
                            const x = Math.round(cx + r * Math.cos(angle))
                            const y = Math.round(cy + r * Math.sin(angle))
                            puntos.push(`${x} ${y}`)
                        }
                        coordenadasConvertidas = puntos.join(' ')
                    }
                } else {
                    // Para cualquier forma no reconocida, intentar procesar como polígono
                    console.log(`Zona ${index + 1}: Forma '${shape}' no reconocida, procesando como polígono`)
                    coordenadasConvertidas = coordenadas.replace(/,/g, ' ')
                }
                
                if (coordenadasConvertidas) {
                    zonasProcesadas.push({
                        nombre: nombre,
                        coordenadas: coordenadasConvertidas,
                        original: coordenadas,
                        shape: shape
                    })
                }
            }
        })
        
        if (zonasProcesadas.length === 0) {
            alert('No se pudieron procesar las coordenadas. Verifica que el código HTML sea correcto.')
            return
        }
        
        // Mostrar vista previa
        mostrarVistaPreviaZonas()
        
        // Habilitar botón para crear CAF
        document.getElementById('btn-crear-caf-con-zonas').classList.remove('d-none')
        
        alert(`Se procesaron ${zonasProcesadas.length} zonas correctamente. Revisa la vista previa.`)
        
    } catch (error) {
        console.error('Error procesando zonas:', error)
        alert('Error al procesar el código HTML. Verifica que sea válido.')
    }
}

// Función para mostrar vista previa de las zonas procesadas
function mostrarVistaPreviaZonas() {
    const listaZonas = document.getElementById('lista-zonas')
    const vistaPrevia = document.getElementById('vista-previa-zonas')
    
    listaZonas.innerHTML = ''
    
    zonasProcesadas.forEach((zona, index) => {
        const item = document.createElement('div')
        item.className = 'list-group-item d-flex justify-content-between align-items-center'
        item.innerHTML = `
            <div>
                <strong>${zona.nombre}</strong>
                <br>
                <small class="text-muted">Coordenadas: ${zona.coordenadas}</small>
            </div>
            <span class="badge bg-primary rounded-pill">${zona.shape}</span>
        `
        listaZonas.appendChild(item)
    })
    
    vistaPrevia.classList.remove('d-none')
}

// Función para crear CAF con las zonas procesadas
export async function crearCafConZonas(mensajes, altaRegistro, crearEnlaces) {
    if (zonasProcesadas.length === 0) {
        alert('No hay zonas procesadas. Procesa las zonas primero.')
        return
    }
    
    try {
        // Crear la CAF primero
        mostrarMensaje(mensajes, 'Creando CAF...', 'info')
        
        const respuesta = await altaRegistroConArchivo('/api/v1/caf', 'POST', formDataCaf)
        const resultado = await respuesta.json()
        
        if (!respuesta.ok) {
            throw new Error(resultado.mensaje || 'Error al crear CAF')
        }
        
        const cafCreada = resultado
        mostrarMensaje(mensajes, 'CAF creada exitosamente', 'success')
        
        // Crear las zonas
        mostrarMensaje(mensajes, 'Creando zonas...', 'info')
        
        for (const zona of zonasProcesadas) {
            const respuestaZona = await fetch('/api/v1/zonas', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    idCaf: cafCreada.id,
                    nombre: zona.nombre,
                    coordenadas: zona.coordenadas
                })
            })
            
            if (!respuestaZona.ok) {
                console.error(`Error creando zona ${zona.nombre}`)
            }
        }
        
        // Cerrar modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('modal-crear-zonas'))
        modal.hide()
        
        // Actualizar enlaces y mostrar CAF activa
        await crearEnlaces()
        
        mostrarMensaje(mensajes, `CAF creada con ${zonasProcesadas.length} zonas exitosamente`, 'success')
        
        // Limpiar datos
        zonasProcesadas = []
        formDataCaf = null
        archivoMapa = null
        
    } catch (error) {
        console.error(error)
        mostrarMensaje(mensajes, error.message || 'Error al crear CAF con zonas', 'danger')
    }
}

// Función para limpiar el formulario
// Variables globales para el modal de modificar zonas
let zonasExistentes = []
let nuevasZonasProcesadas = []
let idCafModificando = null

// Función para mostrar el modal de gestión de zonas
export async function mostrarModalGestionZonas() {
    try {
        // Obtener CAF activa
        const res = await obtenerRegistros('/api/v1/caf/activa')
        const cafActiva = await res.json()
        
        if (!cafActiva) {
            mostrarMensaje(mensajes, 'No hay CAF activa para modificar', 'warning')
            return
        }
        
        idCafModificando = cafActiva.id
        
        // Cargar zonas existentes
        await cargarZonasExistentes(cafActiva.id)
        
        // Mostrar el modal
        const modal = new bootstrap.Modal(document.getElementById('modal-modificar-zonas'))
        modal.show()
        
    } catch (error) {
        console.error('Error cargando zonas:', error)
        mostrarMensaje(mensajes, 'Error al cargar las zonas', 'danger')
    }
}

// Función para cargar zonas existentes
async function cargarZonasExistentes(idCaf) {
    try {
        const res = await obtenerRegistros(`/api/v1/zonas/caf/${idCaf}`)
        zonasExistentes = await res.json()
        
        mostrarZonasExistentes()
        
    } catch (error) {
        console.error('Error cargando zonas existentes:', error)
        zonasExistentes = []
        mostrarZonasExistentes()
    }
}

// Función para mostrar zonas existentes
function mostrarZonasExistentes() {
    const listaZonas = document.getElementById('lista-zonas-existentes')
    
    if (zonasExistentes.length === 0) {
        listaZonas.innerHTML = '<div class="list-group-item text-muted">No hay zonas creadas para esta CAF</div>'
        return
    }
    
    listaZonas.innerHTML = ''
    
    zonasExistentes.forEach((zona, index) => {
        const item = document.createElement('div')
        item.className = 'list-group-item d-flex justify-content-between align-items-center'
        item.innerHTML = `
            <div>
                <strong>${zona.nombre}</strong>
                <br>
                <small class="text-muted">Coordenadas: ${zona.coordenadas}</small>
            </div>
            <span class="badge bg-primary rounded-pill">ID: ${zona.id}</span>
        `
        listaZonas.appendChild(item)
    })
}

// Función para procesar nuevas zonas (similar a la original pero para modificar)
export function procesarZonasModificar() {
    const codigoHTML = document.getElementById('codigo-html-zonas-modificar').value.trim()
    
    if (!codigoHTML) {
        alert('Por favor, pega el código HTML de image-map.net')
        return
    }
    
    try {
        // Crear un elemento temporal para parsear el HTML
        const tempDiv = document.createElement('div')
        tempDiv.innerHTML = codigoHTML
        
        // Buscar elementos <area> en el HTML
        const areas = tempDiv.querySelectorAll('area')
        
        if (areas.length === 0) {
            alert('No se encontraron zonas en el código HTML. Asegúrate de copiar el código completo de image-map.net')
            return
        }
        
        nuevasZonasProcesadas = []
        
        areas.forEach((area, index) => {
            const nombre = area.getAttribute('alt') || area.getAttribute('title') || `Zona ${index + 1}`
            const coordenadas = area.getAttribute('coords')
            let shape = area.getAttribute('shape')
            
            // Si el shape está vacío, es null, undefined, o tiene valor "0", usar 'rect' como predeterminado
            if (!shape || shape.trim() === '' || shape === '0') {
                shape = 'rect'
                console.log(`Zona ${index + 1}: Shape vacío detectado, usando 'rect' como predeterminado`)
            }
            
            if (coordenadas) {
                // Convertir coordenadas según el tipo de forma
                let coordenadasConvertidas = ''
                
                if (shape === 'poly') {
                    // Para polígonos, las coordenadas ya están en el formato correcto
                    coordenadasConvertidas = coordenadas.replace(/,/g, ' ')
                } else if (shape === 'rect') {
                    // Para rectángulos, convertir a polígono
                    const coords = coordenadas.split(',')
                    if (coords.length === 4) {
                        const [x1, y1, x2, y2] = coords.map(Number)
                        coordenadasConvertidas = `${x1} ${y1} ${x2} ${y1} ${x2} ${y2} ${x1} ${y2}`
                    }
                } else if (shape === 'circle') {
                    // Para círculos, crear un polígono aproximado
                    const coords = coordenadas.split(',')
                    if (coords.length === 3) {
                        const [cx, cy, r] = coords.map(Number)
                        const puntos = []
                        for (let i = 0; i < 8; i++) {
                            const angle = (i * Math.PI * 2) / 8
                            const x = Math.round(cx + r * Math.cos(angle))
                            const y = Math.round(cy + r * Math.sin(angle))
                            puntos.push(`${x} ${y}`)
                        }
                        coordenadasConvertidas = puntos.join(' ')
                    }
                } else {
                    // Para cualquier forma no reconocida, intentar procesar como polígono
                    console.log(`Zona ${index + 1}: Forma '${shape}' no reconocida, procesando como polígono`)
                    coordenadasConvertidas = coordenadas.replace(/,/g, ' ')
                }
                
                if (coordenadasConvertidas) {
                    nuevasZonasProcesadas.push({
                        nombre: nombre,
                        coordenadas: coordenadasConvertidas,
                        original: coordenadas,
                        shape: shape
                    })
                }
            }
        })
        
        if (nuevasZonasProcesadas.length === 0) {
            alert('No se pudieron procesar las coordenadas. Verifica que el código HTML sea correcto.')
            return
        }
        
        // Mostrar vista previa
        mostrarVistaPreviaZonasModificar()
        
        // Habilitar botón para aplicar cambios
        document.getElementById('btn-aplicar-zonas-modificar').classList.remove('d-none')
        
        alert(`Se procesaron ${nuevasZonasProcesadas.length} nuevas zonas correctamente. Revisa la vista previa.`)
        
    } catch (error) {
        console.error('Error procesando zonas:', error)
        alert('Error al procesar el código HTML. Verifica que sea válido.')
    }
}

// Función para mostrar vista previa de nuevas zonas
function mostrarVistaPreviaZonasModificar() {
    const listaZonas = document.getElementById('lista-zonas-modificar')
    const vistaPrevia = document.getElementById('vista-previa-zonas-modificar')
    
    listaZonas.innerHTML = ''
    
    nuevasZonasProcesadas.forEach((zona, index) => {
        const item = document.createElement('div')
        item.className = 'list-group-item d-flex justify-content-between align-items-center'
        item.innerHTML = `
            <div>
                <strong>${zona.nombre}</strong>
                <br>
                <small class="text-muted">Coordenadas: ${zona.coordenadas}</small>
            </div>
            <span class="badge bg-success rounded-pill">${zona.shape}</span>
        `
        listaZonas.appendChild(item)
    })
    
    vistaPrevia.classList.remove('d-none')
}

// Función para aplicar los cambios de zonas
export async function aplicarCambiosZonas() {
    if (!idCafModificando) {
        mostrarMensaje(mensajes, 'Error: No se encontró ID de CAF', 'danger')
        return
    }
    
    try {
        // Eliminar zonas existentes
        for (const zona of zonasExistentes) {
            await fetch(`/api/v1/zonas/${zona.id}`, {
                method: 'DELETE'
            })
        }
        
        // Crear nuevas zonas
        for (const zona of nuevasZonasProcesadas) {
            await fetch('/api/v1/zonas', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    idCaf: idCafModificando,
                    nombre: zona.nombre,
                    coordenadas: zona.coordenadas
                })
            })
        }
        
        mostrarMensaje(mensajes, `Zonas actualizadas correctamente. Se eliminaron ${zonasExistentes.length} zonas y se crearon ${nuevasZonasProcesadas.length} nuevas.`, 'success')
        
        // Cerrar modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('modal-modificar-zonas'))
        modal.hide()
        
        // Limpiar datos
        nuevasZonasProcesadas = []
        document.getElementById('codigo-html-zonas-modificar').value = ''
        document.getElementById('vista-previa-zonas-modificar').classList.add('d-none')
        document.getElementById('formulario-nuevas-zonas').classList.add('d-none')
        
    } catch (error) {
        console.error('Error aplicando cambios:', error)
        mostrarMensaje(mensajes, 'Error al aplicar los cambios de zonas', 'danger')
    }
}

// Función para mantener zonas actuales
export function mantenerZonasActuales() {
    mostrarMensaje(mensajes, 'Se mantendrán las zonas actuales sin cambios', 'info')
    
    // Cerrar modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('modal-modificar-zonas'))
    modal.hide()
}

// Función para limpiar el formulario de zonas original
export function limpiarZonas() {
    document.getElementById('codigo-html-zonas').value = ''
    document.getElementById('vista-previa-zonas').classList.add('d-none')
    document.getElementById('btn-crear-caf-con-zonas').classList.add('d-none')
    zonasProcesadas = []
}