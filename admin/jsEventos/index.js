import { renderizarListadoEventos } from './funciones.js'
import { obtenerRegistros } from '../recursos/utilidades.js'
const respuesta = await obtenerRegistros('/api/v1/eventos')
const datosEventos = await respuesta.json()
renderizarListadoEventos(datosEventos)
