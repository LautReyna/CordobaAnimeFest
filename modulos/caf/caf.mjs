// Importa el pool de conexiones a la base de datos y express
import pool from '../../conexion/conexion.bd.mjs'
import express from 'express'

// Crea un nuevo router de express
const router = express.Router()

// Ruta GET para verificar si existe una CAF activa
router.get('/activa', async (req, res) => {
    try{
        // Consulta la base de datos para obtener la CAF activa
        const resultado = await pool.query('SELECT * FROM caf WHERE activa = true')
        // Si no hay ninguna CAF activa, responde con activa: false
        if(resultado.rows.length === 0){
            return res.json({ activa: false })
        }
        // Si hay una CAF activa, responde con activa: true y los datos de la CAF
        res.json({ activa: true, caf: resultado.rows[0] })
    }catch(error){
        console.error('Error verificando caf activa', error)
        res.status(500).json({activa: false, error: 'Error interno'})
    }
})

// Exporta el router para ser usado en la aplicación principal
export default router