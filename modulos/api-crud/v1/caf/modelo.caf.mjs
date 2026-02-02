// Importa el pool de conexiones a la base de datos PostgreSQL
import pool from '../../../../conexion/conexion.bd.mjs'

// Obtiene todas las ediciones de CAF registradas en la base de datos.
async function obtenerCafs(){
    try{
        const resultado = await pool.query(
            `SELECT id, TO_CHAR(fecha, 'YYYY-MM-DD') AS fecha, mapa, activa FROM caf`
        )
        return resultado
    }catch (error){
        console.log(error)
        throw error
    }
}

// Obtiene una CAF específica por su ID.
async function obtenerCaf(id){
    try{
        const resultado = await pool.query(
            `SELECT id, TO_CHAR(fecha, 'YYYY-MM-DD') AS fecha, mapa, activa FROM caf WHERE id=$1`,
            [id]
        )
        return resultado
    }catch(error){
        console.log(error)
        throw error
    }
}

// Obtiene la CAF que está actualmente activa.
async function obtenerCafActiva(){
    try{
        const resultado = await pool.query(
            `SELECT id, TO_CHAR(fecha, 'YYYY-MM-DD') AS fecha, mapa, activa FROM caf WHERE activa = true`
        )
        return resultado
    }catch(error){
        console.log(error)
        throw error
    }
}

// Crea una nueva edición de CAF, desactivando previamente todas las existentes.
async function crearCaf(caf){
    try{
        // Desactiva todas las CAFs existentes antes de crear una nueva
        await pool.query(`UPDATE caf SET activa = false`)
        const {
            fecha, 
            mapa
        } = caf
        // Construye la ruta del archivo del mapa
        const rutaMapa = `/recursos/${mapa}`

        // Inserta la nueva CAF como activa
        const resultado = await pool.query(
            `INSERT INTO caf
                (fecha, mapa, activa)
            VALUES
                ($1,$2,true)
            RETURNING id, fecha`,
            [fecha, rutaMapa]
        )
        return resultado
    }catch(error){
        console.log(error)
        throw error
    }
}

// Modifica una CAF existente, actualizando su fecha, mapa y activándola.
async function modificarCaf(id, caf ={}){
    try{
        const {
            fecha, 
            mapa
        } = caf
        // Construye la ruta del archivo del mapa
        const rutaMapa = `/recursos/${mapa}`
        // Actualiza la CAF y la activa
        const resultado = await pool.query(
            `UPDATE caf
                SET
                    fecha=$1,
                    mapa=$2,
                    activa=true
                WHERE id =$3
                RETURNING fecha`,
            [fecha, rutaMapa, id]
        )
        return resultado
    }catch(error){
        console.log(error)
        throw error
    }
}

// Elimina una CAF específica por su ID.
async function eliminarCaf(id){
    try{
        const resultado = await pool.query(
            `DELETE FROM caf
                WHERE id=$1
                RETURNING fecha`,
            [id]
        )
        return resultado
    }catch(error){
        console.log(error)
        throw error
    }
}

// Finaliza (desactiva) la CAF que está actualmente activa.
async function finalizarCaf(){
    try{
        const resultado = await pool.query(
            'UPDATE caf SET activa = false WHERE activa = true RETURNING fecha'
        )
        return resultado
    }catch(error){
        console.log(error)
        throw error
    }
}

// Exporta todas las funciones del modelo de CAF
export{
    obtenerCafs,
    obtenerCaf,
    obtenerCafActiva,
    crearCaf,
    modificarCaf,
    eliminarCaf,
    finalizarCaf
}