import pool from '../../../../conexion/conexion.bd.mjs'

export async function upsertAlertaUsuario(endpoint, idEvento, modo){
    const modoValido = ['todos','por_iniciar','en_curso'].includes(modo) ? modo : 'todos'
    const s = await pool.query('SELECT 1 FROM suscripciones WHERE endpoint=$1',[endpoint])
    if(s.rowCount === 0){
        const err = new Error('Suscripcion no encontrada para endpoint')
        err.status = 404
        throw err
    }
    const exist = await pool.query('SELECT id FROM alerta WHERE endpoint=$1 AND idEvento=$2',[endpoint, idEvento])
    if(exist.rowCount > 0){
        const id = exist.rows[0].id
        await pool.query('UPDATE alerta SET modo=$1 WHERE id=$2',[modoValido, id])
        return { id, actualizado: true }
    }
    const ins = await pool.query('INSERT INTO alerta(endpoint, idEvento, modo) VALUES($1,$2,$3) RETURNING id',[endpoint, idEvento, modoValido])
    return { id: ins.rows[0].id, creado: true }
}

export async function listarAlertasUsuario(endpoint){
    const r = await pool.query('SELECT id, idEvento, modo, created_at FROM alerta WHERE endpoint=$1 ORDER BY created_at DESC',[endpoint])
    return r.rows
}

export async function eliminarAlertaUsuario(id, endpoint){
    const del = await pool.query('DELETE FROM alerta WHERE id=$1 AND endpoint=$2 RETURNING id',[id, endpoint])
    return del.rowCount > 0
}



