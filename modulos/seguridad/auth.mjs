import jwt from 'jsonwebtoken'

export const verificarAcceso = (req, res, next) => {
    try {
        if (!req.cookies.auth) {
            console.log('No se encontró la cookie de autenticación.')
            return res.redirect('/login')
        }
        const datos = jwt.verify(req.cookies.auth, process.env.FRASE_SECRETA)
        req.usuario = datos.usuario
        next()
    } catch (error) {
        res.redirect('/login')
    }
}