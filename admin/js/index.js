import { renderizarListadoEventos } from './funciones.js'
import { obtenerRegistros } from '../recursos/utilidades.js'
const respuesta = await obtenerRegistros('/api/v1/eventos')
renderizarListadoEventos(respuesta)
