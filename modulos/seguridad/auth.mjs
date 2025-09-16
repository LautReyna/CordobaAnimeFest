import jwt from 'jsonwebtoken'

export const verificarAcceso = (req, res, next) => {
    try {
        if (!req.cookies.auth) {
            console.log('No se encontró la cookie de autenticación.')
            return res.redirect('/login')
        }
        const datos = jwt.verify(req.cookies.auth, process.env.FRASE_SECRETA)
        req.usuario = datos
        next()
    } catch (error) {
        res.clearCookie('auth')
        res.redirect('/login')
    }
}


export const verificarRol = (rolesPermitidos = []) => {
    return(req, res, next) => {
        if(!req.usuario){
            return res.redirect('/login')
        }

        if(!rolesPermitidos.includes(req.usuario.categoria)){
            return res.status(403).send('Acceso denegado')
        }

        next()
    }
}