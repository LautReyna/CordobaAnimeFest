import express from 'express'
import { crearOActualizar, listar, eliminar } from './controlador.alertas.mjs'

const rutasAlertas = express.Router()
rutasAlertas.use(express.json())

rutasAlertas.post('/api/v1/alertas', crearOActualizar)
rutasAlertas.get('/api/v1/alertas', listar)
rutasAlertas.delete('/api/v1/alertas/:id', eliminar)

export default rutasAlertas



