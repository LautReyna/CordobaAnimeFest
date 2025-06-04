import express from 'express'
import jwt from 'jsonwebtoken'

const router = express.Router()

router.post('/', (req, res) => {
    const {usuario, pass} = req.body
    if(process.env.LOGIN_USER === usuario && process.env.LOGIN_PASS === pass){
        const payload = {usuario: process.env.LOGIN_USER}
        const token = jwt.sign(payload, process.env.FRASE_SECRETA, {expiresIn: '1m'})
        res.cookie('auth', token,{
            httpOnly: true,
            sameSite: 'strict'
        })
        res.redirect('/admin')
    }else{
        res.status(401).json({mensaje: 'Usuario o Constraseña incorrectos'})
    }
})

export default router