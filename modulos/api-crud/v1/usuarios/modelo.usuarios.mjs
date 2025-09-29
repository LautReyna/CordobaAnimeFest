import pool from '../../../../conexion/conexion.bd.mjs'
import bcrypt from 'bcrypt'

const saltRounds = 10

async function obtenerUsuarios(){
    try{
        const resultado = await pool.query('SELECT * FROM usuario')
        return resultado
    }catch (error){
        console.log(error)
        throw error
    }
}

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

async function crearUsuario(usuario){
    try{
        const {
            nombre,
            contrasena,
            categoria
        } = usuario
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

async function modificarUsuario(id, usuario ={}){
    try{
        const {
            nombre, 
            contrasena,
            categoria
        } = usuario

        let hashedPassword = ''

        if(contrasena && contrasena.trim() !== ''){
            hashedPassword = await bcrypt.hash(contrasena, 10)
        }

        let query = `
            UPDATE usuario
            SET nombre=$1,
                categoria=$2
        `
        const params = [nombre, categoria]

        if(hashedPassword){
            query +=`,
                    contrasena=$3
                WHERE id=$4
                RETURNING nombre
            `
            params.push(hashedPassword, id)
        }else{
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

export{
    obtenerUsuarios,
    obtenerUsuario,
    crearUsuario,
    modificarUsuario,
    eliminarUsuario,
}