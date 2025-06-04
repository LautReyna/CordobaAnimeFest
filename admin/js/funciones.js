export let idEvento = null

export async function renderizarFormularioPorNombre(datosEventos, formulario){
    let nombreEvento = formulario.nombre
    
    nombreEvento.removeEventListener('input', nombreEvento._handler || (() => {}))

    const handler = () =>{
        const nombreBuscado = nombreEvento.value.trim().toLowerCase()
        const evento = datosEventos.find(e => e.nombre.toLowerCase() === nombreBuscado)
    
        if(evento){
            idEvento = evento.id
    
            formulario.nombre.value = evento.nombre
            formulario.descripcion.value = evento.descripcion
            formulario.ubicacion.value = evento.ubicacion
            formulario.estado.value = evento.estado
            formulario.horaInicio.value = evento.horainicio
            formulario.horaFin.value = evento.horafin
            formulario.imagen.value = evento.imagen
    
            mostrarMensaje(mensajes, `Se encontro un evento con este nombre: ${formulario.nombre.value}`)
        }else{
            idEvento = null
        }
    }

    nombreEvento._handler = handler
    nombreEvento.addEventListener('input', handler)
}


export async function limpiarFormularioEventos(formulario) {
    try {
        formulario.nombre.value = ""
        formulario.descripcion.value ="" 
        formulario.ubicacion.value = ""
        formulario.estado.value = 1
        formulario.imagen.value = ""
        formulario.horaInicio.value = ""
        formulario.horaFin.value = ""
    } catch (error) {
        console.log(error)
        throw error
    }
}

export async function renderizarListadoEventos(datosEventos) {
    try {
        const contenedorEventos = document.getElementById('contenedor-eventos')
        let filas = ''

        datosEventos.forEach((evento) => {
            filas += `
                <tr>
                    <td scope="col">${evento.nombre}</td>
                    <td scope="col">${evento.descripcion}</td>
                    <td scope="col">${evento.ubicacion}</td>
                    <td scope="col">${evento.horainicio?.substring(0,5)}</td>
                    <td scope="col">${evento.horafin?.substring(0,5)}</td>
                    <td scope="col">${evento.estado}</td>
                </tr>
            `
        })
        contenedorEventos.innerHTML = filas
    } catch (error) {
        console.log(error)
    }
}

export async function mostrarMensaje(mensajes, texto, duracion = 3000){
    mensajes.innerHTML = texto
    setTimeout(()=>{
        mensajes.innerHTML = ''
    }, duracion)
}