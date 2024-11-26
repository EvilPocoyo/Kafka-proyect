<?php
require_once __DIR__ . '/vendor/autoload.php';

$conf = new RdKafka\Conf();
$conf->set('group.id', 'mygroup-' . uniqid());
$conf->set('metadata.broker.list', 'kafka:9092');
$conf->set('auto.offset.reset', 'earliest');

$consumer = new RdKafka\KafkaConsumer($conf);
$consumer->subscribe(['incoming-data']);

// Inicializar el filtro
$profanityFilter = new ProfanityFilter();

echo "Iniciando consumidor de filtrado...\n";

while (true) {
    $message = $consumer->consume(10000);
    switch ($message->err) {
        case RD_KAFKA_RESP_ERR_NO_ERROR:
            $data = json_decode($message->payload, true);
            echo "Mensaje recibido: " . $message->payload . "\n";
            
            $result = $profanityFilter->checkText($data['mensaje']);
            
            if ($result['hasProfanity']) {
                echo "¡Palabra prohibida encontrada!\n";
                echo "Mensaje original: " . $data['mensaje'] . "\n";
                echo "Mensaje limpio: " . $result['cleanText'] . "\n";
            } else {
                echo "Mensaje sin palabras prohibidas.\n";
            }
            
            if (isset($result['error'])) {
                echo "Error en el filtrado: " . $result['error'] . "\n";
            }

            // Mostrar estadísticas del caché
            echo "Tamaño actual del caché: " . $profanityFilter->getCacheSize() . " entradas\n";
            break;

        case RD_KAFKA_RESP_ERR__PARTITION_EOF:
            echo "No más mensajes; esperando...\n";
            break;

        case RD_KAFKA_RESP_ERR__TIMED_OUT:
            echo "Tiempo de espera agotado; no se recibieron mensajes.\n";
            break;

        default:
            echo "Error: " . $message->errstr() . "\n";
            break;
    }
}