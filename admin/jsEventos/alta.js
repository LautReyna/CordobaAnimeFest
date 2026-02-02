// Importaciones de utilidades y funciones
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

//Referencias a los elementos del DOM
const formulario = document.getElementById('form-evento')
const mensajes = document.getElementById('mensajes')
const botonEliminar = document.getElementById('eliminar-evento')
const botonCancelar = document.getElementById('cancelar-evento')

// Event listener para el formulario de creación o modificación de evento
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
    
    // limpiar espacios en blanco del nombre del evento
    const nombreEvento = datosFormulario.get('nombre')
    if(nombreEvento){
        datosFormulario.set('nombre', nombreEvento.trimEnd())
    }

    // Determinar si se esta creando o modificando el evento
    if(!idEvento){
        // CREACION DE EVENTO
        try{
            console.log('Creando evento con FormData:', datosFormulario)
            const respuesta = await altaRegistroConArchivo(
                '/api/v1/eventos',
                'POST',
                datosFormulario
            )
            const resultado = await respuesta.json()
            mostrarMensaje(mensajes, resultado.mensaje || 'Evento dado de alta correctamente', 'success')

            // Limpiar el formulario y actualizar el listado de eventos
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
        // MODIFICACION DE EVENTO
        try{
            console.log('Modificando evento con FormData:', datosFormulario)
            const respuesta = await altaRegistroConArchivo(
                '/api/v1/eventos/' + idEvento,
                'PUT',
                datosFormulario
            )
            const datos = await respuesta.json()
            mostrarMensaje(mensajes, datos.mensaje || 'Evento modificado correctamente', 'success')

            // Limpiar el formulario y actualizar el listado de eventos
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

// Event listener para el boton de eliminacion de evento
botonEliminar.addEventListener('click', async (e) => {
    e.preventDefault()

    const nombreIngresado = formulario.nombre.value

    // Validar que se haya ingresado un nombre de evento
    if(!nombreIngresado){
        mostrarMensaje(mensajes, 'Ingrese el nombre del evento a eliminar.', 'warning')
        return
    }    

    try{
        // Buscar el evento por el nombre
        const respuesta = await obtenerRegistros('/api/v1/eventos/caf/activa')
        const datosEventos = await respuesta.json()
        const eventoEncontrado = datosEventos.find(e => e.nombre.toLowerCase() === nombreIngresado.toLowerCase())

        if (!eventoEncontrado) {
            mostrarMensaje(mensajes, 'No se encontró un evento con ese nombre.', 'warning')
            return;
        }

        // Confirmar la eliminacion del evento
        if (confirm(`¿Eliminar el evento "${eventoEncontrado.nombre}"?`)) {
            const eliminar = await eliminarRegistro(`/api/v1/eventos/${eventoEncontrado.id}`)
            const resultado = await eliminar.json()

            if (eliminar.ok) {
                mostrarMensaje(mensajes, resultado.mensaje || 'Evento eliminado correctamente.', 'success')
                
                // Limpiar el formulario y actualizar el listado de eventos
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

// Event listener para el boton de cancelacion de evento
botonCancelar.addEventListener('click', async (e) => {
    e.preventDefault()
    const nombreIngresado = formulario.nombre.value

    // Validar que se haya ingresado un nombre de evento
    if(!nombreIngresado){
        mostrarMensaje(mensajes, 'Ingrese el nombre del evento a cancelar.', 'warning')
        return
    }

    try{
        // Buscar el evento por el nombre
        const respuesta = await obtenerRegistros('/api/v1/eventos/caf/activa')
        const datosEventos = await respuesta.json()
        const eventoEncontrado = datosEventos.find(e => e.nombre.toLowerCase() === nombreIngresado.toLowerCase())

        if (!eventoEncontrado) {
            mostrarMensaje(mensajes, 'No se encontró un evento con ese nombre.', 'warning')
            return;
        }

        // Confirmar la cancelacion del evento
        if (confirm(`Cancelar el evento "${eventoEncontrado.nombre}"?`)) {
            const cancelar = await cancelarRegistro(`/api/v1/eventos/cancelar/${eventoEncontrado.id}`)
            const resultado = await cancelar.json()

            if (cancelar.ok) {
                mostrarMensaje(mensajes, resultado.mensaje || 'Evento cancelado correctamente.', 'success')
                
                // Limpiar el formulario y actualizar el listado de eventos
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

// Cargar datos iniciales y configurar formulario
const resultado = await obtenerRegistros('/api/v1/eventos/caf/activa')
const datosEventos = await resultado.json()
await renderizarFormularioPorNombre(datosEventos, formulario, mensajes)