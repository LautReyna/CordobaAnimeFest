export let idStand = null

export async function renderizarFormularioPorNombre(datosStands, formulario){
    let nombreStand = formulario.nombre
    
    nombreStand.removeEventListener('input', nombreStand._handler || (() => {}))

    const handler = () =>{
        const nombreBuscado = nombreStand.value.trim().toLowerCase()
        const stand = datosStands.find(e => e.nombre.toLowerCase() === nombreBuscado)
    
        if(stand){
            idStand = stand.id
    
            formulario.nombre.value = stand.nombre
            formulario.descripcion.value = stand.descripcion
            formulario.ubicacion.value = stand.ubicacion
    
            mostrarMensaje(mensajes, `Se encontro un stand con este nombre: ${formulario.nombre.value}`)
        }else{
            idStand = null
        }
    }

    nombreStand._handler = handler
    nombreStand.addEventListener('input', handler)
}


export async function limpiarFormularioStands(formulario) {
    try {
        formulario.nombre.value = ""
        formulario.descripcion.value ="" 
        formulario.ubicacion.value = ""
    } catch (error) {
        console.log(error)
        throw error
    }
}

export async function renderizarListadoStands(datosStands) {
    try {
        const contenedorStands = document.getElementById('contenedor-stands')
        let filas = ''

        datosStands.forEach((stand) => {
            filas += `
                <tr>
                    <td scope="col">${stand.nombre}</td>
                    <td scope="col">
                        <div class="descripcion">
                            <p>${stand.descripcion}</p>
                            <button class="boton">Mostrar más</button>
                        </div>
                    </td>
                    <td scope="col">${stand.ubicacion}</td>
                </tr>
            `
        })
        contenedorStands.innerHTML = filas
        document.querySelectorAll('.boton').forEach((boton) => {
            boton.addEventListener('click',(e) => {
                const contenedor = e.target.closest('.descripcion')
                contenedor.classList.toggle('expandida')
                e.target.textContent = contenedor.classList.contains('expandida') ? 'Mostrar menos' : 'Mostrar más'
            })
        })
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