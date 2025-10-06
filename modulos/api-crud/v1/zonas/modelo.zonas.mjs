import pool from '../../../../conexion/conexion.bd.mjs'

async function obtenerZonas(){
    try{
        const resultado = await pool.query('SELECT * FROM zona')
        return resultado
    }catch(error){
        console.log(error)
        throw error
    }
}

async function obtenerZona(id){
    try{
        const resultado = await pool.query('SELECT * FROM zona WHERE id=$1', [id])
        return resultado
    }catch(error){
        console.log(error)
        throw error
    }
}

async function obtenerZonasCaf(idCaf){
    try{
        const resultado = await pool.query('SELECT * FROM zona WHERE idCaf=$1', [idCaf])
        return resultado
    }catch(error){
        console.log(error)
        throw error
    }
}

async function crearZona(zona){
    try{
        const resultado = await pool.query('INSERT INTO zona (idCaf, nombre, coordenadas) VALUES ($1,$2,$3)', [zona.idCaf, zona.nombre, zona.coordenadas])
        return resultado
    }catch(error){
        console.log(error)
        throw error
    }
}

async function modificarZona(id, zona = {}){
    try{
        const resultado = await pool.query('UPDATE zona SET nombre=$1, coordenadas=$2 WHERE id=$3', [zona.nombre, zona.coordenadas, id])
        return resultado
    }catch(error){
        console.log(error)
        throw error
    }
}

async function eliminarZona(id){
    try{
        const resultado = await pool.query('DELETE FROM zona WHERE id=$1', [id])
        return resultado
    }catch(error){
        console.log(error)
        throw error
    }
}

export{ obtenerZonas, obtenerZona, crearZona, modificarZona, eliminarZona, obtenerZonasCaf }