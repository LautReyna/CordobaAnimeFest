export function renderizarListadoAuditoria(datosAuditoria) {
    try {
        const contenedorAudtitoria = document.getElementById('contenedor-auditoria')
        let filas = ''

        if(!datosAuditoria || datosAuditoria.length === 0){
            filas = `
                    <tr>
                        <td colspan="3" class="text-center" "text-muted">No hay registros de auditoria</td>
                    </tr>
                `
        }else{
            datosAuditoria.forEach((auditoria) => {
                filas += `
                    <tr>
                        <td scope="col">${auditoria.nombre}</td>
                        <td scope="col">${new Date(auditoria.fechahora).toLocaleString()}</td>
                        <td scope="col">${auditoria.ipterminal}</td>
                    </tr>
                `
            })       
        }
        contenedorAudtitoria.innerHTML = filas
    } catch (error) {
        console.log(error)
    }
}
