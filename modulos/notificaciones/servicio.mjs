import webpush from 'web-push'
import pool from '../../conexion/conexion.bd.mjs'

// Función removida - la tabla se crea desde caf.sql

// Enviar notificaciones a suscriptores de un evento según modo
export async function sendNotificationForEvent(idEvento, estado, payloadObj){
    try{
        const modoNecesario = estado === 'Por Iniciar' ? ['todos','por_iniciar'] : estado === 'En Curso' ? ['todos','en_curso'] : ['todos']
        const { rows } = await pool.query(`
            SELECT s.data
            FROM alerta a
            JOIN suscripciones s ON s.endpoint = a.endpoint
            WHERE a.idEvento=$1 AND a.modo = ANY($2)
        `,[idEvento, modoNecesario])
        const subs = rows.map(r => r.data)
        const payload = JSON.stringify(payloadObj)
        await Promise.all(subs.map(async sub => {
            try{
                await webpush.sendNotification(sub, payload)
            }catch(error){
                if(error.statusCode === 410 || error.statusCode === 404){
                    await pool.query('DELETE FROM suscripciones WHERE endpoint=$1',[sub.endpoint])
                    await pool.query('DELETE FROM alerta WHERE endpoint=$1',[sub.endpoint])
                }else{
                    console.error('Error push a', sub.endpoint, error.statusCode || error)
                }
            }
        }))
    }catch(error){
        console.error('Error enviando notificaciones por evento', error)
    }
}






