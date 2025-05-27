import pool from '../../../../conexion/conexion.bd.mjs'

async function obtenerAlertas() {
    try {
        const resultado = await pool.query('SELECT * FROM alertas')
        return resultado
    } catch (error) {
        console.log(error)
        throw error
    }
}

async function obtenerAlerta(id) {
    try {
        const resultado = await pool.query(
            'SELECT * FROM alertas WHERE id=$1',
            [id]
        )
        return resultado
    } catch (error) {
        console.log(error)
        throw error
    }
}

async function crearAlerta(alerta) {
    try {
        const { hora } = alerta
        const resultado = await pool.query(
            `
            INSERT INTO alertas
                (hora)
            VALUES
                ($1)
            RETURNING id, hora
        `,
            [hora]
        )
        return resultado
    } catch (error) {
        console.log(error)
        throw error
    }
}

async function modificarAlerta(alerta) {
    try {
        const { id, hora } = alerta
        const resultado = await pool.query(
            `UPDATE alertas
                SET 
                    hora=$1
                    WHERE id=$2
                RETURNING id, hora
            `,
            [hora, id]
        )
        return resultado
    } catch (error) {
        console.log(error)
        throw error
    }
}

async function eliminarAlerta(id) {
    try {
        const resultado = await pool.query(
            `DELETE FROM alertas 
                WHERE id=$1
                RETURNING id, hora
            `,
            [id]
        )
        return resultado
    } catch (error) {
        console.log(error)
        throw error
    }
}
export {
    obtenerAlertas,
    obtenerAlerta,
    crearAlerta,
    modificarAlerta,
    eliminarAlerta,
}
