//importaa el pool de conexiones a la base de datos PostgreSQL
import pool from '../../../../conexion/conexion.bd.mjs'

//Crea una nueva alerta o actualiza una existente para un usuario
export async function upsertAlertaUsuario(endpoint, idEvento, modo){
    // Validar que el modo sea uno de los permitidos, si no, usar 'todos' por defecto
    const modoValido = ['todos','por_iniciar','en_curso'].includes(modo) ? modo : 'todos'
    // Verificar que el endpoint esté suscrito
    const s = await pool.query('SELECT 1 FROM suscripciones WHERE endpoint=$1',[endpoint])
    if(s.rowCount === 0){
        const err = new Error('Suscripcion no encontrada para endpoint')
        err.status = 404
        throw err
    }
    // Verificar si ya existe una alerta para ese endpoint y evento
    const exist = await pool.query('SELECT id FROM alerta WHERE endpoint=$1 AND idEvento=$2',[endpoint, idEvento])
    if(exist.rowCount > 0){
        // Si existe, actualizar el modo de la alerta
        const id = exist.rows[0].id
        await pool.query('UPDATE alerta SET modo=$1 WHERE id=$2',[modoValido, id])
        return { id, actualizado: true }
    }
    // Si no existe, crear una nueva alerta
    const ins = await pool.query('INSERT INTO alerta(endpoint, idEvento, modo) VALUES($1,$2,$3) RETURNING id',[endpoint, idEvento, modoValido])
    return { id: ins.rows[0].id, creado: true }
}

// Obtiene todas las alertas de un usuario específico
export async function listarAlertasUsuario(endpoint){
    const r = await pool.query(`
        SELECT 
            alerta.id, 
            alerta.idEvento AS idEvento, 
            alerta.modo, 
            alerta.created_at,
            evento.nombre AS nombreEvento,
            zona.nombre AS nombreZona
        FROM alerta 
        LEFT JOIN evento ON alerta.idEvento = evento.id
        LEFT JOIN zona ON evento.ubicacion = zona.id
        WHERE alerta.endpoint=$1 
        ORDER BY alerta.created_at DESC
    `, [endpoint])
    return r.rows
}

// Elimina una alerta específica de un usuario
export async function eliminarAlertaUsuario(id, endpoint){
    const del = await pool.query('DELETE FROM alerta WHERE id=$1 AND endpoint=$2 RETURNING id',[id, endpoint])
    return del.rowCount > 0
}



