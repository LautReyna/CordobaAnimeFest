import './config/config.mjs'
import express from 'express'
import modulosApi from './modulos/modulos.mjs'
import morgan from 'morgan'
const PUERTO = process.env.PUERTO

const app = express()
app.use(morgan('dev'))
app.use(modulosApi)

app.use(express.static('admin'))
app.listen(PUERTO)

// app.all('*', (req, res) =>{
//     res.status(404).json({mensaje:'No encontrado'})
// })