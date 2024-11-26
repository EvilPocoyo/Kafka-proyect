document.addEventListener('DOMContentLoaded', function () {
    const chartCanvas = document.getElementById('badWordsChart');
    const refreshButton = document.getElementById('updateChartBtn');
    const lastUpdated = document.getElementById('lastUpdate');
    let chartInstance;

    async function updateChart() {
        try {
            console.log('Obteniendo datos para la gráfica...');
            // Corregida la URL para incluir /api/
            const response = await fetch('http://localhost/api/get_bad_messages.php', {
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`Error al obtener datos: ${response.status}`);
            }

            const data = await response.json();
            console.log('Datos recibidos:', data);

            if (data.length === 0) {
                console.log('No hay datos disponibles');
                if (chartInstance) {
                    chartInstance.destroy();
                }
                lastUpdated.textContent = 'No hay datos disponibles';
                return;
            }

            const userCounts = data.reduce((acc, message) => {
                acc[message.usuario] = (acc[message.usuario] || 0) + 1;
                return acc;
            }, {});

            const chartData = {
                labels: Object.keys(userCounts),
                datasets: [{
                    label: 'Mensajes con Groserías por Usuario',
                    data: Object.values(userCounts),
                    backgroundColor: 'rgba(75, 192, 192, 0.6)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                }]
            };

            if (chartInstance) {
                chartInstance.destroy();
            }

            chartInstance = new Chart(chartCanvas, {
                type: 'bar',
                data: chartData,
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                stepSize: 1
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            display: true,
                            position: 'top'
                        },
                        tooltip: {
                            enabled: true,
                            callbacks: {
                                label: function(context) {
                                    return `Mensajes: ${context.parsed.y}`;
                                }
                            }
                        }
                    }
                }
            });

            const now = new Date();
            lastUpdated.textContent = `Última actualización: ${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;
            console.log('Gráfica actualizada con éxito.');
        } catch (error) {
            console.error('Error al actualizar la gráfica:', error);
            lastUpdated.textContent = `Error: ${error.message}`;
            
            // Limpiar la gráfica si hay error
            if (chartInstance) {
                chartInstance.destroy();
                chartInstance = null;
            }
        }
    }

    // Actualización inicial
    updateChart();

    // Manejador de eventos para el botón de actualizar
    refreshButton.addEventListener('click', () => {
        console.log('Actualizando gráfica manualmente...');
        updateChart();
    });

    //Actualización automática cada cierto tiempo (por ejemplo, cada 30 segundos)
    setInterval(updateChart, 30000);
});