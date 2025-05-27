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

async function obtenerEvento(idEvento){
    try{
        const resultado = await pool.query(
            'SELECT * FROM evento WHERE idEvento=$1',
            [idEvento]
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
            nombreEvento, 
            horaInicio, 
            horaFin, 
            estado, 
            ubicacionEvento, 
            descripcionEvento,
            imagenEvento
        } = evento
        const resultado = await pool.query(
            `INSERT INTO evento
                (nombreEvento, horaInicio, horaFin, estado, ubicacionEvento,
                descripcionEvento, imagenEvento)
            VALUES
                ($1,$2,$3,$4,$5,$6,$7)
            RETURNING nombreEvento`,
            [nombreEvento, horaInicio, horaFin, estado, ubicacionEvento,
                descripcionEvento, imagenEvento]
        )
        return resultado
    }catch(error){
        console.log(error)
        throw error
    }
}

async function modificarEvento(evento){
    try{
        const {
            nombreEvento, 
            horaInicio, 
            horaFin, 
            estado, 
            ubicacionEvento, 
            descripcionEvento,
            imagenEvento
        } = evento
        const resultado = await pool.query(
            `UPDATE evento
                SET
                    nombreEvento=$1,
                    horaInicio=$2,
                    horaFin=$3,
                    estado=$4,
                    ubicacionEvento=$5,
                    descripcionEvento=$6,
                    imagenEvento=$7
                RETURNING nombreEvento`,
            [nombreEvento, horaInicio, horaFin, estado, ubicacionEvento,
                descripcionEvento, imagenEvento]
        )
        return resultado
    }catch(error){
        console.log(error)
        throw error
    }
}

async function eliminarEvento(idEvento){
    try{
        const resultado = await pool.query(
            `DELETE FROM evento
                WHERE idEvento=$1
                RETURNING nombreEvento`,
            [idEvento]
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