import { renderizarListadoAuditoria } from "./funciones.js"

async function cargarAuditoria(){
    try{
        const res = await fetch('/auditoria', { credentials: "include" })
        if(!res.ok) throw Error('Error cargando auditoria')
        const datos = await res.json()
        renderizarListadoAuditoria(datos)
    }catch(error){
        console.log(error)
    }
}

cargarAuditoria()