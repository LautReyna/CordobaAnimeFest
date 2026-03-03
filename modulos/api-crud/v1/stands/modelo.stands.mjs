// Importa el pool de conexión a la base de datos
import pool from '../../../../conexion/conexion.bd.mjs'

// Vincula un stand a una edición de CAF específica.
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

// Obtiene todos los stands asociados a una edición de CAF específica.
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

// Obtiene estadísticas de visitas por stand (links) para la CAF activa.
async function obtenerEstadisticasStands(){
    try{
        const resultado = await pool.query(`
            SELECT stand.nombre,
                   COALESCE(standCaf.visitas, 0)::int AS visitas
            FROM stand
            INNER JOIN standCaf ON stand.id = standCaf.idStand
            INNER JOIN caf ON standCaf.idCaf = caf.id
            WHERE caf.activa = true
            ORDER BY visitas DESC
        `)
        return resultado
    }catch(error){
        console.log(error)
        throw error
    }
}

// Obtiene todos los stands asociados a la CAF activa, incluyendo información de zona y caf.
async function obtenerStandsCafActiva(){
    try{
        const resultado = await pool.query(`
            SELECT stand.id AS idstand,
                   stand.nombre,
                   stand.descripcion,
                   stand.pagina,
                   zona.id AS idzona,
                   zona.nombre AS nombrezona,
                   caf.id AS idcaf,
                   caf.fecha,   
                   caf.mapa,
                   caf.activa FROM stand 
            INNER JOIN standCaf ON stand.id = standCaf.idStand 
            INNER JOIN caf ON standCaf.idCaf = caf.id
            LEFT JOIN zona ON stand.ubicacion = zona.id
            WHERE caf.activa = true
        `)
        return resultado
    }catch(error){
        console.log(error)
        throw error
    }
}

// Obtiene todos los stands registrados en la base de datos.
async function obtenerStands(){
    try{
        const resultado = await pool.query('SELECT * FROM stand')
        return resultado
    }catch (error){
        console.log(error)
        throw error
    }
}

// Obtiene un stand específico por su ID.
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

// Crea un nuevo stand en la base de datos.
async function crearStand(stand){
    try{
        const {
            nombre, 
            descripcion,
            ubicacion,
            pagina
        } = stand
        const resultado = await pool.query(
            `INSERT INTO stand
                (nombre, descripcion, ubicacion, pagina)
            VALUES
                ($1,$2,$3,$4)
            RETURNING nombre, id`,
            [nombre, descripcion, ubicacion, pagina || null]
        )
        return resultado
    }catch(error){
        console.log(error)
        throw error
    }
}

// Modifica un stand existente en la base de datos.
async function modificarStand(id, stand ={}){
    try{
        const {
            nombre, 
            descripcion,
            ubicacion,
            pagina
        } = stand
        const resultado = await pool.query(
            `UPDATE stand
                SET
                    nombre=$1,
                    descripcion=$2,
                    ubicacion=$3,
                    pagina=$4
                WHERE id =$5
                RETURNING nombre`,
            [nombre, descripcion, ubicacion, pagina || null, id]
        )
        return resultado
    }catch(error){
        console.log(error)
        throw error
    }
}

// Incrementa las visitas de un stand en la CAF activa.
async function incrementarVisitaStand(idStand){
    try{
        const resultado = await pool.query(
            `UPDATE standCaf 
                SET visitas = COALESCE(visitas, 0) + 1 
                WHERE idStand = $1 
                AND idCaf = (SELECT id FROM caf WHERE activa = true LIMIT 1)
                RETURNING id`,
            [idStand]
        )
        return resultado
    }catch(error){
        console.log(error)
        throw error
    }
}

// Elimina un stand específico por su ID.
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

// Exporta todas las funciones del modelo
export{
    vincularStandCaf,
    obtenerStandsCaf,
    obtenerEstadisticasStands,
    obtenerStandsCafActiva,
    obtenerStands,
    obtenerStand,
    crearStand,
    modificarStand,
    incrementarVisitaStand,
    eliminarStand,
}