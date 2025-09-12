import pool from '../../../../conexion/conexion.bd.mjs'

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
            ubicacion,
            estado
        } = stand
        const resultado = await pool.query(
            `INSERT INTO stand
                (nombre, descripcion, ubicacion, estado)
            VALUES
                ($1,$2,$3,$4)
            RETURNING nombre`,
            [nombre, descripcion, ubicacion, estado]
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
            ubicacion,
            estado
        } = stand
        const resultado = await pool.query(
            `UPDATE stand
                SET
                    nombre=$1,
                    descripcion=$2,
                    ubicacion=$3,
                    estado=$4
                WHERE id =$5
                RETURNING nombre`,
            [nombre, descripcion, ubicacion, estado, id]
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
    obtenerStands,
    obtenerStand,
    crearStand,
    modificarStand,
    eliminarStand,
}