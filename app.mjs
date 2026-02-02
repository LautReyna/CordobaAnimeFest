// Importa configuración y módulos principales
import './config/config.mjs' // Configuración de variables de entorno y otros settings
import express from 'express' // Framework principal de servidor
import cookieParser  from 'cookie-parser' // Middleware para cookies
import path from 'path' // Utilidades de rutas de archivos
import { fileURLToPath } from 'url' // Para obtener __dirname en ES Modules
import http from 'http' // Servidor HTTP nativo de Node
import { Server } from 'socket.io' // Socket.io para WebSockets
import webpush from 'web-push' // Notificaciones push

// Importa routers y middlewares personalizados
import modulosApi from './modulos/modulos.mjs'
import routerAutenticacion from './modulos/seguridad/autenticacion.mjs'
import routerUsuario from './modulos/usuarios/miUsuario.mjs'
import routerAuditoria from './modulos/seguridad/auditoria.mjs'
import routerCaf from './modulos/caf/caf.mjs'
import routerNotificaciones from './modulos/notificaciones/notificaciones.mjs'
import routerContacto from './modulos/contacto/contacto.mjs'
import {verificarAcceso, verificarRol} from './modulos/seguridad/auth.mjs'

import startEstadoEvento from './modulos/eventos/estadoEvento.mjs'

// Configuración de constantes y utilidades de ruta
const PUERTO = process.env.PUERTO
const app = express()
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Middlewares globales
app.use(express.json()) // Parseo de JSON en body
app.use(express.urlencoded({extended:true})) // Parseo de urlencoded en body
app.use(cookieParser()) // Parseo de cookies
app.use(modulosApi) // Middleware de API modular

// Rutas principales de la aplicación
app.use('/autenticacion', routerAutenticacion)
app.use('/miUsuario', routerUsuario)
app.use('/auditoria', routerAuditoria)
app.use('/caf', routerCaf)
app.use('/notificaciones', routerNotificaciones)
app.use('/contacto', routerContacto)

// Rutas estáticas para recursos y login
app.use('/recursos', express.static('recursos'))
// Limpia cookie de autenticación al acceder a /login y sirve estáticos de login
app.use('/login',(req, res, next)=>{
    res.clearCookie('auth')
    express.static('login')(req, res, next)
})

// Rutas protegidas de administración (antes de la ruta estática general)
// Cada ruta verifica acceso y rol antes de servir el archivo HTML correspondiente
app.get('/admin/eventos.html', verificarAcceso, verificarRol(['Eventos','Admin']), (req,res)=>{
    res.sendFile(path.join(__dirname, 'admin/eventos.html'))
})    
app.get('/admin/stands.html', verificarAcceso, verificarRol(['Stands', 'Admin']), (req,res)=> {
    res.sendFile(path.join(__dirname, 'admin/stands.html'))
})
app.get('/admin/usuarios.html', verificarAcceso, verificarRol(['Admin']), (req, res)=> {
    res.sendFile(path.join(__dirname, 'admin/usuarios.html'))
})

// Sirve archivos estáticos de la carpeta admin, solo si está autenticado
app.use('/admin', verificarAcceso, express.static(path.join(__dirname, 'admin')))

// Sirve la carpeta www directamente en la raíz (debe ir al final para no sobreescribir rutas previas)
app.use('/', express.static('www'))

// Crea el servidor HTTP y lo asocia a Socket.io
const server = http.createServer(app)
const io = new Server(server)

// Evento de conexión de clientes a Socket.io
io.on('connection', (socket) => {
    console.log('Cliente conectado:', socket.id)
})

// Configura las credenciales VAPID para web-push (notificaciones push)
webpush.setVapidDetails(
    process.env.VAPID_CONTACT || 'mailto:tu@dominio.com',
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
)

// Inicia el módulo de estado de eventos, pasándole la instancia de Socket.io
startEstadoEvento(io)

// Inicia el servidor en el puerto especificado
server.listen(PUERTO, ()=>{
    console.log(`Servidor en puerto ${PUERTO}`)
})
