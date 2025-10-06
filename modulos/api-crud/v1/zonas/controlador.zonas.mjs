import * as modelo from './modelo.zonas.mjs'

async function obtenerZonas(req, res){
    try{
        const resultado = await modelo.obtenerZonas()
        res.json(resultado.rows)
    }catch(error){
        console.log(error)
        res.status(500).json({ mensaje: 'Error en el servidor' })
    }
}

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

async function crearZona(req, res){
    try{
        const resultado = await modelo.crearZona(req.body)
        res.json(resultado.rows)
    }catch(error){
        console.log(error)
        res.status(500).json({ mensaje: 'Error en el servidor' })
    }
}

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

export{ obtenerZonas, obtenerZona, crearZona, modificarZona, eliminarZona, obtenerZonasCaf }