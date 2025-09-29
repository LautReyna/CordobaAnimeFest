import {
    procesarFormulario,
    altaRegistro,
    obtenerRegistros,
    eliminarRegistro,
    mostrarMensaje,
    limpiarFormulario,
    cancelarRegistro
} from '../recursos/utilidades.js'
import { 
    renderizarFormularioPorNombre,
    idEvento,
    renderizarListadoEventos
} from './funciones.js'

const formulario = document.getElementById('form-evento')
const mensajes = document.getElementById('mensajes')
const botonEliminar = document.getElementById('eliminar-evento')
const botonCancelar = document.getElementById('cancelar-evento')

formulario.addEventListener('submit', async (e) => {
    e.preventDefault()

    const datosFormulario = procesarFormulario(formulario)
    
    if(datosFormulario.nombre){
        datosFormulario.nombre = datosFormulario.nombre.trimEnd()
    }

    if(!idEvento){
        try{
            const respuesta = await altaRegistro(
                '/api/v1/eventos',
                'POST',
                datosFormulario
            )
            const resultado = await respuesta.json()
            mostrarMensaje(mensajes, resultado.mensaje || 'Evento dado de alta correctamente')

            limpiarFormulario(formulario)
            const resActualizado = await obtenerRegistros('/api/v1/eventos/caf/activa')
            const eventosActualizados = await resActualizado.json()
            renderizarListadoEventos(eventosActualizados, 'contenedor-eventos')
            renderizarFormularioPorNombre(eventosActualizados, formulario, mensajes)
        }catch(error){
            console.log(error)
            mostrarMensaje(mensajes, 'No se pudo dar de alta el registro')
        }
    }else{
        const datosFormulario = procesarFormulario(formulario)

        try{
            const respuesta = await altaRegistro(
                '/api/v1/eventos/' + idEvento,
                'PUT',
                datosFormulario
            )
            const datos = await respuesta.json()
            mostrarMensaje(mensajes, datos.mensaje || 'Evento modificado correctamente')

            limpiarFormulario(formulario)
            const resActualizado = await obtenerRegistros('/api/v1/eventos/caf/activa')
            const eventosActualizados = await resActualizado.json()
            renderizarListadoEventos(eventosActualizados, 'contenedor-eventos')
            renderizarFormularioPorNombre(eventosActualizados, formulario, mensajes)
            
        }catch(error){
            console.error(error)
            mostrarMensaje(mensajes, 'Error al modificar el evento.')
        }
    }
    
})

botonEliminar.addEventListener('click', async (e) => {
    e.preventDefault()

    const nombreIngresado = formulario.nombre.value

    if(!nombreIngresado){
        mostrarMensaje(mensajes, 'Ingrese el nombre del evento a eliminar.')
        return
    }    

    try{
        const respuesta = await obtenerRegistros('/api/v1/eventos/caf/activa')
        const datosEventos = await respuesta.json()
        const eventoEncontrado = datosEventos.find(e => e.nombre.toLowerCase() === nombreIngresado.toLowerCase())

        if (!eventoEncontrado) {
            mostrarMensaje(mensajes, 'No se encontró un evento con ese nombre.')
            return;
        }

        if (confirm(`¿Eliminar el evento "${eventoEncontrado.nombre}"?`)) {
            const eliminar = await eliminarRegistro(`/api/v1/eventos/${eventoEncontrado.idevento}`)
            const resultado = await eliminar.json()

            if (eliminar.ok) {
                mostrarMensaje(mensajes, resultado.mensaje || 'Evento eliminado correctamente.')
                
                limpiarFormulario(formulario)
                const resActualizado = await obtenerRegistros('/api/v1/eventos/caf/activa')
                const eventosActualizados = await resActualizado.json()
                renderizarListadoEventos(eventosActualizados, 'contenedor-eventos')
                renderizarFormularioPorNombre(eventosActualizados, formulario, mensajes)
            } else {
                mostrarMensaje(mensajes, resultado.mensaje || 'No se pudo eliminar el evento.')
            }
        }
    }catch(error){
        console.error(error)
        mostrarMensaje(mensajes, 'Ocurrió un error al intentar eliminar el evento.')
    }
})

botonCancelar.addEventListener('click', async (e) => {
    e.preventDefault()
    const nombreIngresado = formulario.nombre.value

    if(!nombreIngresado){
        mostrarMensaje(mensajes, 'Ingrese el nombre del evento a cancelar.')
        return
    }

    try{
        const respuesta = await obtenerRegistros('/api/v1/eventos/caf/activa')
        const datosEventos = await respuesta.json()
        const eventoEncontrado = datosEventos.find(e => e.nombre.toLowerCase() === nombreIngresado.toLowerCase())

        console.log(eventoEncontrado)
        if (!eventoEncontrado) {
            mostrarMensaje(mensajes, 'No se encontró un evento con ese nombre.')
            return;
        }

        if (confirm(`Cancelar el evento "${eventoEncontrado.nombre}"?`)) {
            const cancelar = await cancelarRegistro(`/api/v1/eventos/cancelar/${eventoEncontrado.idevento}`)
            const resultado = await cancelar.json()

            if (cancelar.ok) {
                mostrarMensaje(mensajes, resultado.mensaje || 'Evento cancelado correctamente.')
                
                limpiarFormulario(formulario)
                const resActualizado = await obtenerRegistros('/api/v1/eventos/caf/activa')
                const eventosActualizados = await resActualizado.json()
                renderizarListadoEventos(eventosActualizados, 'contenedor-eventos')
                renderizarFormularioPorNombre(eventosActualizados, formulario, mensajes)
            } else {
                mostrarMensaje(mensajes, resultado.mensaje || 'No se pudo eliminar el evento.')
            }
        } 
    }catch(error){
      console.log(error)
      mostrarMensaje(mensajes, 'No se pudo finalizar la caf')
    }
})

const resultado = await obtenerRegistros('/api/v1/eventos/caf/activa')
const datosEventos = await resultado.json()
await renderizarFormularioPorNombre(datosEventos, formulario, mensajes)