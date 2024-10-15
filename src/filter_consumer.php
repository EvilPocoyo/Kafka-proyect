<?php
require_once __DIR__ . '/vendor/autoload.php';

$conf = new RdKafka\Conf();
$conf->set('group.id', 'mygroup-' . uniqid());  // Usar un grupo único cada vez
$conf->set('metadata.broker.list', 'kafka:9092');
$conf->set('auto.offset.reset', 'earliest');  // Comenzar desde el principio del topic

$consumer = new RdKafka\KafkaConsumer($conf);
$consumer->subscribe(['incoming-data']);

$badWords = [
    'puta', 'cabrón', 'pendejo', 'mierda', 'chingada', 'culero', 'puto', 
    'perra', 'gilipollas', 'imbécil', 'estúpido', 'huevón', 'baboso', 
    'malparido', 'coño', 'jodido', 'zorra', 'idiota', 'tarado', 'mamón'
];


function containsBadWord($message, $badWords) {
    foreach ($badWords as $word) {
        if (stripos($message, $word) !== false) {
            return true;
        }
    }
    return false;
}

echo "Iniciando consumidor de filtrado...\n";

while (true) {
    $message = $consumer->consume(10000);  // Reducir el tiempo de espera a 10 segundos
    switch ($message->err) {
        case RD_KAFKA_RESP_ERR_NO_ERROR:
            $data = json_decode($message->payload, true);
            echo "Mensaje recibido: " . $message->payload . "\n";
            if (containsBadWord($data['mensaje'], $badWords)) {
                echo "¡Palabra prohibida encontrada!\n";
                file_put_contents(__DIR__ . '/bad_messages.json', json_encode($data) . "\n", FILE_APPEND);
            } else {
                echo "Mensaje sin palabras prohibidas.\n";
            }
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