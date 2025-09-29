import pool from '../../../../conexion/conexion.bd.mjs'

async function vincularEventoCaf(idEvento, idCaf){
    try{
        await pool.query(
            'INSERT INTO eventoCaf (idEvento, idCaf) VALUES ($1, $2)',
            [idEvento, idCaf]
        )
    }catch(error){
        console.log(error)
        throw error
    }
}

async function obtenerEventosCaf(idCaf){
    try{
        const resultado = await pool.query(
            'SELECT * FROM evento INNER JOIN eventoCaf ON evento.id = eventoCaf.idEvento WHERE eventoCaf.idCaf = $1',
            [idCaf]
        )
        return resultado
    }catch(error){
        console.log(error)
        throw error
    }
}

async function obtenerEventosCafActiva(){
    try{
        const resultado = await pool.query(`
            SELECT evento.id AS idevento,
                   evento.nombre,
                   evento.horainicio,
                   evento.horafin,
                   evento.estado,
                   evento.ubicacion,
                   evento.descripcion,
                   evento.imagen,
                   caf.id AS idcaf,
                   caf.fecha,
                   caf.mapa,
                   caf.activa FROM evento 
            INNER JOIN eventoCaf ON evento.id = eventoCaf.idEvento 
            INNER JOIN caf ON eventoCaf.idCaf = caf.id
            WHERE caf.activa = true
        `)
        return resultado
    }catch(error){
        console.log(error)
        throw error
    }
}

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
            ubicacion, 
            descripcion,
            imagen
        } = evento
        const resultado = await pool.query(
            `INSERT INTO evento
                (nombre, horaInicio, horaFin, estado, ubicacion,
                descripcion, imagen)
            VALUES
                ($1,$2,$3,'Pendiente',$4,$5,$6)
            RETURNING nombre, id`,
            [nombre, horaInicio, horaFin, ubicacion,
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
                    estado='Pendiente',
                    ubicacion=$4,
                    descripcion=$5,
                    imagen=$6
                WHERE id =$7
                RETURNING nombre`,
            [nombre, horaInicio, horaFin, ubicacion,
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

async function cancelarEvento(id){
    try{
        const resultado = await pool.query(
            `UPDATE evento
                SET estado = 'Cancelado'
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
    vincularEventoCaf,
    obtenerEventosCaf,
    obtenerEventosCafActiva,
    obtenerEventos,
    obtenerEvento,
    crearEvento,
    modificarEvento,
    eliminarEvento,
    cancelarEvento
}