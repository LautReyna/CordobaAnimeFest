import './config/config.mjs'
import express from 'express'
import cookieParser  from 'cookie-parser'
import path from 'path'
import { fileURLToPath } from 'url'
import modulosApi from './modulos/modulos.mjs'
import rutasAutenticacion from './modulos/api-crud/v1/autenticacion.mjs'
import {verificarAcceso, verificarRol} from './modulos/seguridad/auth.mjs'
import routerUsuario from './modulos/seguridad/miUsuario.mjs'

const PUERTO = process.env.PUERTO

const app = express()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())
app.use(modulosApi)

app.use('/autenticacion', rutasAutenticacion)

app.use('/api/v1', routerUsuario)

app.use('/recursos', express.static('recursos'))
app.use('/login',(req, res, next)=>{res.clearCookie('auth'), express.static('login')(req, res, next)})
app.use('/www', express.static('www'))


app.get('/admin/eventos.html', verificarAcceso, verificarRol(['Eventos','Admin']), (req,res)=>{
    res.sendFile(path.join(__dirname, 'admin/eventos.html'))
})    
app.get('/admin/stands.html', verificarAcceso, verificarRol(['Stands', 'Admin']), (req,res)=> {
    res.sendFile(path.join(__dirname, 'admin/stands.html'))
})
app.get('/admin/usuarios.html', verificarAcceso, verificarRol(['Admin']), (req, res)=> {
    res.sendFile(path.join(__dirname, 'admin/usuarios.html'))
})

app.use('/admin', verificarAcceso, express.static(path.join(__dirname, 'admin')))

app.listen(PUERTO, ()=>{
    console.log(`Servidor en puerto ${PUERTO}`)
})
