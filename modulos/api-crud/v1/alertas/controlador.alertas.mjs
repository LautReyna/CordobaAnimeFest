import { upsertAlertaUsuario, listarAlertasUsuario, eliminarAlertaUsuario } from './modelo.alertas.mjs'

export async function crearOActualizar(req, res){
    try{
        const { endpoint, idEvento, modo } = req.body || {}
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



