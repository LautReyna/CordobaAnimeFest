// Importaciones de utilidades y funciones
import { 
  procesarFormularioConArchivo,
  mostrarMensaje,
  altaRegistroConArchivo,
  obtenerRegistros,
  limpiarFormulario
} from "../recursos/utilidades.js"
import { 
  crearEnlaces,
  renderizarFormulario,
  mostrarModalZonas,
  procesarZonas,
  crearCafConZonas,
  limpiarZonas,
  mostrarModalGestionZonas,
  procesarZonasModificar,
  aplicarCambiosZonas,
  mantenerZonasActuales
} from './funciones.js'

// Variables globales
const mensajes = document.getElementById('mensajes')
const formModificarCaf = document.getElementById('form-modificar-caf')

// Event listener para el formulario de creación de CAF
document.addEventListener('submit', async (e) => {
  if(e.target && e.target.id === 'form-crear-caf'){
    e.preventDefault()
    
    // Validar que se haya subido un mapa
    const inputMapa = document.querySelector('#form-crear-caf input[name="mapa"]')
    if (!inputMapa.files[0]) {
      mostrarMensaje(mensajes, 'Debes subir un mapa', 'danger')
      return
    }
    
    // Procesar y guardar datos del formulario para usar después
    const formDataCaf = procesarFormularioConArchivo(document.getElementById('form-crear-caf'))
    const archivoMapa = inputMapa.files[0]
    
    // Mostrar modal de zonas
    mostrarModalZonas(archivoMapa, formDataCaf)
  }
})

// Event listener para el botón de modificación de CAF
document.addEventListener('click', async (e) => {
  const btn = e.target.closest('#btn-modificar')
  if (btn) {
    // Obtener datos de la CAF activa y renderizar el formulario
    const res = await obtenerRegistros('/api/v1/caf/activa')
    const datosCaf = await res.json()
    renderizarFormulario(datosCaf)
  }
})

// Event listener para el formulario de modificación de CAF
formModificarCaf.addEventListener('submit', async(e)=>{
  e.preventDefault()

  const datosFormulario = procesarFormularioConArchivo(formModificarCaf)
  const id = datosFormulario.get('id')
  
  // Validar que se haya encontrado el ID de la CAF
  if (!id) {
    mostrarMensaje(mensajes, 'Error: No se encontró el ID de la CAF', 'danger')
    return
  }

  try{
      // Enviar solicitud PUT para modificar la CAF
      const respuesta = await altaRegistroConArchivo(
          '/api/v1/caf/' + id,
          'PUT',
          datosFormulario
      )
      const resultado = await respuesta.json()
      mostrarMensaje(mensajes, resultado.mensaje || 'Caf modificada correctamente')
      limpiarFormulario(formModificarCaf)

      // Cerrar modal y actualizar interfaz
      const modal = bootstrap.Modal.getInstance(document.getElementById('modal-modificar-caf'))
      modal.hide()
      await crearEnlaces()
  }catch(error){
      console.log(error)
      mostrarMensaje(mensajes, 'No se pudo modificar la caf')
  }
})

// Event listener para el botón de finalización de CAF
document.addEventListener('click', async(e) => {
  const btn = e.target.closest('#btn-finalizar')
  if(btn){
    e.preventDefault()
    try{
      // Enviar solicitud PUT para finalizar la CAF
      const respuesta = await fetch('/api/v1/caf/finalizar', {
        method: 'PUT',
      })
      const resultado = await respuesta.json()
      mostrarMensaje(mensajes, resultado.mensaje || 'Caf finalizada')

      await crearEnlaces()
    }catch(error){
      console.log(error)
      mostrarMensaje(mensajes, 'No se pudo finalizar la caf')
    }
  }
})

// Event listeners para el modal de zonas (creación de zonas)
document.addEventListener('click', async (e) => {
  if (e.target.id === 'btn-procesar-zonas') {
    procesarZonas()
  }
  
  if (e.target.id === 'btn-crear-caf-con-zonas') {
    await crearCafConZonas(mensajes, altaRegistroConArchivo, crearEnlaces)
  }
  
  if (e.target.id === 'btn-limpiar-zonas') {
    limpiarZonas()
  }
  
  // Event listeners para el modal de modificar zonas
  if (e.target.id === 'btn-gestionar-zonas-modificar') {
    await mostrarModalGestionZonas()
  }
  
  if (e.target.id === 'btn-actualizar-zonas') {
    document.getElementById('formulario-nuevas-zonas').classList.remove('d-none')
  }
  
  if (e.target.id === 'btn-mantener-zonas') {
    mantenerZonasActuales()
  }
  
  if (e.target.id === 'btn-procesar-zonas-modificar') {
    procesarZonasModificar()
  }
  
  if (e.target.id === 'btn-aplicar-zonas-modificar') {
    await aplicarCambiosZonas()
  }
  
  if (e.target.id === 'btn-cancelar-zonas-modificar') {
    document.getElementById('formulario-nuevas-zonas').classList.add('d-none')
    document.getElementById('codigo-html-zonas-modificar').value = ''
    document.getElementById('vista-previa-zonas-modificar').classList.add('d-none')
  }
})
