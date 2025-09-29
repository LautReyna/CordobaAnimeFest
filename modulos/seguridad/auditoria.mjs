import express from 'express'
import pool from '../../conexion/conexion.bd.mjs'

const router = express.Router()

router.get('/', async (req, res)=> {
    try{
        const resultado = await pool.query(`
            SELECT a.idUsuario, u.nombre, a.fechaHora, a.ipTerminal
            FROM auditoria AS a
            INNER JOIN usuario AS u ON a.idUsuario = u.id
            ORDER BY a.fechaHora DESC
        `)
        res.json(resultado.rows)
    }catch(error){
        console.error('Error al traer auditoria', error)
        res.status(500).json({mensaje: 'Error al traer auditoria'})
    }
})

export default router