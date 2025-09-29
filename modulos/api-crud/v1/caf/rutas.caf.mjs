import express from 'express'
import * as controlador from './controlador.caf.mjs'

const rutasCaf = express.Router()
rutasCaf.use(express.json())

rutasCaf.get('/api/v1/caf', controlador.obtenerCafs)
rutasCaf.get('/api/v1/caf/activa', controlador.obtenerCafActiva)
rutasCaf.get('/api/v1/caf/:id', controlador.obtenerCaf)
rutasCaf.post('/api/v1/caf', controlador.crearCaf)
rutasCaf.put('/api/v1/caf/finalizar', controlador.finalizarCaf)
rutasCaf.put('/api/v1/caf/:id', controlador.modificarCaf)
rutasCaf.delete('/api/v1/caf/:id', controlador.eliminarCaf)

export default rutasCaf
