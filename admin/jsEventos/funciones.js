import { mostrarMensaje } from "../recursos/utilidades.js"

export let idEvento = null

export async function renderizarFormularioPorNombre(datosEventos, formulario, mensajes){
    let nombreEvento = formulario.nombre
    
    nombreEvento.removeEventListener('input', nombreEvento._handler || (() => {}))

    const handler = () =>{
        const nombreBuscado = nombreEvento.value.trim().toLowerCase()
        const evento = datosEventos.find(e => e.nombre.toLowerCase() === nombreBuscado)
        if(evento){
            idEvento = evento.id
    
            formulario.nombre.value = evento.nombre
            formulario.descripcion.value = evento.descripcion
            formulario.ubicacion.value = evento.idzona
            formulario.horaInicio.value = evento.horainicio
            formulario.horaFin.value = evento.horafin
            // No establecemos el valor del campo de archivo por seguridad
            // El usuario puede subir una nueva imagen o mantener la actual
    
            mostrarMensaje(mensajes, `Se encontró un evento con este nombre: ${formulario.nombre.value}`, 'info')
        }else{
            idEvento = null
        }
    }

    nombreEvento._handler = handler
    nombreEvento.addEventListener('input', handler)
}

export async function renderizarListadoEventos(datosEventos, contenedorId) {
    try {
        const contenedorEventos = document.getElementById(contenedorId)
        let filas = ''

        if (!datosEventos || datosEventos.length === 0) {
            filas = `
                <tr>
                    <td colspan="6" class="text-center text-muted">
                        No hay eventos registrados
                    </td>
                </tr>
            `
        } else {
            const ordenEstados = {'En Curso': 1, 'Por Iniciar': 2, 'Pendiente': 3, 'Finalizado': 4}
            datosEventos.sort((a, b) => ordenEstados[a.estado] - ordenEstados[b.estado])

            datosEventos.forEach((evento) => {
                filas += `
                    <tr>
                        <td scope="col">${evento.nombre}</td>
                        <td scope="col">
                            <div class="descripcion">
                                <p>${evento.descripcion}</p>
                                <button class="boton">Mostrar más</button>
                            </div>
                        </td>
                        <td scope="col">${evento.nombrezona}</td>
                        <td scope="col">${evento.horainicio?.substring(0,5)}</td>
                        <td scope="col">${evento.horafin?.substring(0,5)}</td>
                        <td scope="col">${evento.estado}</td>
                    </tr>
                `
            })
        }

        contenedorEventos.innerHTML = filas

        document.querySelectorAll('.boton').forEach((boton) => {
            boton.addEventListener('click', (e) => {
                const contenedor = e.target.closest('.descripcion')
                contenedor.classList.toggle('expandida')
                e.target.textContent = contenedor.classList.contains('expandida')
                    ? 'Mostrar menos'
                    : 'Mostrar más'
            })
        })
    } catch (error) {
        console.log(error)
    }
}

