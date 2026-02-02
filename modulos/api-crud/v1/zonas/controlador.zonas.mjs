// Importa todas las funciones del modelo de zonas
import * as modelo from './modelo.zonas.mjs'

// Obtiene todas las zonas
async function obtenerZonas(req, res){
    try{
        const resultado = await modelo.obtenerZonas()
        res.json(resultado.rows)
    }catch(error){
        console.log(error)
        res.status(500).json({ mensaje: 'Error en el servidor' })
    }
}

// Obtiene una zona específica por su ID
async function obtenerZona(req, res){
    try{
        const { id } = req.params
        const resultado = await modelo.obtenerZona(id)
        res.json(resultado.rows)
    }catch(error){
        console.log(error)
        res.status(500).json({ mensaje: 'Error en el servidor' })
    }
}

// Obtiene todas las zonas asociadas a una CAF específica
async function obtenerZonasCaf(req, res){
    try{
        const { idCaf } = req.params
        const resultado = await modelo.obtenerZonasCaf(idCaf)
        res.json(resultado.rows)
    }catch(error){
        console.log(error)
        res.status(500).json({ mensaje: 'Error en el servidor' })
    }
}

// Crea una nueva zona en la base de datos
async function crearZona(req, res){
    try{
        const resultado = await modelo.crearZona(req.body)
        res.json(resultado.rows)
    }catch(error){
        console.log(error)
        res.status(500).json({ mensaje: 'Error en el servidor' })
    }
}

// Modifica una zona existente
async function modificarZona(req, res){
    try{
        const { id } = req.params
        const resultado = await modelo.modificarZona(id, req.body)
        res.json(resultado.rows)
    }catch(error){
        console.log(error)
        res.status(500).json({ mensaje: 'Error en el servidor' })
    }
}

// Elimina una zona específica por su ID
async function eliminarZona(req, res){
    try{
        const { id } = req.params
        const resultado = await modelo.eliminarZona(id)
        res.json(resultado.rows)
    }catch(error){
        console.log(error)
        res.status(500).json({ mensaje: 'Error en el servidor' })
    }
}

// Exporta todas las funciones del controlador
export{ obtenerZonas, obtenerZona, crearZona, modificarZona, eliminarZona, obtenerZonasCaf }