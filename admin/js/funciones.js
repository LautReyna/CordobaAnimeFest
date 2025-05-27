export async function renderizarFormularioEventos(registros, formulario) {
    try {
        const datos = await registros.json()
        if (registros.ok) {
            
            formulario.nombre.value = datos[0].nombre
            formulario.descripcion.value = datos[0].descripcion
            formulario.stand.value = datos[0].stand
            formulario.estado.value = datos[0].estado
            formulario.imagen.value = datos[0].imagen
            formulario.horaInicio.value = datos[0].horaInicio
            formulario.horaFin.value = datos[0].horaFin
        } else {
            console.log('Evento no encontrado')
        }
    } catch (error) {
        console.log(error)
        throw error
    }
}
export async function renderizarListadoEventos(respuesta) {
    try {
        const datosEventos = await respuesta.json()
        if (respuesta.ok) {
            const contenedorEventos =
                document.getElementById('contenedor-eventos')
            let filas = ''
            datosEventos.forEach((evento) => {
                filas += `
                    <tr>
                        <td>${evento.nombre}</td>
                        <td>${evento.descripcion}</td>
                        <td>${evento.stand}</td>
                        <td>${evento.horaInicio}</td>
                        <td>${evento.horaFin}</td>
                        <td>${evento.estado}</td>
                        <td><a href="./editar.html?id=${evento.id}">Editar</a></td>
                    </tr>
                `
            })
            contenedorEventos.innerHTML = filas
        } else {
            console.log(datosEventos.mensaje)
        }
    } catch (error) {
        console.log(error)
    }
}
