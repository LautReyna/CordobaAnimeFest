import * as modelo from './modelo.eventos.mjs'

async function obtenerEventos(req, res) {
    try {
        const resultado = await modelo.obtenerEventos()
        if (resultado.rows.length > 0) {
            res.json(resultado.rows)
        } else {
            res.status(404).json({ mensaje: 'Eventos no encontrados' })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ mensaje: 'Error en el servidor' })
    }
}

async function obtenerEvento(req, res) {
    try {
        const { idEvento } = req.params
        const resultado = await modelo.obtenerEvento(idEvento)
        if (resultado.rows.length > 0) {
            res.json(resultado.rows)
        } else {
            res.status(404).json({ mensaje: 'Evento no encontrado' })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ mensaje: 'Error en el servidor' })
    }
}

async function crearEvento(req, res) {
    try {
        const {
            nombreEvento, 
            horaInicio, 
            horaFin, 
            estado, 
            ubicacionEvento, 
            descripcionEvento,
            imagenEvento
        } = req.body
        if (!nombreEvento || !horaInicio || !horaFin || !estado || !ubicacionEvento || !descripcionEvento || !imagenEvento) {
            return res.status(400).json({ mensaje: 'Datos incompletos' })
        }
        const resultado = await modelo.crearEvento({
            nombreEvento, 
            horaInicio, 
            horaFin, 
            estado, 
            ubicacionEvento, 
            descripcionEvento,
            imagenEvento
        })
        const { nombreEvento: nombreCreado } = resultado.rows[0]
        res.json({ mensaje: `Evento ${nombreCreado} dado de alta` })
    } catch (error) {
        console.log(error)
        res.status(500).json({ mensaje: 'Error en el servidor' })
    }
}

async function modificarEvento(req, res) {
    try {
        const { idEvento } = req.params
        const {
            nombreEvento, 
            horaInicio, 
            horaFin, 
            estado, 
            ubicacionEvento, 
            descripcionEvento,
            imagenEvento
        } = req.body
        if (!nombreEvento || !horaInicio || !horaFin || !estado || !ubicacionEvento || !descripcionEvento || !imagenEvento) {
            return res.status(400).json({ mensaje: 'Datos incompletos' })
        }
        const resultado = await modelo.modificarEvento({
            nombreEvento, 
            horaInicio, 
            horaFin, 
            estado, 
            ubicacionEvento, 
            descripcionEvento,
            imagenEvento
        })
        const { nombreEvento: nombreModificado } = resultado.rows[0]
        res.json({ mensaje: `Evento ${nombreModificado} modificado` })
    } catch (error) {
        console.log(error)
        res.status(500).json({ mensaje: 'Error en el servidor' })
    }
}

async function eliminarEvento(req, res) {
    try {
        const { idEvento } = req.params
        const resultado = await modelo.eliminarEvento(idEvento)
        if (resultado.rows.length > 0) {
            const { nombreEvento: nombreEliminado } = resultado.rows[0]
            res.status(200).json({ mensaje: `Evento: ${nombreEliminado} eliminado` })
        } else {
            res.status(404).json({ mensaje: 'Evento no encontrado' })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ mensaje: 'Error en el servidor' })
    }
}
export { obtenerEventos, obtenerEvento, crearEvento, modificarEvento, eliminarEvento }
