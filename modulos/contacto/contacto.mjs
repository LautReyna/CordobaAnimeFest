// Importa express y la función para enviar el email de contacto
import express from 'express'
import { enviarEmailContacto } from '../email/email.mjs'

// Crea un nuevo router de express
const router = express.Router()

// Endpoint para enviar mensaje de contacto
router.post('/', async (req, res) => {
    try {
        const { nombre, email, asunto, mensaje } = req.body
        
        if (!nombre || !asunto || !mensaje) {
            return res.status(400).json({ 
                mensaje: 'Nombre, asunto y mensaje son requeridos' 
            })
        }
        
        // Si se proporciona email, valida el formato
        if (email && !/\S+@\S+\.\S+/.test(email)) {
            return res.status(400).json({ 
                mensaje: 'Email inválido' 
            })
        }
        
        // Llama a la función para enviar el email de contacto
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

// Exporta el router para ser usado en la aplicación principal
export default router
