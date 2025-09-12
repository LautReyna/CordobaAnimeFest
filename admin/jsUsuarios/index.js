import { renderizarListadoUsuario } from './funciones.js'
import { obtenerRegistros } from '../recursos/utilidades.js'
const respuesta = await obtenerRegistros('/api/v1/usuarios')
const datosUsuarios = await respuesta.json()
renderizarListadoUsuario(datosUsuarios)
