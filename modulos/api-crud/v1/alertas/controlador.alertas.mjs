import * as modelo from './modelo.alertas.mjs'

async function obtenerAlertas(req, res) {
    try {
        const resultado = await modelo.obtenerAlertas();
        if (resultado.rows.length > 0) {
            res.json(resultado.rows)
        } else {
            res.status(404).json({ mensaje: 'Alertas no encontrados' })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ mensaje: 'Error en el servidor' })
    }
}

async function obtenerAlerta(req, res) {
    try {
        const { id } = req.params
        const resultado = await modelo.obtenerAlerta(id)
        if (resultado.rows.length > 0) {
            res.json(resultado.rows)
        } else {
            res.status(404).json({ mensaje: 'Alerta no encontrado' })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ mensaje: 'Error en el servidor' })
    }
}

async function crearAlerta(req, res) {
    try {
        const { hora } = req.body
        if (!hora) {
            return res.status(400).json({ mensaje: 'Datos incompletos' })
        }
        const resultado = await modelo.crearAlerta({
            hora
        })
        const { hora: horaCreado } = resultado.rows[0]
        res.json({ mensaje: `Alerta para la hora ${horaCreado} dado de alta` })
    } catch (error) {
        console.log(error)
        res.status(500).json({ mensaje: 'Error en el servidor' })
    }
}

async function modificarAlerta(req, res) {
    try {
        const { id } = req.params
        const { hora } = req.body
        if (!id || !hora) {
            return res.status(400).json({ mensaje: 'Datos incompletos' })
        }
        const resultado = await modelo.modificarAlerta({
            id,
            hora
        })
        const { hora: horaModificada } = resultado.rows[0]
        res.json({ mensaje: `Alerta a la hora ${horaModificada} modificado` })
    } catch (error) {
        console.log(error);
        res.status(500).json({ mensaje: 'Error en el servidor' })
    }
}

async function eliminarAlerta(req, res) {
    try {
        const { id } = req.params
        const resultado = await modelo.eliminarAlerta(id)
        if (resultado.rows.length > 0) {
            const { hora: horaEliminada } = resultado.rows[0]
            res.status(200).json({ mensaje: `Alerta para la hora: ${horaEliminada} eliminada` })
        } else {
            res.status(404).json({ mensaje: 'Alumno no encontrado' })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ mensaje: 'Error en el servidor' })
    }
}
export { obtenerAlerta, obtenerAlertas, crearAlerta, modificarAlerta, eliminarAlerta }
