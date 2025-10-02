import express from 'express'
import { enviarEmailContacto } from '../email/email.mjs'

const router = express.Router()

// Endpoint para enviar mensaje de contacto
router.post('/', async (req, res) => {
    try {
        const { nombre, email, asunto, mensaje } = req.body
        
        // Validar datos requeridos
        if (!nombre || !asunto || !mensaje) {
            return res.status(400).json({ 
                mensaje: 'Nombre, asunto y mensaje son requeridos' 
            })
        }
        
        // Validar email si se proporciona
        if (email && !/\S+@\S+\.\S+/.test(email)) {
            return res.status(400).json({ 
                mensaje: 'Email inválido' 
            })
        }
        
        // Enviar email
        const resultado = await enviarEmailContacto({ nombre, email, asunto, mensaje })
        
        res.json({ 
            mensaje: 'Mensaje enviado correctamente',
            success: true 
        })
        
    } catch (error) {
        console.error('Error en contacto:', error)
        res.status(500).json({ 
            mensaje: 'Error enviando mensaje. Intente más tarde.' 
        })
    }
})

export default router
