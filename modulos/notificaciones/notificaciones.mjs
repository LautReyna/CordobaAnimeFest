import express from 'express'
import pool from '../../conexion/conexion.bd.mjs'

const router = express.Router()

router.get('/vapidPublicKey', (req, res) => {
    res.json({ publicKey: process.env.VAPID_PUBLIC_KEY })
})

// // configuracion de web-push
// webpush.setVapidDetails(
//     'mailto:tuemail@ejemplo.com',
//     process.env.VAPID_PUBLIC_KEY,
//     process.env.VAPID_PRIVATE_KEY,
// )

// guardar sucripcion en BD
router.post('/subscribe', async (req, res) => {
    try{
        const sub = req.body
        if(!sub || !sub.endpoint){
            return res.status(400).json({ mensaje: 'Suscripcion invalida'})
        }

        const exist = await pool.query(
            'SELECT 1 FROM suscripciones WHERE endpoint = $1',
            [sub.endpoint]
        )

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

// // enviar notificacion de prueba
// router.post('/send', async (req, res) => {
//     try{
//         const resultado = await pool.query('SELECT data FROM subscripciones')
//         const subscripciones = resultado.rows.map(r => JSON.parse(r.data))

//         const payload = JSON.stringify({
//             title: 'Notificacion de prueba',
//             body: 'Esto es una prueba de notificacion push',
//         })

//         subscripciones.forEach(sub => 
//             webpush.sendNotification(sub, payload).catch(err => console.error(err)) 
//         )

//         res.json({ mensaje: 'Notificaciones enviadas' })
//     }catch(error){
//         console.error('Error enviando notificacion', error)
//         res.status(500).json({ mensaje: 'Error en servidor' })
//     }
// })

export default router