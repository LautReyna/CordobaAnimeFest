// Importa la librería web-push para enviar notificaciones push y el pool de conexiones a la base de datos
import webpush from 'web-push'
import pool from '../../conexion/conexion.bd.mjs'

// Envía notificaciones push a los suscriptores de un evento según el estado del evento.
export async function sendNotificationForEvent(idEvento, estado, payloadObj){
    try{
        // Determina los modos de alerta según el estado del evento
        // Si el evento está 'Por Iniciar', notifica a quienes tienen modo 'todos' o 'por_iniciar'
        // Si está 'En Curso', notifica a 'todos' o 'en_curso'
        // Para otros estados, solo a 'todos'
        const modoNecesario = estado === 'Por Iniciar' ? ['todos','por_iniciar'] : estado === 'En Curso' ? ['todos','en_curso'] : ['todos']

        // Consulta las suscripciones que corresponden al evento y modo
        const { rows } = await pool.query(`
            SELECT s.data
            FROM alerta a
            JOIN suscripciones s ON s.endpoint = a.endpoint
            WHERE a.idEvento=$1 AND a.modo = ANY($2)
        `,[idEvento, modoNecesario])

        // Extrae los datos de las suscripciones
        const subs = rows.map(r => r.data)
        // Convierte el objeto de la notificación a string para enviarlo como payload
        const payload = JSON.stringify(payloadObj)

        // Envía la notificación a cada suscriptor
        await Promise.all(subs.map(async sub => {
            try{
                await webpush.sendNotification(sub, payload)
            }catch(error){
                // Si la suscripción ya no es válida (410 o 404), la elimina de la base de datos
                if(error.statusCode === 410 || error.statusCode === 404){
                    await pool.query('DELETE FROM suscripciones WHERE endpoint=$1',[sub.endpoint])
                    await pool.query('DELETE FROM alerta WHERE endpoint=$1',[sub.endpoint])
                }else{
                    // Si ocurre otro error, lo muestra en consola
                    console.error('Error push a', sub.endpoint, error.statusCode || error)
                }
            }
        }))
    }catch(error){
        console.error('Error enviando notificaciones por evento', error)
    }
}
