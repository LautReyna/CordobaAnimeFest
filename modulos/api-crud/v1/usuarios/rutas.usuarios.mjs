import express from 'express'
import * as controlador from './controlador.usuarios.mjs'

const rutasUsuarios = express.Router()
rutasUsuarios.use(express.json())

rutasUsuarios.get('/api/v1/usuarios', controlador.obtenerUsuarios)
rutasUsuarios.get('/api/v1/usuarios/:id', controlador.obtenerUsuario)
rutasUsuarios.post('/api/v1/usuarios', controlador.crearUsuario)
rutasUsuarios.put('/api/v1/usuarios/:id', controlador.modificarUsuario)
rutasUsuarios.delete('/api/v1/usuarios/:id', controlador.eliminarUsuario)

export default rutasUsuarios
