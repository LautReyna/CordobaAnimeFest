// Importaciones de utilidades
import { mostrarMensaje } from "../recursos/utilidades.js"

// Variable global para almacenar el ID del stand actual
export let idStand = null

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

// Función para renderizar el formulario por nombre de stand
export async function renderizarFormularioPorNombre(datosStands, formulario, mensajes){
    let nombreStand = formulario.nombre
    
    // Remover listener anterior para evitar duplicados
    nombreStand.removeEventListener('input', nombreStand._handler || (() => {}))

    // Handler para buscar stand por nombre
    const handler = () =>{
        const nombreBuscado = nombreStand.value.trim().toLowerCase()
        const stand = datosStands.find(e => e.nombre.toLowerCase() === nombreBuscado)
    
        if(stand){
            // Stand encontrado - llenar el formulario
            idStand = stand.idstand
    
            formulario.nombre.value = stand.nombre
            formulario.descripcion.value = stand.descripcion
            formulario.ubicacion.value = stand.idzona
    
            mostrarMensaje(mensajes, `Se encontro un stand con este nombre: ${formulario.nombre.value}`)
        }else{
            // Stand no encontrado - limpiar el ID
            idStand = null
        }
    }

    nombreStand._handler = handler
    nombreStand.addEventListener('input', handler)
}

// Función para renderizar el listado de stands
export async function renderizarListadoStands(datosStands, contenedorId) {
    try {
        const contenedorStands = document.getElementById(contenedorId)
        let filas = ''

        // Verificar si hay stands registrados
        if (!datosStands || datosStands.length === 0) {
            filas = `
                <tr>
                    <td colspan="6" class="text-center text-muted">
                        No hay stands registrados
                    </td>
                </tr>
            `
        } else {
            // Crear filas para cada stand
            datosStands.forEach((stand) => {
                const necesitaBoton = necesitaBotonExpansion(stand.descripcion)
                const textoMostrar = necesitaBoton ? truncarTexto(stand.descripcion) : stand.descripcion
                
                filas += `
                    <tr>
                        <td scope="col">${stand.nombre}</td>
                        <td scope="col">
                            <div class="descripcion ${necesitaBoton ? '' : 'sin-boton'}">
                                <p class="descripcion-texto">${textoMostrar}</p>
                                ${necesitaBoton ? `
                                    <button class="btn-expandir" type="button" aria-expanded="false" data-texto-completo="${stand.descripcion}">
                                        <span class="btn-texto">Mostrar más</span>
                                        <span class="btn-icono">▼</span>
                                    </button>
                                ` : ''}
                            </div>
                        </td>
                        <td scope="col">${stand.nombrezona}</td>
                    </tr>
                `
            })
        }

        // Insertar las filas en el contenedor
        contenedorStands.innerHTML = filas

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
