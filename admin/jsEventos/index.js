// Importaciones de utilidades y funciones
import { renderizarListadoEventos } from './funciones.js'
import { obtenerRegistros } from '../recursos/utilidades.js'
import { verificarCafActiva, cambiarComboBox, cargarComboBox, mostrarEventosSegunCaf, cargarComboBoxZonas } from '../jsAdmin/funciones.js'

// Verificar si hay una CAF activa
await verificarCafActiva()

// Obtener datos de todas las CAF y la CAF activa
const res = await obtenerRegistros('/api/v1/caf')
const datosCaf = await res.json()
const resCaf = await obtenerRegistros('/api/v1/caf/activa')
const cafActiva = await resCaf.json()

// Configurar el comboBox de CAF y zonas
cargarComboBox(datosCaf, cafActiva)
cambiarComboBox(datosCaf, mostrarEventosSegunCaf)
cargarComboBoxZonas('cb-ubicacion')

// Función para cargar los eventos de la CAF activa
async function cargandoEventos(){
    const respuesta = await obtenerRegistros('/api/v1/eventos/caf/activa')
    const datosEventos = await respuesta.json()
    renderizarListadoEventos(datosEventos, 'contenedor-eventos')
}

// Cargar eventos inicialmente
cargandoEventos()

// Configurar el Socket.io para actualizaciones en tiempo real
const socket = io()

// Event listener para actualizaciones de eventos
socket.on('eventos_actualizados', () => {
    console.log('Eventos cambarion, recargando lista...')
    cargandoEventos()
})