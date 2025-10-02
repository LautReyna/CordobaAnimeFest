// Función para procesar formulario de contacto
export function procesarFormularioContacto(formulario) {
    const datosFormulario = new FormData(formulario)
    return Object.fromEntries(datosFormulario)
}

// Función para enviar mensaje de contacto
export async function enviarMensajeContacto(datos) {
    try {
        const respuesta = await fetch('/contacto', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(datos),
        })
        
        const resultado = await respuesta.json()
        
        if (!respuesta.ok) {
            throw new Error(resultado.mensaje || 'Error enviando mensaje')
        }
        
        return resultado
    } catch (error) {
        console.error('Error enviando mensaje:', error)
        throw error
    }
}

// Función para mostrar mensaje al usuario
export function mostrarMensaje(elemento, mensaje, tipo = 'success') {
    if (!elemento) return
    
    elemento.innerHTML = `
        <div class="alert alert-${tipo === 'success' ? 'success' : 'danger'} alert-dismissible fade show" role="alert">
            ${mensaje}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `
    
    // Auto-ocultar después de 5 segundos
    setTimeout(() => {
        const alert = elemento.querySelector('.alert')
        if (alert) {
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
