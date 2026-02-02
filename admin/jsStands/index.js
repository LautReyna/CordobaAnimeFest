// Importaciones de utilidades y funciones
import { renderizarListadoStands } from './funciones.js'
import { obtenerRegistros } from '../recursos/utilidades.js'
import { verificarCafActiva, cambiarComboBox, cargarComboBox, mostrarStandsSegunCaf, cargarComboBoxZonas } from '../jsAdmin/funciones.js'

// Verificar si hay una CAF activa
await verificarCafActiva()

// Obtener datos de todas las CAF y la CAF activa
const res = await obtenerRegistros('/api/v1/caf')
const datosCaf = await res.json()
const resCaf = await obtenerRegistros('/api/v1/caf/activa')
const cafActiva = await resCaf.json()

// Configurar el comboBox de CAF y zonas
cargarComboBox(datosCaf, cafActiva)
cambiarComboBox(datosCaf, mostrarStandsSegunCaf)
cargarComboBoxZonas('cb-ubicacion')

// Cargar stands inicialmente
const respuesta = await obtenerRegistros('/api/v1/stands/caf/activa')
const datosStands = await respuesta.json()
renderizarListadoStands(datosStands, 'contenedor-stands')