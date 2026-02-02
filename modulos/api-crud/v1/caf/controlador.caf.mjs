// Importa todas las funciones del modelo de caf
import * as modelo from './modelo.caf.mjs'

// Obtiene todas las ediciones de CAF registradas.
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

// Obtiene una CAF específica por su ID.
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

// Obtiene la CAF activa actual.
async function obtenerCafActiva(req, res){
    try{
        const resultado = await modelo.obtenerCafActiva()
        if (resultado.rows.length > 0) {
            res.json(resultado.rows[0])
        } else {
            res.status(404).json(null)
        }
    }catch(error){
        console.error('Error obteniendo CAF activa:', error)
        res.status(500).json({
            mensaje: 'Error interno del servidor',
            codigo: 'ERROR_SERVIDOR'
        })
    }
}

// Crea una nueva edición de CAF.
async function crearCaf(req, res) {
    try {
        const { fecha } = req.body

        // Obtiene el nombre del archivo subido (mapa)
        const fileName = req.file? req.file.filename : null
        
        console.log(fileName)
        
        if (!fecha || !fileName) {
            return res.status(400).json({ mensaje: 'Datos incompletos' })
        }
        
        const resultado = await modelo.crearCaf({
            fecha, 
            mapa: fileName 
        })
        const { id, fecha: fechaCreada } = resultado.rows[0]
        // Formatea la fecha para el mensaje de respuesta
        const fechaFormateada = new Date(fechaCreada).toISOString().slice(0,10)
        res.json({ 
            id,
            mensaje: `Caf ${fechaFormateada} dado de alta` 
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ mensaje: 'Error en el servidor' })
    }
}

// Modifica una CAF existente.
async function modificarCaf(req, res) {
    try {
        const { id } = req.params
        const { fecha } = req.body
        const fileName = req.file ? req.file.filename : null
        
        // Valida que ambos datos sean proporcionados
        if (!fecha || !fileName) {
            return res.status(400).json({ mensaje: 'Datos incompletos' })
        }
        // Modifica la CAF en la base de datos
        const resultado = await modelo.modificarCaf(id, {
            fecha, 
            mapa: fileName
        })
        const { fecha: fechaModificada } = resultado.rows[0]
        // Formatea la fecha para el mensaje de respuesta
        const fechaFormateada = new Date(fechaModificada).toISOString().slice(0,10)
        res.json({ mensaje: `Caf ${fechaFormateada} modificada` })
    } catch (error) {
        console.log(error)
        res.status(500).json({ mensaje: 'Error en el servidor' })
    }
}

// Elimina una CAF específica por su id.
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

// Finaliza la CAF activa actual.
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

// Exporta todas las funciones del controlador
export { obtenerCafs, obtenerCaf, obtenerCafActiva, crearCaf, modificarCaf, eliminarCaf, finalizarCaf }
