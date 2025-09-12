function procesarFormulario(formulario) {
    const datosFormulario = new FormData(formulario)
    return Object.fromEntries(datosFormulario)
}

const formulario = document.getElementById('login-form')
const mensajes = document.getElementById('mensajes')

formulario.addEventListener('submit', async (e) => {
  e.preventDefault()

  try {
    const datos = procesarFormulario(formulario)

    const respuesta = await fetch('/autenticacion', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(datos)
    })

    if (respuesta.redirected) {
      window.location.href = respuesta.url
    } else if(!respuesta.ok){
      const info = await respuesta.json()
      mensajes.innerHTML= `<div class="alert alert-danger w-50 text-center"> ${info.mensaje}</div>`
    }
  } catch (error) {
    console.error(error)
    mensajes.innerHTML= `<div class="alert alert-danger w-50 text-center">Error al enviar al formulario</div>`
  }
})
