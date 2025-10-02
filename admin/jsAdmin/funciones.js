import { obtenerRegistros } from "../recursos/utilidades.js"
import { renderizarListadoEventos } from "../jsEventos/funciones.js"
import { renderizarListadoStands } from "../jsStands/funciones.js"

export async function crearEnlaces() {
    try {
      const respuesta = await fetch('/miUsuario', { credentials: "include" })
      if (!respuesta.ok) throw Error('No autenticado')
  
      const usuario = await respuesta.json()
      const enlaces = document.getElementById('enlaces')
      const mensaje = document.getElementById('mensaje-bienvenida')
      const contenedorCaf = document.getElementById('contenedor-caf')
      
      const resCaf = await obtenerRegistros('/api/v1/caf/activa')
      const cafActiva = await resCaf.json()

      enlaces.innerHTML = `
        <li class="nav-item">
          <button id="btn-logout" class="btn btn-danger">
            <i class="bi bi-box-arrow-left"></i> 
          </button>
        </li>
      `
      if(mensaje){
        mensaje.innerHTML = `
          <h1 class="d-flex justify-content-center title">BIENVENIDO ${usuario.nombre.toUpperCase()}</h1> 
        `
      }
  
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
  
        if(contenedorCaf){
          contenedorCaf.innerHTML = ''
          if(cafActiva){
            contenedorCaf.innerHTML = `
              <div class="d-flex justify-content-center mt-5">
                  <div class="container" style="width: 40%;">
                      <div class="card mt-3">
                          <div class="card-body">
                            <h3>Caf Activa</h3>
                            <h4>${cafActiva.fecha}</h4>
                            <button 
                              data-bs-toggle="modal" data-bs-target="#modal-modificar-caf" id="btn-modificar"
                              style="border: none; background: none; padding-left: 15px; margin-bottom: 15px;">
                              <i class="bi bi-pencil-square"></i>
                            </button>
                            <button id="btn-finalizar"
                              style="border: none; background: none; padding-left: 15px; margin-bottom: 15px;">
                              <i class="bi bi-trash3"></i>
                            </button>
                          </div>
                      </div>
                  </div>
              </div>
            `
          }else{
            contenedorCaf.innerHTML = `
              <div class="d-flex justify-content-center mt-5">
                <div class="container" style="width: 40%;">
                  <div class="card p-3">
                    <h3>Crear nueva CAF</h3>
                    <form id="form-crear-caf">
                      <label>Fecha</label>
                      <input type="date" name="fecha" class="form-control" required>
                      <label>Mapa</label>
                      <input type="text" name="mapa" class="form-control">
                      <button type="submit" class="btn btn-primary mt-2">Crear</button>
                    </form>
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

export async function verificarCafActiva(){
  try{
    const respuesta = await fetch('/caf/activa')
    const datos = await respuesta.json()

    const section = document.getElementById('section-gestor')

    if(!datos.activa){
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

export async function cambiarComboBox(datosCaf, callback){
  try{
    const combos = document.querySelectorAll('.cbCaf')
    if(!combos.length) return

    combos.forEach(cb => {
      cb.addEventListener("change", async () => {
        const idCaf = cb.value
        const caf = datosCaf.find(c => c.id == idCaf)
        callback(idCaf, caf)
      })
    })
  }catch(error){
    console.error('Error cambiando comboBox', error)
  }
}

export async function mostrarEventosSegunCaf(idCaf, cafSeleccionada) {
  const sectionGestor = document.getElementById('section-gestor')
  const sectionPasada = document.getElementById('section-pasada')

  const res = await obtenerRegistros(`/api/v1/eventos/caf/${idCaf}`)
  const eventos = await res.json()

  if (cafSeleccionada.activa) {
    sectionGestor.classList.remove('hidden')
    sectionPasada.classList.add('hidden')
    renderizarListadoEventos(eventos, 'contenedor-eventos')
  } else {
    sectionPasada.classList.remove('hidden')
    sectionGestor.classList.add('hidden')

    renderizarListadoEventos(eventos, 'contenedor-eventos-pasada')
  }
}

export async function mostrarStandsSegunCaf(idCaf, cafSeleccionada) {
  const sectionGestor = document.getElementById('section-gestor')
  const sectionPasada = document.getElementById('section-pasada')

  const res = await obtenerRegistros(`/api/v1/stands/caf/${idCaf}`)
  const stands = await res.json()

  if (cafSeleccionada.activa) {
    sectionGestor.classList.remove('hidden')
    sectionPasada.classList.add('hidden')
    renderizarListadoStands(stands, 'contenedor-stands')
  } else {
    sectionPasada.classList.remove('hidden')
    sectionGestor.classList.add('hidden')

    renderizarListadoStands(stands, 'contenedor-stands-pasada')
  }
}

export function renderizarFormulario(datosCaf){
  try {
      document.querySelector('#form-modificar-caf input[name="id"]').value = datosCaf.id
      document.querySelector('#form-modificar-caf input[name="fecha"]').value = datosCaf.fecha
      document.querySelector('#form-modificar-caf input[name="mapa"]').value = datosCaf.mapa
  } catch (error) {
      console.log(error)
  }
}

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

