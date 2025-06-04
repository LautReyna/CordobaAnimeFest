import pool from '../../../../conexion/conexion.bd.mjs'

async function obtenerEventos(){
    try{
        const resultado = await pool.query('SELECT * FROM evento')
        return resultado
    }catch (error){
        console.log(error)
        throw error
    }
}

async function obtenerEvento(id){
    try{
        const resultado = await pool.query(
            'SELECT * FROM evento WHERE id=$1',
            [id]
        )
        return resultado
    }catch(error){
        console.log(error)
        throw error
    }
}

async function crearEvento(evento){
    try{
        const {
            nombre, 
            horaInicio, 
            horaFin, 
            estado, 
            ubicacion, 
            descripcion,
            imagen
        } = evento
        const resultado = await pool.query(
            `INSERT INTO evento
                (nombre, horaInicio, horaFin, estado, ubicacion,
                descripcion, imagen)
            VALUES
                ($1,$2,$3,$4,$5,$6,$7)
            RETURNING nombre`,
            [nombre, horaInicio, horaFin, estado, ubicacion,
                descripcion, imagen]
        )
        return resultado
    }catch(error){
        console.log(error)
        throw error
    }
}

async function modificarEvento(id, evento ={}){
    try{
        const {
            nombre, 
            horaInicio, 
            horaFin, 
            estado, 
            ubicacion, 
            descripcion,
            imagen
        } = evento
        const resultado = await pool.query(
            `UPDATE evento
                SET
                    nombre=$1,
                    horaInicio=$2,
                    horaFin=$3,
                    estado=$4,
                    ubicacion=$5,
                    descripcion=$6,
                    imagen=$7
                WHERE id =$8
                RETURNING nombre`,
            [nombre, horaInicio, horaFin, estado, ubicacion,
                descripcion, imagen, id]
        )
        return resultado
    }catch(error){
        console.log(error)
        throw error
    }
}

async function eliminarEvento(id){
    try{
        const resultado = await pool.query(
            `DELETE FROM evento
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
    obtenerEventos,
    obtenerEvento,
    crearEvento,
    modificarEvento,
    eliminarEvento,
}