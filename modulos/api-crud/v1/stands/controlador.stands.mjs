// Importa el modelo de stands y el pool de conexión a la base de datos
import * as modelo from './modelo.stands.mjs'
import pool from '../../../../conexion/conexion.bd.mjs'

// Obtiene todos los stands asociados a una edición de CAF específica.
async function obtenerStandsCaf(req, res){
    try {
        const { idCaf } = req.params
        const resultado = await modelo.obtenerStandsCaf(idCaf)
        res.json(resultado.rows)
    } catch (error) {
        console.log(error)
        res.status(500).json({ mensaje: 'Error en el servidor' })
    }
}

// Obtiene todos los stands de la CAF activa.
async function obtenerStandsCafActiva(req, res){
    try{
        const resultado = await modelo.obtenerStandsCafActiva()
        res.json(resultado.rows)
    }catch(error){
        console.log(error)
        res.status(500).json({ mensaje: 'Error en el servidor' })
    }
}

// Obtiene todos los stands registrados en la base de datos.
async function obtenerStands(req, res) {
    try {
        const resultado = await modelo.obtenerStands()
        res.json(resultado.rows)
    } catch (error) {
        console.log(error)
        res.status(500).json({ mensaje: 'Error en el servidor' })
    }
}

// Obtiene un stand específico por su ID.
async function obtenerStand(req, res) {
    try {
        const { id } = req.params
        const resultado = await modelo.obtenerStand(id)
        res.json(resultado.rows)
    } catch (error) {
        console.log(error)
        res.status(500).json({ mensaje: 'Error en el servidor' })
    }
}

// Crea un nuevo stand y lo vincula a la CAF activa.
async function crearStand(req, res) {
    try {
        const {
            nombre, 
            descripcion,
            ubicacion
        } = req.body

        if (!nombre || !descripcion || !ubicacion) {
            return res.status(400).json({ mensaje: 'Datos incompletos' })
        }

        // Busca la CAF activa para asociar el stand
        const resultadoCaf = await pool.query('SELECT id FROM caf WHERE activa = true')

        if(resultadoCaf.rows.length === 0){
            return res.status(400).json({mensaje: 'No hay caf activa'})
        }

        const idCaf = resultadoCaf.rows[0].id

        const resultado = await modelo.crearStand({
            nombre, 
            descripcion,
            ubicacion
        })
        const standCreado = resultado.rows[0]

        // Vincula el stand creado a la CAF activa
        await modelo.vincularStandCaf(standCreado.id, idCaf)
        
        res.json({ mensaje: `Stand ${standCreado.nombre} dado de alta` })
    } catch (error) {
        console.log(error)
        res.status(500).json({ mensaje: 'Error en el servidor' })
    }
}

// Modifica un stand existente.
async function modificarStand(req, res) {
    try {
        const { id } = req.params
        const {
            nombre, 
            descripcion,
            ubicacion
        } = req.body
        
        if (!nombre || !descripcion || !ubicacion) {
            return res.status(400).json({ mensaje: 'Datos incompletos' })
        }

        const resultado = await modelo.modificarStand(id, {
            nombre, 
            descripcion,
            ubicacion
        })
        const { nombre: nombreModificado } = resultado.rows[0]
        res.json({ mensaje: `Stand ${nombreModificado} modificado` })
    } catch (error) {
        console.log(error)
        res.status(500).json({ mensaje: 'Error en el servidor' })
    }
}

// Elimina un stand específico por su ID.
async function eliminarStand(req, res) {
    try {
        const { id } = req.params
        const resultado = await modelo.eliminarStand(id)
        if (resultado.rows.length > 0) {
            const { nombre: nombreEliminado } = resultado.rows[0]
            res.status(200).json({ mensaje: `Stand: ${nombreEliminado} eliminado` })
        } else {
            res.status(404).json({ mensaje: 'Stand no encontrado' })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ mensaje: 'Error en el servidor' })
    }
}

// Exporta todas las funciones del controlador
export { obtenerStandsCaf, obtenerStandsCafActiva, obtenerStands, obtenerStand, crearStand, modificarStand, eliminarStand }
