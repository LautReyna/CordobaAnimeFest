import { 
    procesarFormularioContacto, 
    enviarMensajeContacto, 
    mostrarMensaje, 
    limpiarFormulario 
} from './funciones.js'

// Función para inicializar el formulario de contacto
function inicializarFormularioContacto() {
    const formulario = document.getElementById('form-evento')
    const mensajesContainer = document.createElement('div')
    mensajesContainer.id = 'mensajes-contacto'
    
    // Insertar contenedor de mensajes después del formulario
    formulario.parentNode.insertBefore(mensajesContainer, formulario.nextSibling)
    
    // Event listener para el formulario
    formulario.addEventListener('submit', async (e) => {
        e.preventDefault()
        
        try {
            // Procesar datos del formulario
            const datos = procesarFormularioContacto(formulario)
            
            // Mostrar mensaje de carga
            mostrarMensaje(mensajesContainer, 'Enviando mensaje...', 'info')
            
            // Enviar mensaje
            const resultado = await enviarMensajeContacto(datos)
            
            // Mostrar mensaje de éxito
            mostrarMensaje(mensajesContainer, resultado.mensaje, 'success')
            
            // Limpiar formulario
            limpiarFormulario(formulario)
            
        } catch (error) {
            // Mostrar mensaje de error
            mostrarMensaje(mensajesContainer, error.message, 'error')
        }
    })
    
    // Event listener para botón cancelar
    const botonCancelar = formulario.querySelector('.btn-danger')
    if (botonCancelar) {
        botonCancelar.addEventListener('click', (e) => {
            e.preventDefault()
            limpiarFormulario(formulario)
            mensajesContainer.innerHTML = ''
        })
    }
}

// Inicializar cuando se carga la página
document.addEventListener('DOMContentLoaded', inicializarFormularioContacto)
