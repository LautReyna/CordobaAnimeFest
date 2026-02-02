// Importa las funciones necesarias
import { 
    procesarFormularioContacto, 
    enviarMensajeContacto, 
    mostrarMensaje, 
    limpiarFormulario 
} from './funciones.js'

// Función principal para inicializar el formulario de contacto
function inicializarFormularioContacto() {
    // Obtiene el formulario por su ID
    const formulario = document.getElementById('form-evento')
    // Crea un contenedor para mostrar mensajes al usuario
    const mensajesContainer = document.createElement('div')
    mensajesContainer.id = 'mensajes-contacto'
    
    // Inserta el contenedor de mensajes justo después del formulario
    formulario.parentNode.insertBefore(mensajesContainer, formulario.nextSibling)
    
    // Agrega un listener para el evento submit del formulario
    formulario.addEventListener('submit', async (e) => {
        e.preventDefault() // Previene el envío tradicional del formulario
        
        try {
            // Procesa los datos del formulario y los convierte en objeto
            const datos = procesarFormularioContacto(formulario)
            
            // Muestra un mensaje de información mientras se envía el mensaje
            mostrarMensaje(mensajesContainer, 'Enviando mensaje...', 'info')
            
            // Envía el mensaje al backend
            const resultado = await enviarMensajeContacto(datos)
            
            // Muestra mensaje de éxito con la respuesta del backend
            mostrarMensaje(mensajesContainer, resultado.mensaje, 'success')
            
            // Limpia el formulario después de enviar correctamente
            limpiarFormulario(formulario)
            
        } catch (error) {
            // Si ocurre un error, muestra el mensaje de error al usuario
            mostrarMensaje(mensajesContainer, error.message, 'error')
        }
    })
    
    // Busca el botón de cancelar dentro del formulario
    const botonCancelar = formulario.querySelector('.btn-danger')
    if (botonCancelar) {
        // Agrega un listener para limpiar el formulario y los mensajes al cancelar
        botonCancelar.addEventListener('click', (e) => {
            e.preventDefault()
            limpiarFormulario(formulario)
            mensajesContainer.innerHTML = ''
        })
    }
}

// Inicializa la lógica cuando el DOM está completamente cargado
document.addEventListener('DOMContentLoaded', inicializarFormularioContacto)
