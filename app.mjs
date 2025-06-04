import './config/config.mjs'
import express from 'express'
import cookieParser  from 'cookie-parser'
import modulosApi from './modulos/modulos.mjs'
import rutasAutenticacion from './modulos/api-crud/v1/autenticacion.mjs'
import {verificarAcceso} from './modulos/seguridad/auth.mjs'

const PUERTO = process.env.PUERTO

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())
app.use(modulosApi)

app.use('/autenticacion', rutasAutenticacion)

app.use('/login', express.static('login'))

app.use('/admin', verificarAcceso, express.static('admin'))

app.listen(PUERTO)

// app.all('*', (req, res) =>{
//     res.status(404).json({mensaje:'No encontrado'})
// })