import {
    procesarFormulario,
    altaRegistro,
    obtenerRegistros,
    eliminarRegistro,
} from '../recursos/utilidades.js'
import { 
    renderizarFormularioPorNombre,
    idEvento,
    limpiarFormularioEventos,
    renderizarListadoEventos, 
    mostrarMensaje
} from './funciones.js'

const formulario = document.getElementById('form-evento')
const mensajes = document.getElementById('mensajes')
const botonEliminar = document.getElementById('eliminar-evento')

formulario.addEventListener('submit', async (evento) => {
    evento.preventDefault()

    const datosFormulario = procesarFormulario(formulario)

    const campos = ['nombre', 'descripcion', 'ubicacion', 'estado', 'imagen', 'horaInicio', 'horaFin']

    const camposIncompletos = campos.filter(campo => {
        return !datosFormulario[campo] || datosFormulario[campo].trim() === ''
    })

    if(camposIncompletos.length > 0){
        mostrarMensaje(mensajes, `Complete los siguientes campos: ${camposIncompletos.join(', ')}`)
        return
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

            limpiarFormularioEventos(formulario)
            const resActualizado = await obtenerRegistros('/api/v1/eventos')
            const eventosActualizados = await resActualizado.json()
            renderizarListadoEventos(eventosActualizados)
            renderizarFormularioPorNombre(eventosActualizados, formulario)
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

            limpiarFormularioEventos(formulario)
            const resActualizado = await obtenerRegistros('/api/v1/eventos')
            const eventosActualizados = await resActualizado.json()
            renderizarListadoEventos(eventosActualizados)
            renderizarFormularioPorNombre(eventosActualizados, formulario)
            
        }catch(error){
            console.error(error)
            mostrarMensaje(mensajes, 'Error al modificar el evento.')
        }
    }
    
})

botonEliminar.addEventListener('click', async (evento) => {
    evento.preventDefault()

    const nombreIngresado = formulario.nombre.value

    if(!nombreIngresado){
        mostrarMensaje(mensajes, 'Ingrese el nombre del evento a eliminar.')
        return
    }    

    try{
        const respuesta = await obtenerRegistros('/api/v1/eventos')
        const datosEventos = await respuesta.json()
        const eventoEncontrado = datosEventos.find(e => e.nombre.toLowerCase() === nombreIngresado.toLowerCase())

        if (!eventoEncontrado) {
            mostrarMensaje(mensajes, 'No se encontró un evento con ese nombre.')
            return;
        }

        if (confirm(`¿Eliminar el evento "${eventoEncontrado.nombre}"?`)) {
            const eliminar = await eliminarRegistro(`/api/v1/eventos/${eventoEncontrado.id}`)
            const resultado = await eliminar.json()

            if (eliminar.ok) {
                mostrarMensaje(mensajes, resultado.mensaje || 'Evento eliminado correctamente.')
                
                limpiarFormularioEventos(formulario)
                const resActualizado = await obtenerRegistros('/api/v1/eventos')
                const eventosActualizados = await resActualizado.json()
                renderizarListadoEventos(eventosActualizados)
                renderizarFormularioPorNombre(eventosActualizados, formulario)
            } else {
                mostrarMensaje(mensajes, resultado.mensaje || 'No se pudo eliminar el evento.')
            }
        }
    }catch(error){
        console.error(error)
        mostrarMensaje(mensajes, 'Ocurrió un error al intentar eliminar el evento.')
    }
})

const resultado = await obtenerRegistros('/api/v1/eventos')
const datosEventos = await resultado.json()
await renderizarFormularioPorNombre(datosEventos, formulario)