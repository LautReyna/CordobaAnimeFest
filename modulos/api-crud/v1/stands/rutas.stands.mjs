import express from 'express'
import * as controlador from './controlador.stands.mjs'

const rutasStands = express.Router()
rutasStands.use(express.json())

rutasStands.get('/api/v1/stands', controlador.obtenerStands)
rutasStands.get('/api/v1/stands/:id', controlador.obtenerStand)
rutasStands.post('/api/v1/stands', controlador.crearStand)
rutasStands.put('/api/v1/stands/:id', controlador.modificarStand)
rutasStands.delete('/api/v1/stands/:id', controlador.eliminarStand)

export default rutasStands
