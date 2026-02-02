// Función para procesar el formulario sin archivo(convierte formData a objeto)
export function procesarFormulario(formulario) {
    const datosFormulario = new FormData(formulario)
    return Object.fromEntries(datosFormulario)
}

// Función para procesar el formulario con archivo(mantiene formData)
export function procesarFormularioConArchivo(formulario) {
    const datosFormulario = new FormData(formulario)
    return datosFormulario
}

// Función para dar de alta un registro
export async function altaRegistro(ruta, metodo, datos) {
    try {
        const respuesta = await fetch(ruta, {
            headers: {
                'Content-Type': 'application/json',
            },
            method: metodo,
            body: JSON.stringify(datos),
        })
        return respuesta
    } catch (error) {
        console.log(error)
        throw error
    }
}

// Función para dar de alta un registro con archivo
export async function altaRegistroConArchivo(ruta, metodo, formData) {
    try {
        const respuesta = await fetch(ruta, {
            method: metodo,
            body: formData,
        })
        return respuesta
    } catch (error) {
        console.log(error)
        throw error
    }
}

// Función para eliminar un registro
export async function eliminarRegistro(ruta) {
    try {
        const respuesta = await fetch(ruta, {
            method: 'DELETE',
        })
        return respuesta
    } catch (error) {
        console.log(error)
        throw error
    }
}

// Función para cancelar un registro
export async function cancelarRegistro(ruta) {
    try{
        const respuesta = await fetch(ruta, {
            method: 'PUT',
        })
        return respuesta
    } catch (error) {
        console.log(error)
        throw error
    }
}

// Función para obtener registros
export async function obtenerRegistros(ruta) {
    try {
        return await fetch(ruta)
    } catch (error) {
        console.log(error)
        throw error
    }
}

// Función para limpiar el formulario
export function limpiarFormulario(formulario){
    try {
      if(formulario){
        formulario.reset()
      }
    } catch (error) {
        console.log(error)
        throw error
    }
}

// Función para mostrar un mensaje
export function mostrarMensaje(mensajes, texto, tipo = 'info', duracion = 5000){
    // Configuracion de estilos para cada tipo de mensaje
    const alertConfig = {
        'success': {
            class: 'alert-success',
            icon: 'bi-check-circle-fill',
            title: '¡Éxito!'
        },
        'danger': {
            class: 'alert-danger',
            icon: 'bi-exclamation-triangle-fill',
            title: 'Error'
        },
        'warning': {
            class: 'alert-warning',
            icon: 'bi-exclamation-circle-fill',
            title: 'Advertencia'
        },
        'info': {
            class: 'alert-info',
            icon: 'bi-info-circle-fill',
            title: 'Información'
        }
    }
    
    // Obtener la configuracion del tipo de mensaje
    const config = alertConfig[tipo] || alertConfig['info']
    
    // Insertar el mensaje en el contenedor
    mensajes.innerHTML = `
        <div class="alert ${config.class} alert-dismissible fade show shadow-sm border-0" role="alert">
            <div class="d-flex align-items-center">
                <i class="bi ${config.icon} fs-4 me-3"></i>
                <div class="flex-grow-1">
                    <h6 class="alert-heading fw-bold mb-1">${config.title}</h6>
                    <p class="mb-0">${texto}</p>
                </div>
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Cerrar"></button>
            </div>
        </div>
    `
    
    // Auto-dismiss después del tiempo especificado
    setTimeout(() => {
        const alert = mensajes.querySelector('.alert')
        if (alert) {
            const bsAlert = new bootstrap.Alert(alert)
            bsAlert.close()
        }
    }, duracion)
}
