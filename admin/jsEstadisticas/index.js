// Importaciones
import { obtenerRegistros } from '../recursos/utilidades.js'

let chartInstance = null

// Función para renderizar el gráfico de visitas por evento
function renderizarGrafico(datos) {
    const canvas = document.getElementById('chartVisitasEventos')
    const sinDatos = document.getElementById('sin-datos')

    if (!datos || datos.length === 0) {
        canvas.closest('.chart-container').classList.add('d-none')
        sinDatos.classList.remove('d-none')
        return
    }

    sinDatos.classList.add('d-none')
    canvas.closest('.chart-container').classList.remove('d-none')

    const labels = datos.map(d => d.nombre)
    const visitas = datos.map(d => Number(d.visitas) || 0)

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

// Función para cargar las estadísticas
async function cargarEstadisticas() {
    try {
        const res = await obtenerRegistros('/api/v1/estadisticas/eventos')
        const datos = await res.json()
        renderizarGrafico(datos)
    } catch (error) {
        console.error('Error cargando estadísticas:', error)
        document.getElementById('sin-datos').classList.remove('d-none')
        document.getElementById('sin-datos').querySelector('p').textContent =
            'Error al cargar las estadísticas. Verifica que haya una CAF activa.'
        document.querySelector('.chart-container').classList.add('d-none')
    }
}

cargarEstadisticas()
