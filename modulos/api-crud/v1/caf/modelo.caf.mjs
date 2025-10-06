import pool from '../../../../conexion/conexion.bd.mjs'

async function obtenerCafs(){
    try{
        const resultado = await pool.query(`SELECT id, TO_CHAR(fecha, 'YYYY-MM-DD') AS fecha, mapa, activa FROM caf`)
        return resultado
    }catch (error){
        console.log(error)
        throw error
    }
}

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

async function obtenerCafActiva(){
    try{
        const resultado = await pool.query(`SELECT id, TO_CHAR(fecha, 'YYYY-MM-DD') AS fecha, mapa, activa FROM caf WHERE activa = true`)
        return resultado
    }catch(error){
        console.log(error)
        throw error
    }
}

async function crearCaf(caf){
    try{
        await pool.query(`UPDATE caf SET activa = false`)
        const {
            fecha, 
            mapa
        } = caf
        const rutaMapa = `/recursos/${mapa}`

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

async function modificarCaf(id, caf ={}){
    try{
        const {
            fecha, 
            mapa
        } = caf
        const rutaMapa = `/recursos/${mapa}`
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

async function finalizarCaf(){
    try{
        const resultado = await pool.query('UPDATE caf SET activa = false WHERE activa = true RETURNING fecha')
        return resultado
    }catch(error){
        console.log(error)
        throw error
    }
}
export{
    obtenerCafs,
    obtenerCaf,
    obtenerCafActiva,
    crearCaf,
    modificarCaf,
    eliminarCaf,
    finalizarCaf
}