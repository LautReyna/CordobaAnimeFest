// Función para procesar formulario de contacto
export function procesarFormularioContacto(formulario) {
    // Crea un objeto FormData a partir del formulario
    const datosFormulario = new FormData(formulario)
    // Convierte el FormData en un objeto simple y lo retorna
    return Object.fromEntries(datosFormulario)
}

// Función para enviar mensaje de contacto
export async function enviarMensajeContacto(datos) {
    try {
        // Realiza la petición fetch al endpoint '/contacto'
        const respuesta = await fetch('/contacto', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(datos), // Convierte los datos a JSON
        })
        
        // Espera la respuesta en formato JSON
        const resultado = await respuesta.json()
        
        // Si la respuesta no es exitosa, lanza un error con el mensaje recibido o uno por defecto
        if (!respuesta.ok) {
            throw new Error(resultado.mensaje || 'Error enviando mensaje')
        }
        
        // Retorna el resultado recibido del backend
        return resultado
    } catch (error) {
        console.error('Error enviando mensaje:', error)
        throw error
    }
}

// Función para mostrar mensaje al usuario
export function mostrarMensaje(elemento, mensaje, tipo = 'success') {
    if (!elemento) return // Si no hay elemento, no hace nada
    
    // Inserta el HTML del mensaje en el elemento
    elemento.innerHTML = `
        <div class="alert alert-${tipo === 'success' ? 'success' : 'danger'} alert-dismissible fade show" role="alert">
            ${mensaje}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `
    
    // Auto-ocultar después de 5 segundos
    setTimeout(() => {
        // Busca la alerta dentro del elemento
        const alert = elemento.querySelector('.alert')
        if (alert) {
            // Usa Bootstrap para cerrar la alerta con animación
            const bsAlert = new bootstrap.Alert(alert)
            bsAlert.close()
        }
    }, 5000)
}

// Función para limpiar formulario
export function limpiarFormulario(formulario) {
    if (formulario) {
        formulario.reset()
    }
}
