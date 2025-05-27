import express from 'express'
import * as controlador from './controlador.eventos.mjs'

const rutasEventos = express.Router()
rutasEventos.use(express.json())

rutasEventos.get('/api/v1/eventos', controlador.obtenerEventos)
rutasEventos.get('/api/v1/eventos/:id', controlador.obtenerEvento)
rutasEventos.post('/api/v1/eventos', controlador.crearEvento)
rutasEventos.put('/api/v1/eventos/:id', controlador.modificarEvento)
rutasEventos.delete('/api/v1/eventos/:id', controlador.eliminarEvento)

export default rutasEventos
