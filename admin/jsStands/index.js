import { renderizarListadoStands } from './funciones.js'
import { obtenerRegistros } from '../recursos/utilidades.js'
import { verificarCafActiva, cambiarComboBox, cargarComboBox, mostrarStandsSegunCaf } from '../jsAdmin/funciones.js'

await verificarCafActiva()

const res = await obtenerRegistros('/api/v1/caf')
const datosCaf = await res.json()
const resCaf = await obtenerRegistros('/api/v1/caf/activa')
const cafActiva = await resCaf.json()

cargarComboBox(datosCaf, cafActiva)
cambiarComboBox(datosCaf, mostrarStandsSegunCaf)

const respuesta = await obtenerRegistros('/api/v1/stands/caf/activa')
const datosStands = await respuesta.json()
renderizarListadoStands(datosStands, 'contenedor-stands')