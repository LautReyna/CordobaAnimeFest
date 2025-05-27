import express from 'express'
import * as controlador from './controlador.alertas.mjs'

const rutasAlertas = express.Router()
rutasAlertas.use(express.json())

rutasAlertas.get('/api/v1/eventos', controlador.obtenerAlertas)
rutasAlertas.get('/api/v1/eventos/:id', controlador.obtenerAlerta)
rutasAlertas.post('/api/v1/eventos', controlador.crearAlerta)
rutasAlertas.put('/api/v1/eventos/:id', controlador.modificarAlerta)
rutasAlertas.delete('/api/v1/eventos/:id', controlador.eliminarAlerta)

export default rutasAlertas
