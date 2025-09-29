import { 
  procesarFormulario,
  mostrarMensaje,
  altaRegistro,
  obtenerRegistros,
  limpiarFormulario
} from "../recursos/utilidades.js"
import { 
  crearEnlaces,
  renderizarFormulario
} from './funciones.js'

const mensajes = document.getElementById('mensajes')
const formModificarCaf = document.getElementById('form-modificar-caf')


document.addEventListener('submit', async (e) => {
  if(e.target && e.target.id === 'form-crear-caf'){
    e.preventDefault()
    const datosFormulario = procesarFormulario(document.getElementById('form-crear-caf'))
    try{
      const respuesta = await altaRegistro(
        '/api/v1/caf',
        'POST',
        datosFormulario
      )
      const resultado = await respuesta.json()
      mostrarMensaje(mensajes, resultado.mensaje || 'caf dada de alta')
      limpiarFormulario(document.getElementById('form-crear-caf'))
  
      await crearEnlaces()
    }catch(error){
      console.log(error)
      mostrarMensaje(mensajes, 'no se pudo crear la caf')
    }
  }
})

document.addEventListener('click', async (e) => {
  const btn = e.target.closest('#btn-modificar')
  if (btn) {
    const res = await obtenerRegistros('/api/v1/caf/activa')
    const datosCaf = await res.json()
    renderizarFormulario(datosCaf)
  }
})

formModificarCaf.addEventListener('submit', async(e)=>{
  e.preventDefault()

  const datosFormulario = procesarFormulario(formModificarCaf)
  const id = datosFormulario.id

  try{
      const respuesta = await altaRegistro(
          '/api/v1/caf/' + id,
          'PUT',
          datosFormulario
      )
      const resultado = await respuesta.json()
      mostrarMensaje(mensajes, resultado.mensaje || 'Caf modificada correctamente')
      limpiarFormulario(formModificarCaf)

      const modal = bootstrap.Modal.getInstance(document.getElementById('modal-modificar-caf'))
      modal.hide()

      await crearEnlaces()
  }catch(error){
      console.log(error)
      mostrarMensaje(mensajes, 'No se pudo modificar la caf')
  }
})

document.addEventListener('click', async(e) => {
  const btn = e.target.closest('#btn-finalizar')
  if(btn){
    e.preventDefault()
    try{
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
