import express from 'express'
import * as controlador from './controlador.caf.mjs'
import multer from 'multer'
import path from 'path'

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'recursos')
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname)
        const uniqueName = `caf-${Date.now()}${ext}`
        cb(null, uniqueName)
    }
})

const upload = multer({ storage })

const rutasCaf = express.Router()
rutasCaf.use(express.json())

rutasCaf.get('/api/v1/caf', controlador.obtenerCafs)
rutasCaf.get('/api/v1/caf/activa', controlador.obtenerCafActiva)
rutasCaf.get('/api/v1/caf/:id', controlador.obtenerCaf)
rutasCaf.post('/api/v1/caf', upload.single('mapa'), controlador.crearCaf)
rutasCaf.put('/api/v1/caf/finalizar', controlador.finalizarCaf)
rutasCaf.put('/api/v1/caf/:id', upload.single('mapa'), controlador.modificarCaf)
rutasCaf.delete('/api/v1/caf/:id', controlador.eliminarCaf)

export default rutasCaf
