// Importa la librería jsonwebtoken para verificar el token JWT
import jwt from 'jsonwebtoken'

// Middleware para verificar si el usuario está autenticado mediante JWT en la cookie "auth"
export const verificarAcceso = (req, res, next) => {
    try {
        // Verifica si existe la cookie de autenticación
        if (!req.cookies.auth) {
            console.log('No se encontró la cookie de autenticación.')
            return res.redirect('/login') // Redirige al login si no hay cookie
        }
        // Verifica y decodifica el token JWT usando la frase secreta
        const datos = jwt.verify(req.cookies.auth, process.env.FRASE_SECRETA)
        req.usuario = datos // Adjunta los datos del usuario al request
        next() // Continúa con la siguiente función middleware
    } catch (error) {
        // Si el token es inválido o expiró, elimina la cookie y redirige al login
        res.clearCookie('auth')
        res.redirect('/login')
    }
}

// Middleware para verificar si el usuario tiene uno de los roles permitidos
export const verificarRol = (rolesPermitidos = []) => {
    return(req, res, next) => {
        // Si no hay usuario autenticado, redirige al login
        if(!req.usuario){
            return res.redirect('/login')
        }

        // Si el rol del usuario no está en la lista de roles permitidos, deniega el acceso
        if(!rolesPermitidos.includes(req.usuario.categoria)){
            return res.status(403).send('Acceso denegado')
        }

        next() // El usuario tiene el rol adecuado, continúa
    }
}