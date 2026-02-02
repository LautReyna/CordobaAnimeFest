// importa el modulo express y los controladores de alertas
import express from 'express'
import { crearOActualizar, listar, eliminar } from './controlador.alertas.mjs'

// Crear router de Express para las rutas de alertas
const rutasAlertas = express.Router()

// Middleware para parsear automáticamente el cuerpo de las peticiones como JSON
rutasAlertas.use(express.json())

// DEFINICIÓN DE RUTAS

// Ruta para crear una nueva alerta o actualizar una existente
rutasAlertas.post('/api/v1/alertas', crearOActualizar)

// Ruta para listar todas las alertas de un usuario (por endpoint)
rutasAlertas.get('/api/v1/alertas', listar)

// Ruta para eliminar una alerta específica  por su id
rutasAlertas.delete('/api/v1/alertas/:id', eliminar)

export default rutasAlertas



