import './config/config.mjs'
import './modulos/eventos/estadoEvento.mjs'
import express from 'express'
import cookieParser  from 'cookie-parser'
import path from 'path'
import { fileURLToPath } from 'url'
import http from 'http'
import { Server } from 'socket.io'
import webpush from 'web-push'

import modulosApi from './modulos/modulos.mjs'
import routerAutenticacion from './modulos/seguridad/autenticacion.mjs'
import routerUsuario from './modulos/usuarios/miUsuario.mjs'
import routerAuditoria from './modulos/seguridad/auditoria.mjs'
import routerCaf from './modulos/caf/caf.mjs'
import routerNotificaciones from './modulos/notificaciones/notificaciones.mjs'
import routerContacto from './modulos/contacto/contacto.mjs'
import {verificarAcceso, verificarRol} from './modulos/seguridad/auth.mjs'

import startEstadoEvento from './modulos/eventos/estadoEvento.mjs'

const PUERTO = process.env.PUERTO
const app = express()
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())
app.use(modulosApi)

app.use('/autenticacion', routerAutenticacion)
app.use('/miUsuario', routerUsuario)
app.use('/auditoria', routerAuditoria)
app.use('/caf', routerCaf)
app.use('/notificaciones', routerNotificaciones)
app.use('/contacto', routerContacto)

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


// create server and io
const server = http.createServer(app)
const io = new Server(server)

io.on('connection', (socket) => {
    console.log('Cliente conectado:', socket.id)
})

// configure web-push VAPID
webpush.setVapidDetails(
    process.env.VAPID_CONTACT || 'mailto:tu@dominio.com',
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
)

// start estadoEvento AFTER io created
startEstadoEvento(io)

// star server
server.listen(PUERTO, ()=>{
    console.log(`Servidor en puerto ${PUERTO}`)
})
