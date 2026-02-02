// Importaciones de utilidades y funciones
import { renderizarListadoUsuario } from './funciones.js'
import { obtenerRegistros } from '../recursos/utilidades.js'

// Cargar usuarios y renderizar listado inicial
const respuesta = await obtenerRegistros('/api/v1/usuarios')
const datosUsuarios = await respuesta.json()
renderizarListadoUsuario(datosUsuarios)
