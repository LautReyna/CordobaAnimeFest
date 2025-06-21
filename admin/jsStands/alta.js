import {
    procesarFormulario,
    altaRegistro,
    obtenerRegistros,
    eliminarRegistro,
} from '../recursos/utilidades.js'
import { 
    renderizarFormularioPorNombre,
    idStand,
    limpiarFormularioStands,
    renderizarListadoStands, 
    mostrarMensaje
} from './funciones.js'

const formulario = document.getElementById('form-stand')
const mensajes = document.getElementById('mensajes')
const botonEliminar = document.getElementById('eliminar-stand')

formulario.addEventListener('submit', async (stand) => {
    stand.preventDefault()

    const datosFormulario = procesarFormulario(formulario)

    const campos = ['nombre', 'descripcion', 'ubicacion', 'estado']

    const camposIncompletos = campos.filter(campo => {
        return !datosFormulario[campo] || datosFormulario[campo].trim() === ''
    })

    if(camposIncompletos.length > 0){
        mostrarMensaje(mensajes, `Complete los siguientes campos: ${camposIncompletos.join(', ')}`)
        return
    }
    
    if(!idStand){
        try{
            const respuesta = await altaRegistro(
                '/api/v1/stands',
                'POST',
                datosFormulario
            )
            const resultado = await respuesta.json()
            mostrarMensaje(mensajes, resultado.mensaje || 'Stand dado de alta correctamente')

            limpiarFormularioStands(formulario)
            const resActualizado = await obtenerRegistros('/api/v1/stands')
            const standsActualizados = await resActualizado.json()
            renderizarListadoStands(standsActualizados)
            renderizarFormularioPorNombre(standsActualizados, formulario)
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

            limpiarFormularioStands(formulario)
            const resActualizado = await obtenerRegistros('/api/v1/stands')
            const standsActualizados = await resActualizado.json()
            renderizarListadoStands(standsActualizados)
            renderizarFormularioPorNombre(standsActualizados, formulario)
            
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
        const respuesta = await obtenerRegistros('/api/v1/stands')
        const datosStands = await respuesta.json()
        const standEncontrado = datosStands.find(e => e.nombre.toLowerCase() === nombreIngresado.toLowerCase())

        if (!standEncontrado) {
            mostrarMensaje(mensajes, 'No se encontró un stand con ese nombre.')
            return;
        }

        if (confirm(`¿Eliminar el stand "${standEncontrado.nombre}"?`)) {
            const eliminar = await eliminarRegistro(`/api/v1/stands/${standEncontrado.id}`)
            const resultado = await eliminar.json()

            if (eliminar.ok) {
                mostrarMensaje(mensajes, resultado.mensaje || 'Stand eliminado correctamente.')
                
                limpiarFormularioStands(formulario)
                const resActualizado = await obtenerRegistros('/api/v1/stands')
                const standsActualizados = await resActualizado.json()
                renderizarListadoStands(standsActualizados)
                renderizarFormularioPorNombre(standsActualizados, formulario)
            } else {
                mostrarMensaje(mensajes, resultado.mensaje || 'No se pudo eliminar el stand.')
            }
        }
    }catch(error){
        console.error(error)
        mostrarMensaje(mensajes, 'Ocurrió un error al intentar eliminar el stand.')
    }
})

const resultado = await obtenerRegistros('/api/v1/stands')
const datosStands = await resultado.json()
await renderizarFormularioPorNombre(datosStands, formulario)