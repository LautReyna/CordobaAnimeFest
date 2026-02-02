// Importa el módulo nodemailer para enviar correos electrónicos
import nodemailer from 'nodemailer'

// Configura el transporter para enviar correos usando Gmail
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS  
    }
})

// Función para enviar un email de contacto
export async function enviarEmailContacto(datos) {
    try {
        // Extrae los datos necesarios del objeto recibido
        const { nombre, email, asunto, mensaje } = datos
        
        // Define las opciones del correo electrónico a enviar
        const mailOptions = {
            from: process.env.EMAIL_USER, // Remitente (el email configurado)
            to: 'bdlaureyna@gmail.com',   // Destinatario (email del responsable)
            subject: `CAF Contacto: ${asunto}`, // Asunto del correo
            html: `
            <h3>Nuevo mensaje de contacto</h3>
            <p><strong>Nombre:</strong> ${nombre}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Asunto:</strong> ${asunto}</p>
            <p><strong>Mensaje:</strong></p>
            <p>${mensaje.replace(/\n/g, '<br>')}</p>
            ` // Cuerpo del correo en formato HTML
        }
        
        // Envía el correo electrónico usando el transporter configurado
        const info = await transporter.sendMail(mailOptions)
        // Retorna un objeto indicando éxito y el ID del mensaje enviado
        return { success: true, messageId: info.messageId }
    } catch (error) {
        console.error('Error enviando email:', error)
        throw new Error('Error enviando mensaje')
    }
}

// Función para verificar la configuración del transporter de nodemailer
export async function verificarConfiguracion() {
    try {
        // Verifica la configuración del transporter (credenciales y conexión)
        await transporter.verify()
        return true // Si todo está bien, retorna true
    } catch (error) {
        console.error('Error verificando email:', error)
        return false
    }
}
