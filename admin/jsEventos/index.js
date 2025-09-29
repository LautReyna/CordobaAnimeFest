import { renderizarListadoEventos } from './funciones.js'
import { obtenerRegistros } from '../recursos/utilidades.js'
import { verificarCafActiva, cambiarComboBox, cargarComboBox, mostrarEventosSegunCaf } from '../jsAdmin/funciones.js'

await verificarCafActiva()

const res = await obtenerRegistros('/api/v1/caf')
const datosCaf = await res.json()
const resCaf = await obtenerRegistros('/api/v1/caf/activa')
const cafActiva = await resCaf.json()

cargarComboBox(datosCaf, cafActiva)
cambiarComboBox(datosCaf, mostrarEventosSegunCaf)

async function cargandoEventos(){
    const respuesta = await obtenerRegistros('/api/v1/eventos/caf/activa')
    const datosEventos = await respuesta.json()
    renderizarListadoEventos(datosEventos, 'contenedor-eventos')
}

cargandoEventos()

const socket = io()

socket.on('eventos_actualizados', () => {
    console.log('Eventos cambarion, recargando lista...')
    cargandoEventos()
})