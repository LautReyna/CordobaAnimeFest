// Importa express y el pool de conexiones a la base de datos
import express from 'express'
import pool from '../../conexion/conexion.bd.mjs'

// Crea un nuevo router de express
const router = express.Router()

// Ruta para obtener la clave pública VAPID para notificaciones push
router.get('/vapidPublicKey', (req, res) => {
    res.json({ publicKey: process.env.VAPID_PUBLIC_KEY })
})


// Ruta para guardar una suscripción de notificaciones push en la base de datos
router.post('/subscribe', async (req, res) => {
    try{
        const sub = req.body
        
        if(!sub || !sub.endpoint){
            return res.status(400).json({ mensaje: 'Suscripcion invalida'})
        }

        // Verifica si la suscripción ya existe en la base de datos
        const exist = await pool.query(
            'SELECT 1 FROM suscripciones WHERE endpoint = $1',
            [sub.endpoint]
        )

        // Si no existe, la inserta en la base de datos
        if(exist.rows.length === 0){
            await pool.query(
                'INSERT INTO suscripciones (endpoint, data) VALUES ($1, $2)',
                [sub.endpoint, sub]
            )
        }

        res.json({ mensaje: 'Suscripto exitosamente' })
    }catch(error){
        console.error('Error guardando subscripcion', error)
        res.status(500).json({ mensaje: 'Error en el servidor' })
    }
})

// Exporta el router para ser usado en la aplicación principal
export default router