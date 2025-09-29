import express from 'express'
import jwt from 'jsonwebtoken'

const router = express.Router()

router.get('/', (req, res)=>{
    try{
        if(!req.cookies.auth){
            return res.status(401).json({mensaje: "No autenticado"})
        }

        const datos = jwt.verify(req.cookies.auth, process.env.FRASE_SECRETA)

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

export default router