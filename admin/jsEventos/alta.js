import {
    procesarFormulario,
    procesarFormularioConArchivo,
    altaRegistro,
    altaRegistroConArchivo,
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

    
    // Manejar campo de imagen requerido solo para creación
    const campoImagen = formulario.querySelector('input[name="imagen"]')
    if (!idEvento) {
        // Para creación, el campo es requerido
        campoImagen.required = true
        campoImagen.setAttribute('aria-describedby', 'imagen-help')
    } else {
        // Para modificación, el campo es opcional
        campoImagen.required = false
        campoImagen.removeAttribute('aria-describedby')
    }

    const datosFormulario = procesarFormularioConArchivo(formulario)
    
    // Obtener el nombre del evento para validación
    const nombreEvento = datosFormulario.get('nombre')
    if(nombreEvento){
        datosFormulario.set('nombre', nombreEvento.trimEnd())
    }

    if(!idEvento){
        try{
            console.log('Creando evento con FormData:', datosFormulario)
            const respuesta = await altaRegistroConArchivo(
                '/api/v1/eventos',
                'POST',
                datosFormulario
            )
            const resultado = await respuesta.json()
            mostrarMensaje(mensajes, resultado.mensaje || 'Evento dado de alta correctamente', 'success')

            limpiarFormulario(formulario)
            const resActualizado = await obtenerRegistros('/api/v1/eventos/caf/activa')
            const eventosActualizados = await resActualizado.json()
            renderizarListadoEventos(eventosActualizados, 'contenedor-eventos')
            renderizarFormularioPorNombre(eventosActualizados, formulario, mensajes)
        }catch(error){
            console.log(error)
            mostrarMensaje(mensajes, 'No se pudo dar de alta el registro', 'danger')
        }
    }else{
        try{
            console.log('Modificando evento con FormData:', datosFormulario)
            const respuesta = await altaRegistroConArchivo(
                '/api/v1/eventos/' + idEvento,
                'PUT',
                datosFormulario
            )
            const datos = await respuesta.json()
            mostrarMensaje(mensajes, datos.mensaje || 'Evento modificado correctamente', 'success')

            limpiarFormulario(formulario)
            const resActualizado = await obtenerRegistros('/api/v1/eventos/caf/activa')
            const eventosActualizados = await resActualizado.json()
            renderizarListadoEventos(eventosActualizados, 'contenedor-eventos')
            renderizarFormularioPorNombre(eventosActualizados, formulario, mensajes)
            
        }catch(error){
            console.error(error)
            mostrarMensaje(mensajes, 'Error al modificar el evento.', 'danger')
        }
    }
    
})

botonEliminar.addEventListener('click', async (e) => {
    e.preventDefault()

    const nombreIngresado = formulario.nombre.value

    if(!nombreIngresado){
        mostrarMensaje(mensajes, 'Ingrese el nombre del evento a eliminar.', 'warning')
        return
    }    

    try{
        const respuesta = await obtenerRegistros('/api/v1/eventos/caf/activa')
        const datosEventos = await respuesta.json()
        const eventoEncontrado = datosEventos.find(e => e.nombre.toLowerCase() === nombreIngresado.toLowerCase())

        if (!eventoEncontrado) {
            mostrarMensaje(mensajes, 'No se encontró un evento con ese nombre.', 'warning')
            return;
        }

        if (confirm(`¿Eliminar el evento "${eventoEncontrado.nombre}"?`)) {
            const eliminar = await eliminarRegistro(`/api/v1/eventos/${eventoEncontrado.id}`)
            const resultado = await eliminar.json()

            if (eliminar.ok) {
                mostrarMensaje(mensajes, resultado.mensaje || 'Evento eliminado correctamente.', 'success')
                
                limpiarFormulario(formulario)
                const resActualizado = await obtenerRegistros('/api/v1/eventos/caf/activa')
                const eventosActualizados = await resActualizado.json()
                renderizarListadoEventos(eventosActualizados, 'contenedor-eventos')
                renderizarFormularioPorNombre(eventosActualizados, formulario, mensajes)
            } else {
                mostrarMensaje(mensajes, resultado.mensaje || 'No se pudo eliminar el evento.', 'danger')
            }
        }
    }catch(error){
        console.error(error)
        mostrarMensaje(mensajes, 'Ocurrió un error al intentar eliminar el evento.', 'danger')
    }
})

botonCancelar.addEventListener('click', async (e) => {
    e.preventDefault()
    const nombreIngresado = formulario.nombre.value

    if(!nombreIngresado){
        mostrarMensaje(mensajes, 'Ingrese el nombre del evento a cancelar.', 'warning')
        return
    }

    try{
        const respuesta = await obtenerRegistros('/api/v1/eventos/caf/activa')
        const datosEventos = await respuesta.json()
        const eventoEncontrado = datosEventos.find(e => e.nombre.toLowerCase() === nombreIngresado.toLowerCase())

        console.log(eventoEncontrado)
        if (!eventoEncontrado) {
            mostrarMensaje(mensajes, 'No se encontró un evento con ese nombre.', 'warning')
            return;
        }

        if (confirm(`Cancelar el evento "${eventoEncontrado.nombre}"?`)) {
            const cancelar = await cancelarRegistro(`/api/v1/eventos/cancelar/${eventoEncontrado.id}`)
            const resultado = await cancelar.json()

            if (cancelar.ok) {
                mostrarMensaje(mensajes, resultado.mensaje || 'Evento cancelado correctamente.', 'success')
                
                limpiarFormulario(formulario)
                const resActualizado = await obtenerRegistros('/api/v1/eventos/caf/activa')
                const eventosActualizados = await resActualizado.json()
                renderizarListadoEventos(eventosActualizados, 'contenedor-eventos')
                renderizarFormularioPorNombre(eventosActualizados, formulario, mensajes)
            } else {
                mostrarMensaje(mensajes, resultado.mensaje || 'No se pudo eliminar el evento.', 'danger')
            }
        } 
    }catch(error){
      console.log(error)
      mostrarMensaje(mensajes, 'No se pudo finalizar la caf', 'danger')
    }
})

const resultado = await obtenerRegistros('/api/v1/eventos/caf/activa')
const datosEventos = await resultado.json()
await renderizarFormularioPorNombre(datosEventos, formulario, mensajes)