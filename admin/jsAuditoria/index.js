// Importaciones de funciones
import { renderizarListadoAuditoria } from "./funciones.js"

// Función para cargar la auditoria
async function cargarAuditoria(){
    try{
        // Obtener datos de la auditoria
        const res = await fetch('/auditoria', { credentials: "include" })
        if(!res.ok) throw Error('Error cargando auditoria')
        const datos = await res.json()
        // Renderizar el listado de auditoria
        renderizarListadoAuditoria(datos)
    }catch(error){
        console.log(error)
    }
}

cargarAuditoria()