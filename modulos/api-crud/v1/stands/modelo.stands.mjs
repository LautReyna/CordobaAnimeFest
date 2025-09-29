import pool from '../../../../conexion/conexion.bd.mjs'

async function vincularStandCaf(idStand, idCaf){
    try{
        await pool.query(
            'INSERT INTO standCaf (idStand, idCaf) VALUES ($1, $2)',
            [idStand, idCaf]
        )
    }catch(error){
        console.log(error)
        throw error
    }
}

async function obtenerStandsCaf(idCaf){
    try{
        const resultado = await pool.query(
            'SELECT * FROM stand INNER JOIN standCaf ON stand.id = standCaf.idStand WHERE standCaf.idCaf = $1',
            [idCaf]
        )
        return resultado
    }catch(error){
        console.log(error)
        throw error
    }
}

async function obtenerStandsCafActiva(){
    try{
        const resultado = await pool.query(`
            SELECT stand.id AS idstand,
                   stand.nombre,
                   stand.descripcion,
                   stand.ubicacion,
                   stand.estado,
                   caf.id AS idcaf,
                   caf.fecha,
                   caf.mapa,
                   caf.activa FROM stand 
            INNER JOIN standCaf ON stand.id = standCaf.idStand 
            INNER JOIN caf ON standCaf.idCaf = caf.id
            WHERE caf.activa = true
        `)
        return resultado
    }catch(error){
        console.log(error)
        throw error
    }
}

async function obtenerStands(){
    try{
        const resultado = await pool.query('SELECT * FROM stand')
        return resultado
    }catch (error){
        console.log(error)
        throw error
    }
}

async function obtenerStand(id){
    try{
        const resultado = await pool.query(
            'SELECT * FROM stand WHERE id=$1',
            [id]
        )
        return resultado
    }catch(error){
        console.log(error)
        throw error
    }
}

async function crearStand(stand){
    try{
        const {
            nombre, 
            descripcion,
            ubicacion
        } = stand
        const resultado = await pool.query(
            `INSERT INTO stand
                (nombre, descripcion, ubicacion)
            VALUES
                ($1,$2,$3)
            RETURNING nombre, id`,
            [nombre, descripcion, ubicacion]
        )
        return resultado
    }catch(error){
        console.log(error)
        throw error
    }
}

async function modificarStand(id, stand ={}){
    try{
        const {
            nombre, 
            descripcion,
            ubicacion
        } = stand
        const resultado = await pool.query(
            `UPDATE stand
                SET
                    nombre=$1,
                    descripcion=$2,
                    ubicacion=$3
                WHERE id =$4
                RETURNING nombre`,
            [nombre, descripcion, ubicacion, id]
        )
        return resultado
    }catch(error){
        console.log(error)
        throw error
    }
}

async function eliminarStand(id){
    try{
        const resultado = await pool.query(
            `DELETE FROM stand
                WHERE id=$1
                RETURNING nombre`,
            [id]
        )
        return resultado
    }catch(error){
        console.log(error)
        throw error
    }
}

export{
    vincularStandCaf,
    obtenerStandsCaf,
    obtenerStandsCafActiva,
    obtenerStands,
    obtenerStand,
    crearStand,
    modificarStand,
    eliminarStand,
}