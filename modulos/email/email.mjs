import nodemailer from 'nodemailer'

// Configurar transporter para Gmail
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, // tu email
        pass: process.env.EMAIL_PASS  // tu contraseña de aplicación
    }
})

// Función para enviar email de contacto
export async function enviarEmailContacto(datos) {
    try {
        const { nombre, email, asunto, mensaje } = datos
        
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: 'bdlaureyna@gmail.com', // email del responsable
            subject: `CAF Contacto: ${asunto}`,
            html: `
                <h3>Nuevo mensaje de contacto</h3>
                <p><strong>Nombre:</strong> ${nombre}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Asunto:</strong> ${asunto}</p>
                <p><strong>Mensaje:</strong></p>
                <p>${mensaje.replace(/\n/g, '<br>')}</p>
            `
        }
        
        const info = await transporter.sendMail(mailOptions)
        return { success: true, messageId: info.messageId }
    } catch (error) {
        console.error('Error enviando email:', error)
        throw new Error('Error enviando mensaje')
    }
}

// Función para verificar configuración
export async function verificarConfiguracion() {
    try {
        await transporter.verify()
        return true
    } catch (error) {
        console.error('Error verificando email:', error)
        return false
    }
}
