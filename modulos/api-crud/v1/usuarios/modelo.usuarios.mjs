// Importa el pool de conexiones a la base de datos y la librería bcrypt
import pool from '../../../../conexion/conexion.bd.mjs'
import bcrypt from 'bcrypt'

// Número de rondas de sal para el hash de contraseñas
const saltRounds = 10

// Obtiene todos los usuarios de la base de datos
async function obtenerUsuarios(){
    try{
        const resultado = await pool.query('SELECT * FROM usuario')
        return resultado
    }catch (error){
        console.log(error)
        throw error
    }
}

// Obtiene un usuario específico por su ID
async function obtenerUsuario(id){
    try{
        const resultado = await pool.query(
            'SELECT * FROM usuario WHERE id=$1',
            [id]
        )
        return resultado
    }catch(error){
        console.log(error)
        throw error
    }
}

// Crea un nuevo usuario en la base de datos
async function crearUsuario(usuario){
    try{
        const {
            nombre,
            contrasena,
            categoria
        } = usuario
        // Hashea la contraseña antes de guardarla
        const hashedPassword = await bcrypt.hash(contrasena, saltRounds)
        const resultado = await pool.query(
            `INSERT INTO usuario
                (nombre, contrasena, categoria)
            VALUES
                ($1,$2,$3)
            RETURNING nombre`,
            [nombre, hashedPassword, categoria]
        )
        return resultado
    }catch(error){
        console.log(error)
        throw error
    }
}

// Modifica un usuario existente en la base de datos
async function modificarUsuario(id, usuario ={}){
    try{
        const {
            nombre, 
            contrasena,
            categoria
        } = usuario

        let hashedPassword = ''

        // Si se proporciona una nueva contraseña, la hashea
        if(contrasena && contrasena.trim() !== ''){
            hashedPassword = await bcrypt.hash(contrasena, 10)
        }

        // Construye la consulta SQL dinámicamente según si hay nueva contraseña o no
        let query = `
            UPDATE usuario
            SET nombre=$1,
                categoria=$2
        `
        const params = [nombre, categoria]

        if(hashedPassword){
            // Si hay nueva contraseña, la incluye en la consulta
            query +=`,
                    contrasena=$3
                WHERE id=$4
                RETURNING nombre
            `
            params.push(hashedPassword, id)
        }else{
            // Si no hay nueva contraseña, solo actualiza nombre y categoría
            query +=`WHERE id=$3 RETURNING nombre`
            params.push(id)
        }

        const resultado = await pool.query(query, params)
        return resultado
    }catch(error){
        console.log(error)
        throw error
    }
}

// Elimina un usuario de la base de datos por su ID
async function eliminarUsuario(id){
    try{
        const resultado = await pool.query(
            `DELETE FROM usuario
                WHERE id=$1
                RETURNING nombre`,
            [id]
        )
        return resultado
    }catch(error){
        console.log(error)
        throw error
    }
}

// Exporta todas las funciones del modelo
export{
    obtenerUsuarios,
    obtenerUsuario,
    crearUsuario,
    modificarUsuario,
    eliminarUsuario,
}