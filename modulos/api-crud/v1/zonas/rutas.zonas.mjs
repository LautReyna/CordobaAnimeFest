import express from 'express'
import * as controlador from './controlador.zonas.mjs'

const rutasZonas = express.Router()
rutasZonas.use(express.json())

rutasZonas.get('/api/v1/zonas', controlador.obtenerZonas)
rutasZonas.get('/api/v1/zonas/:id', controlador.obtenerZona)
rutasZonas.get('/api/v1/zonas/caf/:idCaf', controlador.obtenerZonasCaf)
rutasZonas.post('/api/v1/zonas', controlador.crearZona)
rutasZonas.put('/api/v1/zonas/:id', controlador.modificarZona)
rutasZonas.delete('/api/v1/zonas/:id', controlador.eliminarZona)

export default rutasZonas