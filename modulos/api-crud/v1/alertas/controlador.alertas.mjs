// Importa las funciones del modelo de alertas
import { upsertAlertaUsuario, listarAlertasUsuario, eliminarAlertaUsuario } from './modelo.alertas.mjs'

// Crea una nueva alerta o actualiza una existente para un usuario.
// Si ya existe una alerta para el endpoint e idEvento, la actualiza; si no, la crea.
export async function crearOActualizar(req, res){
    try{
        const { endpoint, idEvento, modo } = req.body || {}
        
        // Validar parámetros requeridos
        if(!endpoint || !idEvento){
            return res.status(400).json({ mensaje: 'endpoint e idEvento son requeridos' })
        }
        const result = await upsertAlertaUsuario(endpoint, Number(idEvento), modo)
        res.json({ mensaje: result.actualizado ? 'Alerta actualizada' : 'Alerta creada', id: result.id })
    }catch(error){
        console.error('crearOActualizar', error)
        res.status(error.status || 500).json({ mensaje: error.message || 'Error servidor' })
    }
}

//Lista todas las alertas de un usuario específico según su endpoint.
export async function listar(req, res){
    try{
        const { endpoint } = req.query
        if(!endpoint) return res.status(400).json({ mensaje: 'endpoint requerido' })
        const rows = await listarAlertasUsuario(endpoint)
        res.json(rows)
    }catch(error){
        console.error('listar', error)
        res.status(500).json({ mensaje: 'Error servidor' })
    }
}

//Elimina una alerta específica de un usuario.
export async function eliminar(req, res){
    try{
        const { id } = req.params
        const { endpoint } = req.body || {}
        if(!endpoint) return res.status(400).json({ mensaje: 'endpoint requerido' })
        const ok = await eliminarAlertaUsuario(Number(id), endpoint)
        if(!ok) return res.status(404).json({ mensaje: 'No encontrada' })
        res.json({ mensaje: 'Alerta eliminada' })
    }catch(error){
        console.error('eliminar', error)
        res.status(500).json({ mensaje: 'Error servidor' })
    }
}


