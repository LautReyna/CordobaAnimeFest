import * as modelo from './modelo.caf.mjs'

async function obtenerCafs(req, res) {
    try {
        const resultado = await modelo.obtenerCafs()
        if (resultado.rows.length > 0) {
            res.json(resultado.rows)
        } else {
            res.status(404).json({ mensaje: 'Cafs no encontradas' })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ mensaje: 'Error en el servidor' })
    }
}

async function obtenerCaf(req, res) {
    try {
        const { id } = req.params
        const resultado = await modelo.obtenerCaf(id)
        if (resultado.rows.length > 0) {
            res.json(resultado.rows)
        } else {
            res.status(404).json({ mensaje: 'Caf no encontrado' })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ mensaje: 'Error en el servidor' })
    }
}

async function obtenerCafActiva(req, res){
    try{
        const resultado = await modelo.obtenerCafActiva()
        if (resultado.rows.length > 0) {
            res.json(resultado.rows[0])
        } else {
            res.status(404).json(null)
        }
    }catch(error){
        console.log(error)
        res.status(500).json({mensaje: 'Error en el servidor'})
    }
}

async function crearCaf(req, res) {
    try {
        const {
            fecha,
            mapa
        } = req.body
        if (!fecha || !mapa) {
            return res.status(400).json({ mensaje: 'Datos incompletos' })
        }
        const resultado = await modelo.crearCaf({
            fecha, 
            mapa
        })
        const { fecha: fechaCreada } = resultado.rows[0]
        const fechaFormateada = new Date(fechaCreada).toISOString().slice(0,10)
        res.json({ mensaje: `Caf ${fechaFormateada} dado de alta` })
    } catch (error) {
        console.log(error)
        res.status(500).json({ mensaje: 'Error en el servidor' })
    }
}

async function modificarCaf(req, res) {
    try {
        const { id } = req.params
        const {
            fecha,
            mapa
        } = req.body
        
        if (!fecha || !mapa) {
            return res.status(400).json({ mensaje: 'Datos incompletos' })
        }
        const resultado = await modelo.modificarCaf(id, {
            fecha, 
            mapa
        })
        const { fecha: fechaModificada } = resultado.rows[0]
        const fechaFormateada = new Date(fechaModificada).toISOString().slice(0,10)
        res.json({ mensaje: `Caf ${fechaFormateada} modificada` })
    } catch (error) {
        console.log(error)
        res.status(500).json({ mensaje: 'Error en el servidor' })
    }
}

async function eliminarCaf(req, res) {
    try {
        const { id } = req.params
        const resultado = await modelo.eliminarCaf(id)
        if (resultado.rows.length > 0) {
            const { fecha: fechaEliminada } = resultado.rows[0]
            const fechaFormateada = new Date(fechaEliminada).toISOString().slice(0,10)
            res.status(200).json({ mensaje: `Caf: ${fechaFormateada} eliminada` })
        } else {
            res.status(404).json({ mensaje: 'Caf no encontrada' })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ mensaje: 'Error en el servidor' })
    }
}

async function finalizarCaf(req, res){
    try{
        const resultado = await modelo.finalizarCaf()
        if(resultado.rows.length > 0){
            const { fecha: fechaTerminada } = resultado.rows[0]
            const fechaFormateada = new Date(fechaTerminada).toISOString().slice(0,10)
            res.status(200).json({ mensaje: `Caf: ${fechaFormateada} terminada`})
        }else{
            res.status(404).json({mensaje: 'Caf no encontrada'})
        }
    }catch(error){
        console.log(error)
        res.status(500).json({mensaje: 'Error en el servidor'})
    }
}

export { obtenerCafs, obtenerCaf, obtenerCafActiva, crearCaf, modificarCaf, eliminarCaf, finalizarCaf }
