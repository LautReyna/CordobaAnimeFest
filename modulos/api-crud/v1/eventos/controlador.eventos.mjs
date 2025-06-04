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
        const { id } = req.params
        const resultado = await modelo.obtenerEvento(id)
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
            nombre, 
            horaInicio, 
            horaFin, 
            estado, 
            ubicacion, 
            descripcion,
            imagen
        } = req.body
        if (!nombre || !horaInicio || !horaFin || !estado || !ubicacion || !descripcion || !imagen) {
            console.log("nombre: " + nombre)
            console.log("horaInicio: " + horaInicio)
            console.log("horaFin: " + horaFin)
            console.log("estado: " + estado)
            console.log("ubicacion: " + ubicacion)
            console.log("descripcion: " + descripcion)
            console.log("imagen: " + imagen)
            return res.status(400).json({ mensaje: 'Datos incompletos' })
        }
        const resultado = await modelo.crearEvento({
            nombre, 
            horaInicio, 
            horaFin, 
            estado, 
            ubicacion, 
            descripcion,
            imagen
        })
        const { nombre: nombreCreado } = resultado.rows[0]
        res.json({ mensaje: `Evento ${nombreCreado} dado de alta` })
    } catch (error) {
        console.log(error)
        res.status(500).json({ mensaje: 'Error en el servidor' })
    }
}

async function modificarEvento(req, res) {
    try {
        const { id } = req.params
        const {
            nombre, 
            horaInicio, 
            horaFin, 
            estado, 
            ubicacion, 
            descripcion,
            imagen
        } = req.body
        
        if (!nombre || !horaInicio || !horaFin || !estado || !ubicacion || !descripcion || !imagen) {
            return res.status(400).json({ mensaje: 'Datos incompletos' })
        }
        const resultado = await modelo.modificarEvento(id, {
            nombre, 
            horaInicio, 
            horaFin, 
            estado, 
            ubicacion, 
            descripcion,
            imagen
        })
        const { nombre: nombreModificado } = resultado.rows[0]
        res.json({ mensaje: `Evento ${nombreModificado} modificado` })
    } catch (error) {
        console.log(error)
        res.status(500).json({ mensaje: 'Error en el servidor' })
    }
}

async function eliminarEvento(req, res) {
    try {
        const { id } = req.params
        const resultado = await modelo.eliminarEvento(id)
        if (resultado.rows.length > 0) {
            const { nombre: nombreEliminado } = resultado.rows[0]
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
