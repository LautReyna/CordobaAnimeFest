import pool from '../../conexion/conexion.bd.mjs'
import express from 'express'

const router = express.Router()

router.get('/activa', async (req, res) => {
    try{
        const resultado = await pool.query('SELECT * FROM caf WHERE activa = true')
        if(resultado.rows.length === 0){
            return res.json({ activa: false })
        }
        res.json({ activa: true, caf: resultado.rows[0] })
    }catch(error){
        console.error('Error verificando caf activa', error)
        res.status(500).json({activa: false, error: 'Error interno'})
    }
})

export default router