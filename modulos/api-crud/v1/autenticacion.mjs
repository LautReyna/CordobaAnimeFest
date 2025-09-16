import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import pool from '../../../conexion/conexion.bd.mjs'
import express from 'express'

const router = express.Router()

router.post('/', async (req, res)=> {
    const {nombre, contrasena} = req.body

    try{
        const resultado = await pool.query(
            'SELECT * FROM usuario WHERE nombre = $1',
            [nombre]
        )
        
        if(resultado.rows.length === 0){
            return res.status(401).json({mensaje: "Usuario o contraseña incorrectos"})
        }

        const usuario = resultado.rows[0]

        const match = await bcrypt.compare(contrasena, usuario.contrasena)
        if(!match){
            return res.status(401).json({mensaje: "Usuario o contraseña incorrectos"})
        }

        const token = jwt.sign(
            {id: usuario.id, nombre: usuario.nombre, categoria: usuario.categoria},
            process.env.FRASE_SECRETA,
            {expiresIn: "1h"}
        )

        res.cookie("auth", token, {httpOnly: true})
        res.redirect("/admin")
    }catch(error){
        console.error(error)
        res.status(500).json({mensaje: "Error interno de autenticacion"})
    }
})

router.post('/logout', (req,res)=>{
    res.clearCookie('auth')
    res.json({mensaje: 'sesion cerrada'})
})

export default router

