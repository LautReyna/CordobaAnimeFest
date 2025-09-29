export function renderizarFormularioUsuario(datosUsuario){
    try {
        document.querySelector('#form-editar-usuario input[name="id"]').value = datosUsuario.id
        document.querySelector('#form-editar-usuario input[name="nombre"]').value = datosUsuario.nombre
        document.querySelector('#form-editar-usuario input[name="contrasena"]').value = ''
        document.querySelector('#form-editar-usuario select[name="categoria"]').value = datosUsuario.categoria
    } catch (error) {
        console.log(error)
    }
}

export function renderizarListadoUsuario(datosUsuarios) {
    try {
        const contenedorUsuarios = document.getElementById('contenedor-usuarios')
        let filas = ''

        datosUsuarios.forEach((usuario) => {
            filas += `
                <tr>
                    <td scope="col">${usuario.nombre}</td>
                    <td scope="col">${'*'.repeat(10)}</td>
                    <td scope="col">${usuario.categoria}</td>
                    <td scope="col">
                    <button 
                        class="btn-editar-usuario" 
                        style="border: none; background: none; padding-left: 15px; margin-bottom: 15px;" 
                        data-bs-toggle="modal" 
                        data-bs-target="#modal-editar-usuario"
                        data-id="${usuario.id}"
                        data-nombre="${usuario.nombre}"
                        data-contrasena="${usuario.contrasena}"
                        data-categoria="${usuario.categoria}">
                        <i class="bi bi-pencil-square"></i>
                    </button>
                    </td>
                </tr>
            `
        })
        contenedorUsuarios.innerHTML = filas
    } catch (error) {
        console.log(error)
    }
}

export function mostrarContrasenaAlta(){
    document.addEventListener('DOMContentLoaded', ()=>{
        const cambiarContrasena = document.getElementById('alta-cambiar-contrasena')
        const contrasena = document.getElementById('alta-contrasena')
    
        if(cambiarContrasena && contrasena){
            cambiarContrasena.addEventListener('click', ()=>{
                const type = contrasena.getAttribute('type') === 'password' ? 'text' : 'password'
                contrasena.setAttribute('type', type)
                
                const icon = cambiarContrasena.querySelector('i');
                if (type === 'password') {
                    icon.classList.remove('bi-eye-slash');
                    icon.classList.add('bi-eye');
                } else {
                    icon.classList.remove('bi-eye');
                    icon.classList.add('bi-eye-slash');
                }
            })
        }
    })
}

export function mostrarContrasenaEditar(){
    document.addEventListener('DOMContentLoaded', ()=>{
        const cambiarContrasena = document.getElementById('editar-cambiar-contrasena')
        const contrasena = document.getElementById('editar-contrasena')
    
        if(cambiarContrasena && contrasena){
            cambiarContrasena.addEventListener('click', ()=>{
                const type = contrasena.getAttribute('type') === 'password' ? 'text' : 'password'
                contrasena.setAttribute('type', type)
                
                const icon = cambiarContrasena.querySelector('i');
                if (type === 'password') {
                    icon.classList.remove('bi-eye-slash');
                    icon.classList.add('bi-eye');
                } else {
                    icon.classList.remove('bi-eye');
                    icon.classList.add('bi-eye-slash');
                }
            })
        }
    })
}