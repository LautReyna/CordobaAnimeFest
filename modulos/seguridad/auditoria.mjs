// Importa express y el pool de conexiones a la base de datos
import express from 'express'
import pool from '../../conexion/conexion.bd.mjs'

// Crea un nuevo router de express
const router = express.Router()

// Ruta para obtener los registros de auditoría
router.get('/', async (req, res)=> {
    try{
        // Consulta los registros de auditoría junto con el nombre del usuario
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

// Exporta el router para ser usado en la aplicación principal
export default router