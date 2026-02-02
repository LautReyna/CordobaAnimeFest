// Importa el módulo express para crear el router 
// Importa todos los controladores relacionados con CAF
// Importa multer para manejo de archivos (uploads)
// Importa path para manejar extensiones de archivos
import express from 'express'
import * as controlador from './controlador.caf.mjs'
import multer from 'multer'
import path from 'path'

// Configuración de almacenamiento para multer
const storage = multer.diskStorage({
    // Directorio de destino para los archivos subidos
    destination: (req, file, cb) => {
        cb(null, 'recursos')
    },
    // Define el nombre único del archivo subido
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname)
        const uniqueName = `caf-${Date.now()}${ext}`
        cb(null, uniqueName)
    }
})

// Inicializa multer con la configuración de almacenamiento
const upload = multer({ storage })

// Crea el router de Express para las rutas de CAF
const rutasCaf = express.Router()
// Middleware para parsear automáticamente el cuerpo de las peticiones como JSON
rutasCaf.use(express.json())

// Ruta para obtener todas las ediciones de CAF
rutasCaf.get('/api/v1/caf', controlador.obtenerCafs)
// Ruta para obtener la CAF activa
rutasCaf.get('/api/v1/caf/activa', controlador.obtenerCafActiva)
// Ruta para obtener una CAF específica por su id
rutasCaf.get('/api/v1/caf/:id', controlador.obtenerCaf)
// Ruta para crear una nueva edición de CAF (con upload de archivo 'mapa')
rutasCaf.post('/api/v1/caf', upload.single('mapa'), controlador.crearCaf)
// Ruta para finalizar (desactivar) la CAF activa
rutasCaf.put('/api/v1/caf/finalizar', controlador.finalizarCaf)
// Ruta para modificar una CAF existente (con upload de archivo 'mapa')
rutasCaf.put('/api/v1/caf/:id', upload.single('mapa'), controlador.modificarCaf)
// Ruta para eliminar una CAF específica por su id
rutasCaf.delete('/api/v1/caf/:id', controlador.eliminarCaf)

// Exporta el router para ser usado en la aplicación principal
export default rutasCaf
