// Importaciones de utilidades
import { mostrarMensaje } from "../recursos/utilidades.js"

// Variable global para almacenar el ID del evento actual
export let idEvento = null

// Función helper para determinar si el texto necesita botón de expansión
function necesitaBotonExpansion(texto, limiteCaracteres = 100) {
    return texto && texto.length > limiteCaracteres
}

// Función helper para truncar texto si es necesario
function truncarTexto(texto, limiteCaracteres = 100) {
    if (!texto || texto.length <= limiteCaracteres) {
        return texto
    }
    return texto.substring(0, limiteCaracteres) + '...'
}

// Función para renderizar el formulario por nombre de evento
export async function renderizarFormularioPorNombre(datosEventos, formulario, mensajes){
    let nombreEvento = formulario.nombre
    
    // Remover listener anterior para evitar duplicados
    nombreEvento.removeEventListener('input', nombreEvento._handler || (() => {}))

    // Handler para buscar evento por nombre
    const handler = () =>{
        const nombreBuscado = nombreEvento.value.trim().toLowerCase()
        const evento = datosEventos.find(e => e.nombre.toLowerCase() === nombreBuscado)

        if(evento){
            // Evento encontrado - llenar el formulario
            idEvento = evento.id
    
            formulario.nombre.value = evento.nombre
            formulario.descripcion.value = evento.descripcion
            formulario.ubicacion.value = evento.idzona
            formulario.horaInicio.value = evento.horainicio
            formulario.horaFin.value = evento.horafin

            mostrarMensaje(mensajes, `Se encontró un evento con este nombre: ${formulario.nombre.value}`, 'info')
        }else{
            // Evento no encontrado - limpiar el ID
            idEvento = null
        }
    }

    nombreEvento._handler = handler
    nombreEvento.addEventListener('input', handler)
}

// Función para renderizar el listado de eventos
export async function renderizarListadoEventos(datosEventos, contenedorId) {
    try {
        const contenedorEventos = document.getElementById(contenedorId)
        let filas = ''

        // Verificar si hay eventos registrados
        if (!datosEventos || datosEventos.length === 0) {
            filas = `
                <tr>
                    <td colspan="6" class="text-center text-muted">
                        No hay eventos registrados
                    </td>
                </tr>
            `
        } else {
            // Ordenar eventos por estado
            const ordenEstados = {'En Curso': 1, 'Por Iniciar': 2, 'Pendiente': 3, 'Finalizado': 4}
            datosEventos.sort((a, b) => ordenEstados[a.estado] - ordenEstados[b.estado])

            // Crear filas para cada evento
            datosEventos.forEach((evento) => {
                const necesitaBoton = necesitaBotonExpansion(evento.descripcion)
                const textoMostrar = necesitaBoton ? truncarTexto(evento.descripcion) : evento.descripcion
                
                filas += `
                    <tr>
                        <td scope="col">${evento.nombre}</td>
                        <td scope="col">
                            <div class="descripcion ${necesitaBoton ? '' : 'sin-boton'}">
                                <p class="descripcion-texto">${textoMostrar}</p>
                                ${necesitaBoton ? `
                                    <button class="btn-expandir" type="button" aria-expanded="false" data-texto-completo="${evento.descripcion}">
                                        <span class="btn-texto">Mostrar más</span>
                                        <span class="btn-icono">▼</span>
                                    </button>
                                ` : ''}
                            </div>
                        </td>
                        <td scope="col">${evento.nombrezona}</td>
                        <td scope="col">${evento.horainicio?.substring(0,5)}</td>
                        <td scope="col">${evento.horafin?.substring(0,5)}</td>
                        <td scope="col">${evento.estado}</td>
                    </tr>
                `
            })
        }

        // Insertar las filas en el contenedor
        contenedorEventos.innerHTML = filas

        // Agregar listener para mostrar/ocultar descripción
        document.querySelectorAll('.btn-expandir').forEach((boton) => {
            boton.addEventListener('click', (e) => {
                e.preventDefault()
                const contenedor = e.target.closest('.descripcion')
                const texto = contenedor.querySelector('.btn-texto')
                const icono = contenedor.querySelector('.btn-icono')
                const descripcionTexto = contenedor.querySelector('.descripcion-texto')
                
                // Obtener el texto completo del atributo data-texto-completo
                const textoCompleto = boton.getAttribute('data-texto-completo')
                
                // Alternar estado expandido
                const estaExpandido = contenedor.classList.contains('expandida')
                contenedor.classList.toggle('expandida')
                
                // Actualizar contenido del texto según el estado
                if (estaExpandido) {
                    // Contraer: mostrar texto truncado
                    descripcionTexto.textContent = truncarTexto(textoCompleto)
                    texto.textContent = 'Mostrar más'
                    icono.textContent = '▼'
                    boton.setAttribute('aria-expanded', 'false')
                } else {
                    // Expandir: mostrar texto completo
                    descripcionTexto.textContent = textoCompleto
                    texto.textContent = 'Mostrar menos'
                    icono.textContent = '▲'
                    boton.setAttribute('aria-expanded', 'true')
                }
                
                // Scroll suave hacia el botón si está expandiendo
                if (!estaExpandido) {
                    setTimeout(() => {
                        boton.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
                    }, 100)
                }
            })
        })
    } catch (error) {
        console.log(error)
    }
}

