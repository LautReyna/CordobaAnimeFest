import cron from 'node-cron'
import webpush from 'web-push'
import pool from '../../conexion/conexion.bd.mjs'
import { sendNotificationForEvent } from '../notificaciones/servicio.mjs'

// async function sendNotificationToAll(payloadObj){
//     try{
//         const { rows } = await pool.query('SELECT id, data FROM suscripciones')
//         const subs = rows.map(r => r.data)
//         const payload = JSON.stringify(payloadObj)

//         await Promise.all(subs.map(async sub => {
//             try{
//                 await webpush.sendNotification(sub, payload)
//             }catch(error){
//                 // limpiar suscripciones validas
//                 if(error.statusCode === 410 || error.statusCode === 404){
//                     await pool.query('DELETE FROM suscripciones WHERE endpoint = $1', [sub.endpoint])
//                 }else{
//                     console.error('Error push a', sub.endpoint, error.statusCode || error)
//                 }
//             }
//         }))
//     }catch(error){
//         console.error('Error enviando notificaciones', error)
//     }
// }

// // notificaiones push
// async function notificarEvento(evento, estadoNuevo) {
//     try {
//         const resultado = await pool.query("SELECT data FROM suscripciones")
//         const subscripciones = resultado.rows.map(r => JSON.parse(r.data))

//         const payload = JSON.stringify({
//             title: `Evento ${estadoNuevo}`,
//             body: `El evento "${evento.nombre}" cambió a estado: ${estadoNuevo}`,
//         })

//         subscripciones.forEach(sub =>
//             webpush.sendNotification(sub, payload).catch(err => console.error(err))
//         )
//     } catch (error) {
//         console.error("Error al enviar notificación:", error)
//     }
// }

async function actualizarEstadosEventos(io) {
    try{
        const res1 = await pool.query(`
            UPDATE evento e
            SET estado = 'Por Iniciar'
            FROM eventoCaf ec
            JOIN caf c ON ec.idCaf = c.id
            WHERE e.id = ec.idEvento
                AND e.estado = 'Pendiente'
                AND c.activa = true
                AND (c.fecha + e.horaInicio) - interval '30 minutes' <= NOW()
                AND (c.fecha + e.horaFin) > NOW()
            RETURNING e.id, e.nombre
        `)

        const res2 = await pool.query(`
            UPDATE evento e
            SET estado = 'En Curso'
            FROM eventoCaf ec
            JOIN caf c ON ec.idCaf = c.id
            WHERE e.id = ec.idEvento
                AND e.estado = 'Por Iniciar'
                AND c.activa = true
                AND (c.fecha + e.horaInicio) <= NOW()
                AND (c.fecha + e.horaFin) > NOW()
            RETURNING e.id, e.nombre
        `)

        const res3 = await pool.query(`
            UPDATE evento e
            SET estado = 'Finalizado'
            FROM eventoCaf ec
            JOIN caf c ON ec.idCaf = c.id
            WHERE e.id = ec.idEvento
                AND e.estado = 'En Curso'
                AND c.activa = true
                AND (c.fecha + e.horaFin) <= NOW()
            RETURNING e.id, e.nombre
        `)

        const changed = (res1.rowCount || 0) + (res2.rowCount || 0) + (res3.rowCount || 0)
        if(changed > 0){
            console.log('Estados actualizados, notificando clientes y emitiendo socket...')
            // notifica via socket.io
            if(io) io.emit('eventos_actualizados')

            // notifica por push a todas las suscripciones
            for(const row of res1.rows){
                console.log('Notificando evento por iniciar', row.nombre)
                await sendNotificationForEvent(row.id, 'Por Iniciar', { title: 'Evento por iniciar', body: `El evento "${row.nombre}" esta por iniciar.`, url: '/www/index.html' })
            }
            for(const row of res2.rows){
                console.log('Notificando evento en curso', row.nombre)
                await sendNotificationForEvent(row.id, 'En Curso', { title: 'Evento en curso', body: `El evento "${row.nombre}" esta en curso.`, url: '/www/index.html' })
            }
            for(const row of res3.rows){
                console.log('Notificando evento finalizado', row.nombre)
                await sendNotificationForEvent(row.id, 'Finalizado', { title: 'Evento finalizado', body: `El evento "${row.nombre}" finalizo.`, url: '/www/index.html' })
            }

        }
        // if(res1.rowCount > 0 || res2.rowCount > 0 || res3.rowCount > 0){
        //     console.log('Estados actualizados, notificando clientes...')

        //     io.emit('eventos_actualizados')
        // }
    }catch(error){
        console.error('Error al actualizar estados de eventos', error)
    }
}

export default function startEstadoEvento(io){
    cron.schedule("* * * * *", async ()=> {
        console.log("⏳ Ejecutando actualización de estados...")
        await actualizarEstadosEventos(io)
    })
}