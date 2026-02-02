// Importa las dependencias necesarias
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import pool from '../../conexion/conexion.bd.mjs'
import express from 'express'

// Función para obtener la IP del cliente desde la petición
function getClientIp(req){
    const xff = req.headers['x-forwarded-for'];
    if (xff) return xff.split(',')[0].trim();
    return req.ip || req.socket.remoteAddress || null;
}

// Crea un router de Express
const router = express.Router()

// Ruta para autenticación de usuario (login)
router.post('/', async (req, res)=> {
    const {nombre, contrasena} = req.body

    try{
        // Busca el usuario en la base de datos por nombre
        const resultado = await pool.query(
            'SELECT * FROM usuario WHERE nombre = $1',
            [nombre]
        )
        
        // Si no existe el usuario, responde con error de autenticación
        if(resultado.rows.length === 0){
            return res.status(401).json({mensaje: "Usuario o contraseña incorrectos"})
        }

        // Obtiene el usuario encontrado
        const usuario = resultado.rows[0]

        // Compara la contraseña ingresada con el hash almacenado
        const match = await bcrypt.compare(contrasena, usuario.contrasena)
        if(!match){
            return res.status(401).json({mensaje: "Usuario o contraseña incorrectos"})
        }

        // Genera un token JWT con los datos del usuario
        const token = jwt.sign(
            {id: usuario.id, nombre: usuario.nombre, categoria: usuario.categoria},
            process.env.FRASE_SECRETA,
            {expiresIn: "1h"}
        )

        // Obtiene la IP del cliente
        const ip = getClientIp(req)
        // Registra el acceso en la tabla de auditoría
        await pool.query(
            'INSERT INTO auditoria (idUsuario, ipTerminal) VALUES ($1, $2)',
            [usuario.id, ip]
        )

        // Envía el token como cookie httpOnly y redirige al panel de admin
        res.cookie("auth", token, {httpOnly: true})
        res.redirect("/admin")
    }catch(error){
        console.error(error)
        res.status(500).json({mensaje: "Error interno de autenticacion"})
    }
})

// Ruta para cerrar sesión (logout)
router.post('/logout', (req,res)=>{
    // Elimina la cookie de autenticación
    res.clearCookie('auth')
    res.json({mensaje: 'sesion cerrada'})
})

// Exporta el router para ser usado en la aplicación principal
export default router