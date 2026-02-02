// Importa el módulo express y los controladores de zonas   
import express from 'express'
import * as controlador from './controlador.zonas.mjs'

// Crea un router para las rutas de zonas
const rutasZonas = express.Router()
// Habilita el middleware para parsear JSON en las peticiones
rutasZonas.use(express.json())

// Ruta para obtener todas las zonas
rutasZonas.get('/api/v1/zonas', controlador.obtenerZonas)
// Ruta para obtener una zona específica por su ID
rutasZonas.get('/api/v1/zonas/:id', controlador.obtenerZona)
// Ruta para obtener todas las zonas asociadas a una CAF específica
rutasZonas.get('/api/v1/zonas/caf/:idCaf', controlador.obtenerZonasCaf)
// Ruta para crear una nueva zona
rutasZonas.post('/api/v1/zonas', controlador.crearZona)
// Ruta para modificar una zona existente por su ID
rutasZonas.put('/api/v1/zonas/:id', controlador.modificarZona)
// Ruta para eliminar una zona por su ID
rutasZonas.delete('/api/v1/zonas/:id', controlador.eliminarZona)

// Exporta el router para ser usado en la aplicación principal
export default rutasZonas