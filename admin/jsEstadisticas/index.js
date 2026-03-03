// Importaciones
import { obtenerRegistros } from '../recursos/utilidades.js'

let chartInstance = null
let chartInstanceStands = null
let totales = null
let avg = null
let mode = null

// Función para renderizar el gráfico de visitas por evento
function renderizarGrafico(datos) {
    const canvas = document.getElementById('chartVisitasEventos')
    const sinDatos = document.getElementById('sin-datos')

    if (!datos || datos.length === 0) {
        canvas.closest('.chart-container').classList.add('d-none')
        sinDatos.classList.remove('d-none')
        document.getElementById('total').innerHTML = 0
        document.getElementById('promedio').innerHTML = '—'
        document.getElementById('moda').innerHTML = '—'
        return
    }

    sinDatos.classList.add('d-none')
    canvas.closest('.chart-container').classList.remove('d-none')

    const labels = datos.map(d => d.nombre)
    const visitas = datos.map(d => Number(d.visitas) || 0)
    totales = 0
    datos.forEach(d => {
        totales += Number(d.visitas)
    })
    const ranking = datos.sort((a, b) => b.visitas - a.visitas)
    mode = ranking[0].nombre
    avg = totales / datos.length

    // Destruir instancia anterior si existe
    if (chartInstance) {
        chartInstance.destroy()
    }

    const ctx = canvas.getContext('2d')
    chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels,
            datasets: [{
                label: 'Visitas',
                data: visitas,
                backgroundColor: [
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(255, 206, 86, 0.6)',
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(153, 102, 255, 0.6)',
                    'rgba(255, 159, 64, 0.6)',
                ],
                borderColor: [
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 99, 132, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: (context) => `Visitas: ${context.raw}`
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                },
                x: {
                    ticks: {
                        maxRotation: 45,
                        minRotation: 45
                    }
                }
            }
        }
    })
}

// Función para renderizar el gráfico de visitas por stand
function renderizarGraficoStands(datos) {
    const canvas = document.getElementById('chartVisitasStands')
    const sinDatos = document.getElementById('sin-datos-stands')

    if (!datos || datos.length === 0) {
        canvas.closest('.chart-container').classList.add('d-none')
        sinDatos.classList.remove('d-none')
        document.getElementById('total-stands').innerHTML = 0
        document.getElementById('promedio-stands').innerHTML = '—'
        document.getElementById('moda-stands').innerHTML = '—'
        return
    }

    sinDatos.classList.add('d-none')
    canvas.closest('.chart-container').classList.remove('d-none')

    const labels = datos.map(d => d.nombre)
    const visitas = datos.map(d => Number(d.visitas) || 0)
    const totalesStands = visitas.reduce((a, b) => a + b, 0)
    const avgStands = totalesStands / datos.length
    const ranking = [...datos].sort((a, b) => Number(b.visitas) - Number(a.visitas))
    const modeStands = ranking[0]?.nombre || '—'

    if (chartInstanceStands) {
        chartInstanceStands.destroy()
    }

    const ctx = canvas.getContext('2d')
    chartInstanceStands = new Chart(ctx, {
        type: 'bar',
        data: {
            labels,
            datasets: [{
                label: 'Visitas',
                data: visitas,
                backgroundColor: [
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(255, 159, 64, 0.6)',
                    'rgba(153, 102, 255, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(255, 206, 86, 0.6)',
                ],
                borderColor: [
                    'rgba(75, 192, 192, 1)',
                    'rgba(255, 159, 64, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 99, 132, 1)',
                    'rgba(255, 206, 86, 1)',
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: (context) => `Visitas: ${context.raw}`
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { stepSize: 1 }
                },
                x: {
                    ticks: {
                        maxRotation: 45,
                        minRotation: 45
                    }
                }
            }
        }
    })

    document.getElementById('total-stands').innerHTML = totalesStands
    document.getElementById('promedio-stands').innerHTML = avgStands.toFixed(1)
    document.getElementById('moda-stands').innerHTML = modeStands
}

// Función para cargar las estadísticas
async function cargarEstadisticas() {
    try {
        const [resEventos, resStands] = await Promise.all([
            obtenerRegistros('/api/v1/estadisticas/eventos'),
            obtenerRegistros('/api/v1/estadisticas/stands')
        ])
        const datosEventos = await resEventos.json()
        const datosStands = await resStands.json()

        renderizarGrafico(datosEventos)
        document.getElementById('total').innerHTML = totales
        document.getElementById('promedio').innerHTML = avg
        document.getElementById('moda').innerHTML = mode

        renderizarGraficoStands(datosStands)
    } catch (error) {
        console.error('Error cargando estadísticas:', error)
        document.getElementById('sin-datos').classList.remove('d-none')
        document.getElementById('sin-datos').querySelector('p').textContent =
            'Error al cargar las estadísticas. Verifica que haya una CAF activa.'
        document.querySelector('.chart-container').classList.add('d-none')
        document.getElementById('total').innerHTML = 0

        document.getElementById('sin-datos-stands').classList.remove('d-none')
        document.getElementById('sin-datos-stands').querySelector('p').textContent =
            'Error al cargar las estadísticas de stands.'
        document.querySelector('#chartVisitasStands')?.closest('.chart-container')?.classList.add('d-none')
        document.getElementById('total-stands').innerHTML = 0
    }
}

cargarEstadisticas()
