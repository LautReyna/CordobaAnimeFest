// Importaciones de utilidades y funciones
import {
    procesarFormulario,
    altaRegistro,
    obtenerRegistros,
    eliminarRegistro,
    mostrarMensaje,
    limpiarFormulario
} from '../recursos/utilidades.js'
import { 
    renderizarFormularioUsuario,
    renderizarListadoUsuario, 
    mostrarContrasenaAlta,
    mostrarContrasenaEditar,
} from './funciones.js'

// Referencias a los elementos del DOM
const formularioAlta = document.getElementById('form-alta-usuario')
const formularioEditar = document.getElementById('form-editar-usuario')
const botonEliminar = document.getElementById('btn-eliminar')
const mensajes = document.getElementById('mensajes')

// Event listener para el formulario de creación de usuario
formularioAlta.addEventListener('submit', async(e) =>{
    e.preventDefault()

    const datosFormulario = procesarFormulario(formularioAlta)
    try{
        // CREACION DE USUARIO
        const respuesta = await altaRegistro(
            '/api/v1/usuarios',
            'POST',
            datosFormulario
        )
        const resultado = await respuesta.json()
        mostrarMensaje(mensajes, resultado.mensaje || 'Usuario dado de alta correctamente')
        // Limpiar formulario y actualizar listado de usuarios
        limpiarFormulario(formularioAlta)
        const resActualizado = await obtenerRegistros('/api/v1/usuarios')
        const usuariosActualizados = await resActualizado.json()
        renderizarListadoUsuario(usuariosActualizados)

        // Cerrar modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('modal-alta-usuario'))
        modal.hide()
    }catch(error){
        console.log(error)
        mostrarMensaje(mensajes, 'No se pudo dar de alta al usuario')
    }
})

// Event listener para el boton de editar usuario
document.getElementById('contenedor-usuarios').addEventListener('click', (e) => {
    const btn = e.target.closest('.btn-editar-usuario')
    if (btn) {
        // Renderizar formulario de usuario
        renderizarFormularioUsuario({
            id: btn.dataset.id,
            nombre: btn.dataset.nombre,
            contrasena: btn.dataset.contrasena,
            categoria: btn.dataset.categoria
        })
    }
})

// Event listener para el formulario de edición de usuario
formularioEditar.addEventListener('submit', async(e)=>{
    e.preventDefault()

    const datosFormulario = procesarFormulario(formularioEditar)
    const id = datosFormulario.id

    try{
        // MODIFICACION DE USUARIO
        const respuesta = await altaRegistro(
            '/api/v1/usuarios/' + id,
            'PUT',
            datosFormulario
        )        
        const resultado = await respuesta.json()
        mostrarMensaje(mensajes, resultado.mensaje || 'usuario modificado correctamente')
        // Limpiar formulario y actualizar listado de usuarios
        limpiarFormulario(formularioEditar)

        const resActualizado = await obtenerRegistros('/api/v1/usuarios')
        const usuariosActualizados = await resActualizado.json()
        renderizarListadoUsuario(usuariosActualizados)

        // Cerrar modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('modal-editar-usuario'))
        modal.hide()        
    }catch(error){
        console.log(error)
        mostrarMensaje(mensajes, 'No se pudo editar el usuario')
    }
})

// Event listener para el boton de eliminacion de usuario
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
                
                // Limpiar formulario y actualizar listado de usuarios
                limpiarFormulario(formularioEditar)
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

// Configurar funcionalidad de mostrar/ocultar contraseña
mostrarContrasenaAlta()
mostrarContrasenaEditar()