import { mostrarMensaje } from "../recursos/utilidades.js"

export let idStand = null

export async function renderizarFormularioPorNombre(datosStands, formulario, mensajes){
    let nombreStand = formulario.nombre
    
    nombreStand.removeEventListener('input', nombreStand._handler || (() => {}))

    const handler = () =>{
        const nombreBuscado = nombreStand.value.trim().toLowerCase()
        const stand = datosStands.find(e => e.nombre.toLowerCase() === nombreBuscado)
    
        if(stand){
            idStand = stand.idstand
    
            formulario.nombre.value = stand.nombre
            formulario.descripcion.value = stand.descripcion
            formulario.ubicacion.value = stand.idzona
    
            mostrarMensaje(mensajes, `Se encontro un stand con este nombre: ${formulario.nombre.value}`)
        }else{
            idStand = null
        }
    }

    nombreStand._handler = handler
    nombreStand.addEventListener('input', handler)
}

export async function renderizarListadoStands(datosStands, contenedorId) {
    try {
        const contenedorStands = document.getElementById(contenedorId)
        let filas = ''

        
        if (!datosStands || datosStands.length === 0) {
            filas = `
                <tr>
                    <td colspan="6" class="text-center text-muted">
                        No hay stands registrados
                    </td>
                </tr>
            `
        } else {
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
                        <td scope="col">${stand.nombrezona}</td>
                    </tr>
                `
            })
        }

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
