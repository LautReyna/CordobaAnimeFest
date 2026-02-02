// Importa el módulo express y los controladores de usuario
import express from 'express'
import * as controlador from './controlador.usuarios.mjs'

// Crea un router para las rutas de usuarios
const rutasUsuarios = express.Router()
// Habilita el middleware para parsear JSON en las peticiones
rutasUsuarios.use(express.json())

// Ruta para obtener todos los usuarios
rutasUsuarios.get('/api/v1/usuarios', controlador.obtenerUsuarios)
// Ruta para obtener un usuario específico por su ID
rutasUsuarios.get('/api/v1/usuarios/:id', controlador.obtenerUsuario)
// Ruta para crear un nuevo usuario
rutasUsuarios.post('/api/v1/usuarios', controlador.crearUsuario)
// Ruta para modificar un usuario existente por su ID
rutasUsuarios.put('/api/v1/usuarios/:id', controlador.modificarUsuario)
// Ruta para eliminar un usuario por su ID
rutasUsuarios.delete('/api/v1/usuarios/:id', controlador.eliminarUsuario)

// Exporta el router para ser usado en la aplicación principal
export default rutasUsuarios
