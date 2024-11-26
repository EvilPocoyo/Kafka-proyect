document.addEventListener('DOMContentLoaded', function () {
    const chartCanvas = document.getElementById('badWordsChart'); // Referencia al canvas de la gráfica
    const refreshButton = document.getElementById('updateChartBtn'); // Botón para actualizar la gráfica
    const lastUpdated = document.getElementById('lastUpdate'); // Elemento donde se muestra la última actualización
    let chartInstance; // Variable para guardar la instancia de la gráfica

    // Función para obtener los datos del backend y actualizar la gráfica
    async function updateChart() {
        try {
            console.log('Obteniendo datos para la gráfica...');
            const response = await fetch('http://localhost:80/get_bad_messages.php'); // Cambia la URL si es necesario
            if (!response.ok) {
                throw new Error(`Error al obtener datos: ${response.status}`);
            }

            const data = await response.json(); // Convertir la respuesta a JSON
            console.log('Datos recibidos:', data);

            if (data.length === 0) { // Verifica si no hay datos
                alert('No hay datos disponibles para mostrar.');
                return;
            }

            // Procesar los datos para construir la gráfica
            const userCounts = data.reduce((acc, message) => {
                acc[message.usuario] = (acc[message.usuario] || 0) + 1; // Contar mensajes por usuario
                return acc;
            }, {});

            const chartData = {
                labels: Object.keys(userCounts), // Usuarios como etiquetas
                datasets: [{
                    label: 'Mensajes con Groserías por Usuario',
                    data: Object.values(userCounts), // Valores de la cantidad de mensajes
                    backgroundColor: 'rgba(75, 192, 192, 0.6)', // Color de fondo
                    borderColor: 'rgba(75, 192, 192, 1)', // Color de borde
                    borderWidth: 1 // Grosor del borde
                }]
            };

            // Destruir la gráfica anterior si ya existe
            if (chartInstance) {
                chartInstance.destroy();
            }

            // Crear una nueva instancia de la gráfica
            chartInstance = new Chart(chartCanvas, {
                type: 'bar', // Tipo de gráfica (barras)
                data: chartData,
                options: {
                    responsive: true, // Hacer la gráfica responsiva
                    maintainAspectRatio: false, // Permitir ajuste dinámico del tamaño
                    scales: {
                        y: {
                            beginAtZero: true, // Empezar el eje Y desde 0
                            ticks: {
                                stepSize: 1 // Incremento de los valores en el eje Y
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            display: true, // Mostrar la leyenda
                            position: 'top' // Posición de la leyenda
                        },
                        tooltip: {
                            enabled: true // Habilitar los tooltips al pasar el cursor
                        }
                    }
                }
            });

            // Actualizar la hora de la última actualización
            const now = new Date();
            lastUpdated.textContent = `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;
            console.log('Gráfica actualizada con éxito.');
        } catch (error) {
            console.error('Error al actualizar la gráfica:', error);
            alert('Error al actualizar la gráfica. Intenta nuevamente.');
        }
    }

    // Actualizar la gráfica cuando la página cargue
    updateChart();

    // Actualizar la gráfica cuando se haga clic en el botón de refrescar
    refreshButton.addEventListener('click', updateChart);
});
