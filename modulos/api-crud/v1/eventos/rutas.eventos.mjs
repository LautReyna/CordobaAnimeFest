import express from 'express'
import * as controlador from './controlador.eventos.mjs'
import multer from 'multer'
import path from 'path'

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'recursos')
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname)
        const uniqueName = `evento-${Date.now()}${ext}`
        cb(null, uniqueName)
    }
})

const upload = multer({ storage })

const rutasEventos = express.Router()
rutasEventos.use(express.json())

rutasEventos.get('/api/v1/eventos/caf/activa', controlador.obtenerEventosCafActiva)
rutasEventos.get('/api/v1/eventos/caf/:idCaf', controlador.obtenerEventosCaf)
rutasEventos.get('/api/v1/eventos', controlador.obtenerEventos)
rutasEventos.get('/api/v1/eventos/:id', controlador.obtenerEvento)
rutasEventos.post('/api/v1/eventos', upload.single('imagen'), controlador.crearEvento)
rutasEventos.put('/api/v1/eventos/:id', upload.single('imagen'), controlador.modificarEvento)
rutasEventos.put('/api/v1/eventos/cancelar/:id', controlador.cancelarEvento)
rutasEventos.delete('/api/v1/eventos/:id', controlador.eliminarEvento)


export default rutasEventos
