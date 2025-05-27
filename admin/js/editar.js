import {
    renderizarFormularioEventos
} from './funciones.js'
import {
    procesarFormulario,
    obtenerParametroId,
    altaRegistro,
    obtenerRegistros,
    eliminarRegistro,
} from '../../../recursos/js/utilidades.js'

const id = obtenerParametroId()
const formulario = document.getElementById('form-evento')
const botonEliminar = document.getElementById('eliminar-evento')
const mensajes = document.getElementById('mensajes')

botonEliminar.addEventListener('click', async (evento) => {
    evento.preventDefault()
    if (confirm('Eliminar evento?')) {

        const respuesta = await eliminarRegistro(
            '/api/v1/eventos/' + id
        )
        
        const { mensaje } = await respuesta.json()
        if (respuesta.ok) {
            formulario.style.display = 'none'
        } else {
            console.log(mensaje)
        }
        mensajes.innerHTML = mensaje
        setTimeout(() => {
            location.href = './'
        }, 2000)
    } else {
        return false
    }
})

formulario.addEventListener('submit', async (evento) => {
    evento.preventDefault()
    
    const datosFormulario = procesarFormulario(formulario)
    
    const respuesta = await altaRegistro(
        '/api/v1/eventos/' + id,
        'PUT',
        datosFormulario
    )
    
    const { mensaje } = await respuesta.json()
    mensajes.innerHTML = mensaje
})

const resultado = await obtenerRegistros('/api/v1/eventos/' + id)
renderizarFormularioEventos(resultado, formulario)
