import {
    procesarFormulario,
    altaRegistro,
    obtenerRegistros,
    eliminarRegistro,
    limpiarFormulario,
    mostrarMensaje
} from '../recursos/utilidades.js'
import { 
    renderizarFormularioPorNombre,
    idStand,
    renderizarListadoStands
} from './funciones.js'

const formulario = document.getElementById('form-stand')
const mensajes = document.getElementById('mensajes')
const botonEliminar = document.getElementById('eliminar-stand')

formulario.addEventListener('submit', async (stand) => {
    stand.preventDefault()

    const datosFormulario = procesarFormulario(formulario)
    
    if(!idStand){
        try{
            const respuesta = await altaRegistro(
                '/api/v1/stands',
                'POST',
                datosFormulario
            )
            const resultado = await respuesta.json()
            mostrarMensaje(mensajes, resultado.mensaje || 'Stand dado de alta correctamente')

            limpiarFormulario(formulario)
            const resActualizado = await obtenerRegistros('/api/v1/stands/caf/activa')
            const standsActualizados = await resActualizado.json()
            renderizarListadoStands(standsActualizados, 'contenedor-stands')
            renderizarFormularioPorNombre(standsActualizados, formulario, mensajes)
        }catch(error){
            console.log(error)
            mostrarMensaje(mensajes, 'No se pudo dar de alta el registro')
        }
    }else{
        const datosFormulario = procesarFormulario(formulario)

        try{
            const respuesta = await altaRegistro(
                '/api/v1/stands/' + idStand,
                'PUT',
                datosFormulario
            )
            const datos = await respuesta.json()
            mostrarMensaje(mensajes, datos.mensaje || 'Stand modificado correctamente')

            limpiarFormulario(formulario)
            const resActualizado = await obtenerRegistros('/api/v1/stands/caf/activa')
            const standsActualizados = await resActualizado.json()
            renderizarListadoStands(standsActualizados, 'contenedor-stands')
            renderizarFormularioPorNombre(standsActualizados, formulario, mensajes)
            
        }catch(error){
            console.error(error)
            mostrarMensaje(mensajes, 'Error al modificar el stand.')
        }
    }
    
})

botonEliminar.addEventListener('click', async (stand) => {
    stand.preventDefault()

    const nombreIngresado = formulario.nombre.value

    if(!nombreIngresado){
        mostrarMensaje(mensajes, 'Ingrese el nombre del stand a eliminar.')
        return
    }    

    try{
        const respuesta = await obtenerRegistros('/api/v1/stands/caf/activa')
        const datosStands = await respuesta.json()
        const standEncontrado = datosStands.find(e => e.nombre.toLowerCase() === nombreIngresado.toLowerCase())

        if (!standEncontrado) {
            mostrarMensaje(mensajes, 'No se encontró un stand con ese nombre.')
            return;
        }

        if (confirm(`¿Eliminar el stand "${standEncontrado.nombre}"?`)) {
            const eliminar = await eliminarRegistro(`/api/v1/stands/${standEncontrado.idstand}`)
            const resultado = await eliminar.json()

            if (eliminar.ok) {
                mostrarMensaje(mensajes, resultado.mensaje || 'Stand eliminado correctamente.')
                
                limpiarFormulario(formulario)
                const resActualizado = await obtenerRegistros('/api/v1/stands/caf/activa')
                const standsActualizados = await resActualizado.json()
                console.log(standsActualizados)
                renderizarListadoStands(standsActualizados, 'contenedor-stands')
                renderizarFormularioPorNombre(standsActualizados, formulario, mensajes)
            } else {
                mostrarMensaje(mensajes, resultado.mensaje || 'No se pudo eliminar el stand.')
            }
        }
    }catch(error){
        console.error(error)
        mostrarMensaje(mensajes, 'Ocurrió un error al intentar eliminar el stand.')
    }
})

const resultado = await obtenerRegistros('/api/v1/stands/caf/activa')
const datosStands = await resultado.json()
await renderizarFormularioPorNombre(datosStands, formulario, mensajes)