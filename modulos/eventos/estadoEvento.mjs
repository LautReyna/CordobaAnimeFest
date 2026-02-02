// Importamos las dependencias necesarias
import cron from 'node-cron'
import pool from '../../conexion/conexion.bd.mjs'
import { sendNotificationForEvent } from '../notificaciones/servicio.mjs'

// Función principal para actualizar los estados de los eventos
async function actualizarEstadosEventos(io) {
    try{
        // 1. Cambia eventos de 'Pendiente' a 'Por Iniciar' si faltan 30 minutos o menos para iniciar
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

        // 2. Cambia eventos de 'Por Iniciar' a 'En Curso' si ya es la hora de inicio
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

        // 3. Cambia eventos de 'En Curso' a 'Finalizado' si ya pasó la hora de fin
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

        // Calcula si hubo algún cambio en los estados
        const changed = (res1.rowCount || 0) + (res2.rowCount || 0) + (res3.rowCount || 0)
        if(changed > 0){
            console.log('Estados actualizados, notificando clientes y emitiendo socket...')
            // Notifica a los clientes conectados vía socket.io
            if(io) io.emit('eventos_actualizados')

            // Notifica por push a todas las suscripciones según el nuevo estado
            for(const row of res1.rows){
                console.log('Notificando evento por iniciar', row.nombre)
                await sendNotificationForEvent(
                    row.id,
                    'Por Iniciar',
                    { title: 'Evento por iniciar', body: `El evento "${row.nombre}" esta por iniciar.`, url: '/www/index.html' }
                )
            }
            for(const row of res2.rows){
                console.log('Notificando evento en curso', row.nombre)
                await sendNotificationForEvent(
                    row.id,
                    'En Curso',
                    { title: 'Evento en curso', body: `El evento "${row.nombre}" esta en curso.`, url: '/www/index.html' }
                )
            }
            for(const row of res3.rows){
                console.log('Notificando evento finalizado', row.nombre)
                await sendNotificationForEvent(
                    row.id,
                    'Finalizado',
                    { title: 'Evento finalizado', body: `El evento "${row.nombre}" finalizo.`, url: '/www/index.html' }
                )
            }
        }
    }catch(error){
        console.error('Error al actualizar estados de eventos', error)
    }
}

// Función para iniciar el cron que ejecuta la actualización de estados cada minuto
export default function startEstadoEvento(io){
    // Programa la tarea para que se ejecute cada minuto
    cron.schedule("* * * * *", async ()=> {
        console.log("Ejecutando actualización de estados...")
        await actualizarEstadosEventos(io)
    })
}