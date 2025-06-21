import { renderizarListadoStands } from './funciones.js'
import { obtenerRegistros } from '../recursos/utilidades.js'
const respuesta = await obtenerRegistros('/api/v1/stands')
const datosStands = await respuesta.json()
renderizarListadoStands(datosStands)
