export function procesarFormulario(formulario) {
    const datosFormulario = new FormData(formulario)
    return Object.fromEntries(datosFormulario)
}

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

export async function obtenerRegistros(ruta) {
    try {
        return await fetch(ruta)
    } catch (error) {
        console.log(error)
        throw error
    }
}

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

export function mostrarMensaje(mensajes, texto, duracion = 3000){
    mensajes.innerHTML = texto
    setTimeout(()=>{
        mensajes.innerHTML = ''
    }, duracion)
}
