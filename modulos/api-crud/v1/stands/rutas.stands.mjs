// Importa express y los controladores de stands
import express from 'express'
import * as controlador from './controlador.stands.mjs'

// Crea el router de stands
const rutasStands = express.Router()
// Middleware para parsear el cuerpo de las peticiones como JSON
rutasStands.use(express.json())

// Rutas para la API de stands

// Obtiene estadísticas de visitas por stand (CAF activa) - debe ir antes de /:id
rutasStands.get('/api/v1/estadisticas/stands', controlador.obtenerEstadisticasStands)
// Obtiene todos los stands de la CAF activa
rutasStands.get('/api/v1/stands/caf/activa', controlador.obtenerStandsCafActiva)
// Obtiene todos los stands de una CAF específica
rutasStands.get('/api/v1/stands/caf/:idCaf', controlador.obtenerStandsCaf)
// Obtiene todos los stands registrados
rutasStands.get('/api/v1/stands', controlador.obtenerStands)
// Obtiene un stand específico por su ID
rutasStands.get('/api/v1/stands/:id', controlador.obtenerStand)
// Crea un nuevo stand
rutasStands.post('/api/v1/stands', controlador.crearStand)
// Modifica un stand existente
rutasStands.put('/api/v1/stands/:id', controlador.modificarStand)
// Incrementa visitas cuando el usuario hace clic en el link del stand
rutasStands.post('/api/v1/stands/:id/visita', controlador.incrementarVisitaStand)
// Elimina un stand específico por su ID
rutasStands.delete('/api/v1/stands/:id', controlador.eliminarStand)

// Exporta el router para ser usado en la aplicación principal
export default rutasStands
