async function obtenerUsuarioActual() {
  try {
    const respuesta = await fetch('/api/v1/miUsuario', { credentials: "include" })
    if (!respuesta.ok) throw Error('No autenticado')

    const usuario = await respuesta.json()
    const enlaces = document.getElementById('enlaces')

    enlaces.innerHTML = `
      <li class="nav-item">
        <button id="btn-logout" class="btn btn-danger">
          <i class="bi bi-box-arrow-left"></i> 
        </button>
      </li>
    `

    if (usuario.categoria === 'Eventos' || usuario.categoria === 'Admin') {
      enlaces.insertAdjacentHTML("afterbegin", `
        <li class="nav-item"><a href="/admin/eventos.html" class="nav-link">Eventos</a></li>
      `)
    }
    if (usuario.categoria === 'Stands' || usuario.categoria === 'Admin') {
      enlaces.insertAdjacentHTML("afterbegin", `
        <li class="nav-item"><a href="/admin/stands.html" class="nav-link">Stands</a></li>
      `)
    }
    if (usuario.categoria === 'Admin') {
      enlaces.insertAdjacentHTML("afterbegin", `
        <li class="nav-item"><a href="/admin/usuarios.html" class="nav-link">Usuarios</a></li>
      `)
    }
  } catch (error) {
    console.error(error)
    window.location.href = '/login'
  }
}

document.getElementById('enlaces').addEventListener('click', async (e) => {
  if (e.target.id === 'btn-logout' || e.target.closest('#btn-logout')) {
    try {
      await fetch('/autenticacion/logout', { method: 'POST', credentials: "include" })
      window.location.href = '/login'
    } catch (error) {
      console.error('Error en el logout', error)
    }
  }
})

document.addEventListener('DOMContentLoaded', obtenerUsuarioActual)