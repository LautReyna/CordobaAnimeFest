import pool from "../../conexion/conexion.bd.mjs";

//Fetch de Datos relevantes a la Base de Datos
async function obtenerEjesStand() {
    try {
        const consulta = await pool.query(`
            SELECT nombre, visitas
            FROM stand
            ORDER BY id ASC
        `);
        //Variables temporales de alamacenamiento
        const nombresArr = [];
        const visitasArr = [];

        for (const row of consulta) {
            nombresArr.push(row.nombre);
            visitasArr.push(row.visitas);
        }
        //Devuelve un arreglo que contiene un arreglo con los nombres de los stands 
        //y un arreglo correspondiente con cuantas visitas tubo ese stand
        // Ej [["Punto Rol", "Ember 3D PRINTS"], [25, 30]], estos valores luego 
        // se utilizan en la funcion para dibujar la grafica en HTML
        return [nombresArr, visitasArr];

    } catch (error) {
        console.error("Error en obtenerEjesStand:", error);
        return null;
    }
}