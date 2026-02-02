// Importa todas las funciones del modelo de usuarios
import * as modelo from './modelo.usuarios.mjs'

// Obtiene todos los usuarios registrados en la base de datos
async function obtenerUsuarios(req, res) {
    try {
        const resultado = await modelo.obtenerUsuarios()
        if (resultado.rows.length > 0) {
            res.json(resultado.rows)
        } else {
            res.status(404).json({ mensaje: 'Usuarios no encontrados' })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ mensaje: 'Error en el servidor' })
    }
}

// Obtiene un usuario específico por su ID
async function obtenerUsuario(req, res) {
    try {
        const { id } = req.params
        const resultado = await modelo.obtenerUsuario(id)
        if (resultado.rows.length > 0) {
            res.json(resultado.rows)
        } else {
            res.status(404).json({ mensaje: 'Usuario no encontrado' })
        }
    } catch (error) {
        // Manejo de errores del servidor
        console.log(error)
        res.status(500).json({ mensaje: 'Error en el servidor' })
    }
}

// Crea un nuevo usuario en la base de datos
async function crearUsuario(req, res) {
    try {
        const {
            nombre, 
            contrasena,
            categoria
        } = req.body
        
        if (!nombre || !contrasena || !categoria) {
            return res.status(400).json({ mensaje: 'Datos incompletos' })
        }
        
        const resultado = await modelo.crearUsuario({
            nombre, 
            contrasena,
            categoria
        })
        // Obtiene el nombre del usuario creado para el mensaje de respuesta
        const { nombre: nombreCreado } = resultado.rows[0]
        res.json({ mensaje: `Usuario ${nombreCreado} dado de alta` })
    } catch (error) {
        console.log(error)
        res.status(500).json({ mensaje: 'Error en el servidor' })
    }
}

// Modifica un usuario existente en la base de datos
async function modificarUsuario(req, res) {
    try {
        const { id } = req.params
        const {
            nombre, 
            contrasena,
            categoria
        } = req.body
        
        if (!nombre || !categoria) {
            return res.status(400).json({ mensaje: 'Datos incompletos' })
        }
        
        const resultado = await modelo.modificarUsuario(id, {
            nombre, 
            contrasena,
            categoria
        })
        // Obtiene el nombre del usuario modificado para el mensaje de respuesta
        const { nombre: nombreModificado } = resultado.rows[0]
        res.json({ mensaje: `Usuario ${nombreModificado} modificado` })
    } catch (error) {
        console.log(error)
        res.status(500).json({ mensaje: 'Error en el servidor' })
    }
}

// Elimina un usuario específico por su ID
async function eliminarUsuario(req, res) {
    try {
        const { id } = req.params
        const resultado = await modelo.eliminarUsuario(id)
        if (resultado.rows.length > 0) {
            // Si se eliminó, retorna el nombre del usuario eliminado
            const { nombre: nombreEliminado } = resultado.rows[0]
            res.status(200).json({ mensaje: `Usuario: ${nombreEliminado} eliminado` })
        } else {
            res.status(404).json({ mensaje: 'Usuario no encontrado' })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ mensaje: 'Error en el servidor' })
    }
}

// Exporta todas las funciones del controlador
export { obtenerUsuarios, obtenerUsuario, crearUsuario, modificarUsuario, eliminarUsuario }
