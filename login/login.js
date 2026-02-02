// Función para validar el formulario
function validarFormulario(datos) {
    const errores = []

    // Validar usuario
    if (!datos.nombre || datos.nombre.trim().length === 0) {
        errores.push('El usuario es requerido')
    } else if (datos.nombre.length < 3) {
        errores.push('El usuario debe tener al menos 3 caracteres')
    } else if (datos.nombre.length > 30) {
        errores.push('El usuario no puede tener más de 30 caracteres')
    } else if (!/^[a-zA-Z0-9_]+$/.test(datos.nombre)) {
        errores.push('El usuario solo puede contener letras, números y guiones bajos')
    }

    // Validar contraseña
    if (!datos.contrasena || datos.contrasena.length === 0) {
        errores.push('La contraseña es requerida')
    } else if (datos.contrasena.length < 6) {
        errores.push('La contraseña debe tener al menos 6 caracteres')
    } else if (datos.contrasena.length > 50) {
        errores.push('La contraseña no puede tener más de 50 caracteres')
    }

    // Validar caracteres especiales peligrosos (protección XSS)
    const caracteresPeligrosos = /[<>'"&]/
    if (caracteresPeligrosos.test(datos.nombre) || caracteresPeligrosos.test(datos.contrasena)) {
        errores.push('No se permiten caracteres especiales peligrosos')
    }

    return errores
}

// Función para mostrar errores
function mostrarErrores(errores) {
    const mensajes = document.getElementById('mensajes')
    if (errores.length > 0) {
        const erroresHtml = errores.map(error => `<li>${error}</li>`).join('')
        mensajes.innerHTML = `
            <div class="alert alert-danger w-100 text-start">
                <h6 class="alert-heading">
                    <i class="bi bi-exclamation-triangle me-2"></i>
                    Errores de validación:
                </h6>
                <ul class="mb-0">${erroresHtml}</ul>
            </div>
        `
        return false
    }
    return true
}

// Función para limpiar mensajes
function limpiarMensajes() {
    const mensajes = document.getElementById('mensajes')
    mensajes.innerHTML = ''
}

// Función para mostrar loading
function mostrarLoading() {
    const mensajes = document.getElementById('mensajes')
    mensajes.innerHTML = `
        <div class="alert alert-info w-100 text-center">
            <i class="bi bi-hourglass-split me-2"></i>
            Iniciando sesión...
        </div>
    `
}

function procesarFormulario(formulario) {
    const datosFormulario = new FormData(formulario)
    return Object.fromEntries(datosFormulario)
}

const formulario = document.getElementById('login-form')
const mensajes = document.getElementById('mensajes')

// Variables para control de intentos
const MAX_INTENTOS = 5
const TIEMPO_BLOQUEO = 5 * 60 * 1000 // 5 minutos en milisegundos
const STORAGE_KEY = 'caf_login_attempts'

// Función para obtener datos del localStorage
function obtenerDatosBloqueo() {
    try {
        const datos = localStorage.getItem(STORAGE_KEY)
        if (datos) {
            return JSON.parse(datos)
        }
    } catch (error) {
        console.error('Error al leer datos de bloqueo:', error)
    }
    return { intentosFallidos: 0, tiempoBloqueo: 0 }
}

// Función para guardar datos en localStorage
function guardarDatosBloqueo(intentosFallidos, tiempoBloqueo) {
    try {
        const datos = { intentosFallidos, tiempoBloqueo }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(datos))
    } catch (error) {
        console.error('Error al guardar datos de bloqueo:', error)
    }
}

// Función para limpiar datos de bloqueo
function limpiarDatosBloqueo() {
    try {
        localStorage.removeItem(STORAGE_KEY)
    } catch (error) {
        console.error('Error al limpiar datos de bloqueo:', error)
    }
}

// Función para verificar si está bloqueado
function estaBloqueado() {
    const datos = obtenerDatosBloqueo()
    const { intentosFallidos, tiempoBloqueo } = datos
    
    if (intentosFallidos >= MAX_INTENTOS) {
        const tiempoRestante = tiempoBloqueo - Date.now()
        if (tiempoRestante > 0) {
            return Math.ceil(tiempoRestante / 1000)
        } else {
            // Resetear bloqueo automáticamente
            limpiarDatosBloqueo()
            return false
        }
    }
    return false
}

// Función para mostrar bloqueo
function mostrarBloqueo(segundosRestantes) {
    const minutos = Math.floor(segundosRestantes / 60)
    const segundos = segundosRestantes % 60
    mensajes.innerHTML = `
        <div class="alert alert-warning w-100 text-center">
            <i class="bi bi-shield-exclamation me-2"></i>
            Demasiados intentos fallidos. Intenta nuevamente en ${minutos}:${segundos.toString().padStart(2, '0')}
        </div>
    `
}

