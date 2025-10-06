import * as modelo from './modelo.eventos.mjs'
import pool from '../../../../conexion/conexion.bd.mjs'

async function obtenerEventosCaf(req, res){
    try {
        const { idCaf } = req.params
        const resultado = await modelo.obtenerEventosCaf(idCaf)
        res.json(resultado.rows)
    } catch (error) {
        console.log(error)
        res.status(500).json({ mensaje: 'Error en el servidor' })
    }
}

async function obtenerEventosCafActiva(req, res){
    try{
        const resultado = await modelo.obtenerEventosCafActiva()
        res.json(resultado.rows)
    }catch(error){
        console.log(error)
        res.status(500).json({ mensaje: 'Error en el servidor' })
    }
}

async function obtenerEventos(req, res) {
    try {
        const resultado = await modelo.obtenerEventos()
        res.json(resultado.rows)
    } catch (error) {
        console.log(error)
        res.status(500).json({ mensaje: 'Error en el servidor' })
    }
}

async function obtenerEvento(req, res) {
    try {
        const { id } = req.params
        const resultado = await modelo.obtenerEvento(id)
        res.json(resultado.rows)
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
            ubicacion, 
            descripcion
        } = req.body

        const fileName = req.file? req.file.filename : null
        
        console.log('Archivo recibido:', fileName)
        
        if (!nombre || !horaInicio || !horaFin || !ubicacion || !descripcion || !fileName) {
            return res.status(400).json({ mensaje: 'Datos incompletos' })
        }

        const resultadoCaf = await pool.query('SELECT id FROM caf WHERE activa = true')

        if(resultadoCaf.rows.length === 0){
            return res.status(400).json({mensaje: 'No hay caf activa'})
        }

        const idCaf = resultadoCaf.rows[0].id

        const resultado = await modelo.crearEvento({
            nombre, 
            horaInicio, 
            horaFin,
            ubicacion, 
            descripcion,
            imagen: fileName
        })
        const eventoCreado = resultado.rows[0]
        await modelo.vincularEventoCaf(eventoCreado.id, idCaf)
        res.json({ mensaje: `Evento ${eventoCreado.nombre} dado de alta` })
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
            ubicacion, 
            descripcion
        } = req.body

        const fileName = req.file? req.file.filename : null
        
        console.log('Archivo recibido para modificación:', fileName)
        
        if (!nombre || !horaInicio || !horaFin || !ubicacion || !descripcion) {
            return res.status(400).json({ mensaje: 'Datos incompletos' })
        }

        // Si no hay archivo nuevo, mantener el existente
        let imagenPath = null
        if (fileName) {
            imagenPath = fileName
        } else {
            // Obtener la imagen actual del evento
            const eventoActual = await modelo.obtenerEvento(id)
            if (eventoActual.rows.length > 0) {
                imagenPath = eventoActual.rows[0].imagen
            }
        }

        if (!imagenPath) {
            return res.status(400).json({ mensaje: 'Imagen requerida' })
        }

        const resultado = await modelo.modificarEvento(id, {
            nombre, 
            horaInicio, 
            horaFin,
            ubicacion, 
            descripcion,
            imagen: imagenPath
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

async function cancelarEvento(req, res){
    try{
        const { id } = req.params
        const resultado = await modelo.cancelarEvento(id)
        if(resultado.rows.length > 0){
            const { nombre: nombreCancelado } = resultado.rows[0]
            res.status(200).json({mensaje: `Evento ${nombreCancelado} cancelado`})
        }else{
            res.status(404).json({ mensaje: 'Evento no encontrado '})
        }
    }catch(error){
        console.log(error)
        res.status(500).json({ mensaje: 'Error en el servidor' })
    }
}

export { obtenerEventosCaf, obtenerEventosCafActiva, obtenerEventos, obtenerEvento, crearEvento, modificarEvento, eliminarEvento, cancelarEvento }
