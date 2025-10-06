import express from 'express'

import rutasEventosV1 from './api-crud/v1/eventos/rutas.eventos.mjs'
import rutasAlertasV1 from './api-crud/v1/alertas/rutas.alertas.mjs'
import rutasStandsV1 from './api-crud/v1/stands/rutas.stands.mjs'
import rutasUsuariosV1 from './api-crud/v1/usuarios/rutas.usuarios.mjs'
import rutasCafV1 from './api-crud/v1/caf/rutas.caf.mjs'
import rutasZonasV1 from './api-crud/v1/zonas/rutas.zonas.mjs'

const modulosApi = express.Router()

modulosApi.use(rutasEventosV1)
modulosApi.use(rutasAlertasV1)
modulosApi.use(rutasStandsV1)
modulosApi.use(rutasUsuariosV1)
modulosApi.use(rutasCafV1)
modulosApi.use(rutasZonasV1)

export default modulosApi