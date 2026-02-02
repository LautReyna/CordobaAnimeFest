// Importa express para crear un router modular
import express from 'express'

// Importa las rutas de los diferentes módulos de la API versión 1
import rutasEventosV1 from './api-crud/v1/eventos/rutas.eventos.mjs'      // Rutas para eventos
import rutasAlertasV1 from './api-crud/v1/alertas/rutas.alertas.mjs'      // Rutas para alertas
import rutasStandsV1 from './api-crud/v1/stands/rutas.stands.mjs'         // Rutas para stands
import rutasUsuariosV1 from './api-crud/v1/usuarios/rutas.usuarios.mjs'   // Rutas para usuarios
import rutasCafV1 from './api-crud/v1/caf/rutas.caf.mjs'                  // Rutas para caf
import rutasZonasV1 from './api-crud/v1/zonas/rutas.zonas.mjs'            // Rutas para zonas

// Crea un router principal para agrupar los módulos de la API
const modulosApi = express.Router()

// Usa cada conjunto de rutas importadas en el router principal
modulosApi.use(rutasEventosV1)
modulosApi.use(rutasAlertasV1)
modulosApi.use(rutasStandsV1)
modulosApi.use(rutasUsuariosV1)
modulosApi.use(rutasCafV1)
modulosApi.use(rutasZonasV1)

// Exporta el router principal para ser usado en la aplicación principal
export default modulosApi