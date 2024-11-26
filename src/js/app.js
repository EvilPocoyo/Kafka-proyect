document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('messageForm');
    const chart = document.getElementById('badWordsChart');
    const updateButton = document.getElementById('updateChartBtn');
    let myChart;

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const data = {
            usuario: document.getElementById('usuario').value,
            correo: document.getElementById('correo').value,
            mensaje: document.getElementById('mensaje').value
        };

        fetch('http://localhost:80/producer.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(result => {
            console.log('Respuesta del servidor:', result);
            alert(result.message);
            form.reset();
            updateChart();
        })
        .catch(error => {
            console.error('Error al enviar mensaje:', error);
            alert('Error al enviar mensaje. Por favor, intenta de nuevo.');
        });
    });

    function updateChart() {
        console.log('Actualizando gráfica...');
        fetch('http://localhost:80/get_bad_messages.php')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log('Datos recibidos:', data);
                if (data.length === 0) {
                    console.log('No hay datos para mostrar');
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

                if (myChart) {
                    myChart.destroy();
                }

                myChart = new Chart(chart, {
                    type: 'bar',
                    data: chartData,
                    options: {
                        scales: {
                            y: {
                                beginAtZero: true,
                                stepSize: 1
                            }
                        }
                    }
                });
                console.log('Gráfica actualizada');
            })
            .catch(error => console.error('Error al actualizar la gráfica:', error));
    }

    updateButton.addEventListener('click', updateChart);

    // Actualizar la gráfica al cargar la página
    updateChart();
});