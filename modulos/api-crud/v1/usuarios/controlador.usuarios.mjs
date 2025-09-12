import * as modelo from './modelo.usuarios.mjs'

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
        console.log(error)
        res.status(500).json({ mensaje: 'Error en el servidor' })
    }
}

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
        const { nombre: nombreCreado } = resultado.rows[0]
        res.json({ mensaje: `Usuario ${nombreCreado} dado de alta` })
    } catch (error) {
        console.log(error)
        res.status(500).json({ mensaje: 'Error en el servidor' })
    }
}

async function modificarUsuario(req, res) {
    try {
        const { id } = req.params
        const {
            nombre, 
            contrasena,
            categoria
        } = req.body
        
        if (!nombre || !contrasena || !categoria) {
            return res.status(400).json({ mensaje: 'Datos incompletos' })
        }
        const resultado = await modelo.modificarUsuario(id, {
            nombre, 
            contrasena,
            categoria
        })
        const { nombre: nombreModificado } = resultado.rows[0]
        res.json({ mensaje: `Usuario ${nombreModificado} modificado` })
    } catch (error) {
        console.log(error)
        res.status(500).json({ mensaje: 'Error en el servidor' })
    }
}

async function eliminarUsuario(req, res) {
    try {
        const { id } = req.params
        const resultado = await modelo.eliminarUsuario(id)
        if (resultado.rows.length > 0) {
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
export { obtenerUsuarios, obtenerUsuario, crearUsuario, modificarUsuario, eliminarUsuario }
