// Importa el pool de conexión a la base de datos
import pool from '../../../../conexion/conexion.bd.mjs'

// Vincula un evento a una edición de CAF específica
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

// Obtiene todos los eventos asociados a una CAF específica
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

// Obtiene todos los eventos de la CAF activa, incluyendo información de zona y caf
async function obtenerEventosCafActiva(){
    try{
        const resultado = await pool.query(`
            SELECT 
                evento.id AS id,
                evento.nombre,
                evento.horainicio,
                evento.horafin,
                evento.estado,
                zona.id AS idzona,
                zona.nombre AS nombrezona,
                evento.descripcion,
                evento.imagen,
                caf.id AS idcaf,
                caf.fecha,
                caf.mapa,
                caf.activa
            FROM evento
            INNER JOIN eventoCaf ON evento.id = eventoCaf.idEvento
            INNER JOIN caf ON eventoCaf.idCaf = caf.id
            LEFT JOIN zona ON evento.ubicacion = zona.id 
            WHERE caf.activa = true
        `)
        return resultado
    }catch(error){
        console.log(error)
        throw error
    }
}

// Obtiene todos los eventos registrados en la base de datos
async function obtenerEventos(){
    try{
        const resultado = await pool.query('SELECT * FROM evento')
        return resultado
    }catch (error){
        console.log(error)
        throw error
    }
}

// Obtiene un evento específico por su ID
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

// Crea un nuevo evento en la base de datos
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
        // Construye la ruta de la imagen para guardar en la base de datos
        const rutaImagen = `/recursos/${imagen}`
        
        const resultado = await pool.query(
            `INSERT INTO evento
                (nombre, horaInicio, horaFin, estado, ubicacion,
                descripcion, imagen)
            VALUES
                ($1,$2,$3,'Pendiente',$4,$5,$6)
            RETURNING nombre, id`,
            [nombre, horaInicio, horaFin, ubicacion,
                descripcion, rutaImagen]
        )
        return resultado
    }catch(error){
        console.log(error)
        throw error
    }
}

// Modifica un evento existente en la base de datos
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
        // Construye la ruta de la imagen para guardar en la base de datos
        const rutaImagen = `/recursos/${imagen}`
        
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
                descripcion, rutaImagen, id]
        )
        return resultado
    }catch(error){
        console.log(error)
        throw error
    }
}

// Elimina un evento específico por su ID
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

// Cancela un evento (cambia su estado a 'Cancelado') por su ID
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

// Exporta todas las funciones del modelo
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