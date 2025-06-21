import express from 'express'

import rutasEventosV1 from './api-crud/v1/eventos/rutas.eventos.mjs'
import rutasAlertasV1 from './api-crud/v1/alertas/rutas.alertas.mjs'
import rutasStandsV1 from './api-crud/v1/stands/rutas.stands.mjs'

const modulosApi = express.Router()

modulosApi.use(rutasEventosV1)
modulosApi.use(rutasAlertasV1)
modulosApi.use(rutasStandsV1)

export default modulosApi