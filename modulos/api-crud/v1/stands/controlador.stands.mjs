import * as modelo from './modelo.stands.mjs'

async function obtenerStands(req, res) {
    try {
        const resultado = await modelo.obtenerStands()
        if (resultado.rows.length > 0) {
            res.json(resultado.rows)
        } else {
            res.status(404).json({ mensaje: 'Stands no encontrados' })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ mensaje: 'Error en el servidor' })
    }
}

async function obtenerStand(req, res) {
    try {
        const { id } = req.params
        const resultado = await modelo.obtenerStand(id)
        if (resultado.rows.length > 0) {
            res.json(resultado.rows)
        } else {
            res.status(404).json({ mensaje: 'Stand no encontrado' })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ mensaje: 'Error en el servidor' })
    }
}

async function crearStand(req, res) {
    try {
        const {
            nombre, 
            descripcion,
            ubicacion, 
            estado
        } = req.body
        if (!nombre || !descripcion || !ubicacion || !estado) {
            return res.status(400).json({ mensaje: 'Datos incompletos' })
        }
        const resultado = await modelo.crearStand({
            nombre, 
            descripcion,
            ubicacion, 
            estado
        })
        const { nombre: nombreCreado } = resultado.rows[0]
        res.json({ mensaje: `Stand ${nombreCreado} dado de alta` })
    } catch (error) {
        console.log(error)
        res.status(500).json({ mensaje: 'Error en el servidor' })
    }
}

async function modificarStand(req, res) {
    try {
        const { id } = req.params
        const {
            nombre, 
            descripcion,
            ubicacion, 
            estado
        } = req.body
        
        if (!nombre || !descripcion || !ubicacion || !estado) {
            return res.status(400).json({ mensaje: 'Datos incompletos' })
        }
        const resultado = await modelo.modificarStand(id, {
            nombre, 
            descripcion,
            ubicacion, 
            estado
        })
        const { nombre: nombreModificado } = resultado.rows[0]
        res.json({ mensaje: `Stand ${nombreModificado} modificado` })
    } catch (error) {
        console.log(error)
        res.status(500).json({ mensaje: 'Error en el servidor' })
    }
}

async function eliminarStand(req, res) {
    try {
        const { id } = req.params
        const resultado = await modelo.eliminarStand(id)
        if (resultado.rows.length > 0) {
            const { nombre: nombreEliminado } = resultado.rows[0]
            res.status(200).json({ mensaje: `Stand: ${nombreEliminado} eliminado` })
        } else {
            res.status(404).json({ mensaje: 'Stand no encontrado' })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ mensaje: 'Error en el servidor' })
    }
}
export { obtenerStands, obtenerStand, crearStand, modificarStand, eliminarStand }
