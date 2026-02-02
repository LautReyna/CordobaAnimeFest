// Importa express para crear el router de eventos
// Importa todos los controladores de eventos
// Importa multer para manejo de archivos (subida de imágenes)
// Importa path para manejar extensiones de archivos
import express from 'express'
import * as controlador from './controlador.eventos.mjs'
import multer from 'multer'
import path from 'path'

// Configuración de almacenamiento para multer
const storage = multer.diskStorage({
    // Directorio donde se guardarán los archivos subidos
    destination: (req, file, cb) => {
        cb(null, 'recursos')
    },
    // Define el nombre único del archivo subido
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname)
        const uniqueName = `evento-${Date.now()}${ext}`
        cb(null, uniqueName)
    }
})

// Inicializa multer con la configuración de almacenamiento
const upload = multer({ storage })

// Crea el router de eventos
const rutasEventos = express.Router()
// Middleware para parsear el cuerpo de las peticiones como JSON
rutasEventos.use(express.json())

// Rutas para la API de eventos

// Obtiene todos los eventos de la CAF activa
rutasEventos.get('/api/v1/eventos/caf/activa', controlador.obtenerEventosCafActiva)
// Obtiene todos los eventos de una CAF específica
rutasEventos.get('/api/v1/eventos/caf/:idCaf', controlador.obtenerEventosCaf)
// Obtiene todos los eventos registrados
rutasEventos.get('/api/v1/eventos', controlador.obtenerEventos)
// Obtiene un evento específico por su ID
rutasEventos.get('/api/v1/eventos/:id', controlador.obtenerEvento)
// Crea un nuevo evento (requiere imagen)
rutasEventos.post('/api/v1/eventos', upload.single('imagen'), controlador.crearEvento)
// Modifica un evento existente (puede actualizar imagen)
rutasEventos.put('/api/v1/eventos/:id', upload.single('imagen'), controlador.modificarEvento)
// Cancela un evento específico por su ID
rutasEventos.put('/api/v1/eventos/cancelar/:id', controlador.cancelarEvento)
// Elimina un evento específico por su ID
rutasEventos.delete('/api/v1/eventos/:id', controlador.eliminarEvento)

// Exporta el router para ser usado en la aplicación principal
export default rutasEventos