// Función para validar en tiempo real
function validarEnTiempoReal(input) {
    const valor = input.value.trim()
    const campo = input.name
    
    // Remover clases de validación previas
    input.classList.remove('is-valid', 'is-invalid')
    
    if (valor.length === 0) return
    
    let esValido = true
    
    if (campo === 'nombre') {
        if (valor.length < 3 || valor.length > 30) {
            esValido = false
        } else if (!/^[a-zA-Z0-9_]+$/.test(valor)) {
            esValido = false
        }
    } else if (campo === 'contrasena') {
        if (valor.length < 6 || valor.length > 50) {
            esValido = false
        }
    }
    
    // Aplicar clases de validación
    if (esValido) {
        input.classList.add('is-valid')
    } else {
        input.classList.add('is-invalid')
    }
}

// Configurar validación en tiempo real
document.getElementById('nombre').addEventListener('input', (e) => {
    validarEnTiempoReal(e.target)
})

document.getElementById('contrasena').addEventListener('input', (e) => {
    validarEnTiempoReal(e.target)
})

// Verificar estado de bloqueo al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    const tiempoBloqueoRestante = estaBloqueado()
    if (tiempoBloqueoRestante) {
        mostrarBloqueo(tiempoBloqueoRestante)
        
        // Deshabilitar el formulario si está bloqueado
        const submitBtn = formulario.querySelector('button[type="submit"]')
        submitBtn.disabled = true
        
        // Crear un intervalo para actualizar el contador
        const intervalo = setInterval(() => {
            const tiempoRestante = estaBloqueado()
            if (tiempoRestante) {
                mostrarBloqueo(tiempoRestante)
            } else {
                // Desbloquear cuando expire el tiempo
                clearInterval(intervalo)
                submitBtn.disabled = false
                limpiarMensajes()
            }
        }, 1000)
    }
})

formulario.addEventListener('submit', async (e) => {
    e.preventDefault()
    
    // Verificar si está bloqueado
    const tiempoBloqueoRestante = estaBloqueado()
    if (tiempoBloqueoRestante) {
        mostrarBloqueo(tiempoBloqueoRestante)
        return
    }
    
    // Limpiar mensajes previos
    limpiarMensajes()
    
    try {
        const datos = procesarFormulario(formulario)
        
        // Validar formulario
        const errores = validarFormulario(datos)
        if (!mostrarErrores(errores)) {
            return
        }
        
        // Mostrar loading
        mostrarLoading()
        
        // Deshabilitar botón para evitar múltiples envíos
        const submitBtn = formulario.querySelector('button[type="submit"]')
        submitBtn.disabled = true
        submitBtn.innerHTML = '<i class="bi bi-hourglass-split me-2"></i>Iniciando sesión...'

        const respuesta = await fetch('/autenticacion', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datos)
        })

        if (respuesta.redirected) {
            // Login exitoso - limpiar datos de bloqueo
            limpiarDatosBloqueo()
            window.location.href = respuesta.url
        } else if (!respuesta.ok) {
            // Login fallido - incrementar contador
            const datosActuales = obtenerDatosBloqueo()
            const nuevosIntentos = datosActuales.intentosFallidos + 1
            const nuevoTiempoBloqueo = nuevosIntentos >= MAX_INTENTOS ? Date.now() + TIEMPO_BLOQUEO : datosActuales.tiempoBloqueo
            
            guardarDatosBloqueo(nuevosIntentos, nuevoTiempoBloqueo)
            
            const info = await respuesta.json()
            mensajes.innerHTML = `
                <div class="alert alert-danger w-100 text-center">
                    <i class="bi bi-x-circle me-2"></i>
                    ${info.mensaje || 'Error al iniciar sesión'}
                    ${nuevosIntentos >= 3 ? `<br><small>Intentos fallidos: ${nuevosIntentos}/${MAX_INTENTOS}</small>` : ''}
                </div>
            `
            
            // Si alcanzó el máximo de intentos, mostrar bloqueo
            if (nuevosIntentos >= MAX_INTENTOS) {
                mostrarBloqueo(TIEMPO_BLOQUEO / 1000)
            }
        }
    } catch (error) {
        console.error(error)
        // También contar errores de conexión
        const datosActuales = obtenerDatosBloqueo()
        const nuevosIntentos = datosActuales.intentosFallidos + 1
        const nuevoTiempoBloqueo = nuevosIntentos >= MAX_INTENTOS ? Date.now() + TIEMPO_BLOQUEO : datosActuales.tiempoBloqueo
        
        guardarDatosBloqueo(nuevosIntentos, nuevoTiempoBloqueo)
        
        mensajes.innerHTML = `
            <div class="alert alert-danger w-100 text-center">
                <i class="bi bi-wifi-off me-2"></i>
                Error de conexión. Verifica tu conexión a internet.
                ${nuevosIntentos >= 3 ? `<br><small>Intentos fallidos: ${nuevosIntentos}/${MAX_INTENTOS}</small>` : ''}
            </div>
        `
        
        // Si alcanzó el máximo de intentos, mostrar bloqueo
        if (nuevosIntentos >= MAX_INTENTOS) {
            mostrarBloqueo(TIEMPO_BLOQUEO / 1000)
        }
    } finally {
        // Rehabilitar botón
        const submitBtn = formulario.querySelector('button[type="submit"]')
        submitBtn.disabled = false
        submitBtn.innerHTML = '<i class="bi bi-box-arrow-in-right me-2"></i>Iniciar Sesión'
    }
})
