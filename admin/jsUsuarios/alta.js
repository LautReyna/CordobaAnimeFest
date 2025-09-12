import {
    procesarFormulario,
    altaRegistro,
    obtenerRegistros,
    eliminarRegistro,
} from '../recursos/utilidades.js'
import { 
    limpiarFormularioUsuario,
    renderizarFormularioUsuario,
    renderizarListadoUsuario, 
    mostrarMensaje,
    mostrarContrasenaAlta,
    mostrarContrasenaEditar,
} from './funciones.js'

const formularioAlta = document.getElementById('form-alta-usuario')
const formularioEditar = document.getElementById('form-editar-usuario')
const botonEliminar = document.getElementById('btn-eliminar')
const mensajes = document.getElementById('mensajes')

formularioAlta.addEventListener('submit', async(e) =>{
    e.preventDefault()

    const datosFormulario = procesarFormulario(formularioAlta)
    try{
        const respuesta = await altaRegistro(
            '/api/v1/usuarios',
            'POST',
            datosFormulario
        )
        const resultado = await respuesta.json()
        mostrarMensaje(mensajes, resultado.mensaje || 'Usuario dado de alta correctamente')
        limpiarFormularioUsuario(formularioAlta)
        
        const resActualizado = await obtenerRegistros('/api/v1/usuarios')
        const usuariosActualizados = await resActualizado.json()
        renderizarListadoUsuario(usuariosActualizados)

        const modal = bootstrap.Modal.getInstance(document.getElementById('modal-alta-usuario'))
        modal.hide()
    }catch(error){
        console.log(error)
        mostrarMensaje(mensajes, 'No se pudo dar de alta al usuario')
    }
})

document.getElementById('contenedor-usuarios').addEventListener('click', (e) => {
    const btn = e.target.closest('.btn-editar-usuario')
    if (btn) {
        renderizarFormularioUsuario({
            id: btn.dataset.id,
            nombre: btn.dataset.nombre,
            contrasena: btn.dataset.contrasena,
            categoria: btn.dataset.categoria
        })
    }
})

formularioEditar.addEventListener('submit', async(e)=>{
    e.preventDefault()

    const datosFormulario = procesarFormulario(formularioEditar)
    const id = datosFormulario.id

    try{
        const respuesta = await altaRegistro(
            '/api/v1/usuarios/' + id,
            'PUT',
            datosFormulario
        )
        mostrarMensaje(mensajes, datos.mensaje || 'Usuario modificado correctamente')
        
        const resultado = await respuesta.json()
        mostrarMensaje(mensajes, resultado.mensaje || 'usuario modificado correctamente')
        limpiarFormularioUsuario(formularioEditar)

        const resActualizado = await obtenerRegistros('/api/v1/usuarios')
        const usuariosActualizados = await resActualizado.json()
        renderizarListadoUsuario(usuariosActualizados)

        const modal = bootstrap.Modal.getInstance(document.getElementById('modal-editar-usuario'))
        modal.hide()        
    }catch(error){
        console.log(error)
        mostrarMensaje(mensajes, 'No se pudo editar el usuario')
    }
})

botonEliminar.addEventListener('click', async (e) => {
    e.preventDefault()

    const datosFormulario = procesarFormulario(formularioEditar)
    const id = datosFormulario.id

    try{
        if (confirm(`¿Eliminar usuario "${datosFormulario.nombre}"?`)) {
            const eliminar = await eliminarRegistro(`/api/v1/usuarios/` + id)
            const resultado = await eliminar.json()

            if (eliminar.ok) {
                mostrarMensaje(mensajes, resultado.mensaje || 'Usuario eliminado correctamente.')
                
                limpiarFormularioUsuario(formularioEditar)
                const resActualizado = await obtenerRegistros('/api/v1/usuarios')
                const usuariosActualizados = await resActualizado.json()
                renderizarListadoUsuario(usuariosActualizados)
            } else {
                mostrarMensaje(mensajes, resultado.mensaje || 'No se pudo eliminar el usuario.')
            }
            const modal = bootstrap.Modal.getInstance(document.getElementById('modal-editar-usuario'))
            modal.hide()      
        }
    }catch(error){
        console.error(error)
        mostrarMensaje(mensajes, 'Ocurrió un error al intentar eliminar el evento.')
    }
})

mostrarContrasenaAlta()
mostrarContrasenaEditar()