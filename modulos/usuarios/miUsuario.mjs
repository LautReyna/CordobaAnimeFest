// Importa express y jsonwebtoken para manejar rutas y verificar el token JWT
import express from 'express'
import jwt from 'jsonwebtoken'

// Crea un router de Express
const router = express.Router()

// Ruta GET para obtener los datos del usuario autenticado
router.get('/', (req, res)=>{
    try{
        // Verifica si existe la cookie de autenticación
        if(!req.cookies.auth){
            return res.status(401).json({mensaje: "No autenticado"})
        }

        // Verifica y decodifica el token JWT usando la frase secreta
        const datos = jwt.verify(req.cookies.auth, process.env.FRASE_SECRETA)

        // Devuelve los datos básicos del usuario autenticado
        res.json({
            id: datos.id,
            nombre: datos.nombre,
            categoria: datos.categoria
        })        
    }catch(error){
        console.error('Error verificando token', error)
        res.clearCookie('auth')
        res.status(403).json({mensaje: 'Token invalido o expirado'})
    }
})

// Exporta el router para ser usado en la aplicación principal
export default router