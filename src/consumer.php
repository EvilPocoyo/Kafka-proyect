<?php
require_once __DIR__ . '/vendor/autoload.php';
require_once __DIR__ . '/db.php';

$conf = new RdKafka\Conf();
$conf->set('group.id', 'myConsumerGroup');
$conf->set('metadata.broker.list', 'kafka:9092');
$conf->set('auto.offset.reset', 'earliest');

$consumer = new RdKafka\KafkaConsumer($conf);
$consumer->subscribe(['incoming-data']);

echo "Esperando mensajes...\n";

while (true) {
    $message = $consumer->consume(120000);
    switch ($message->err) {
        case RD_KAFKA_RESP_ERR_NO_ERROR:
            $data = json_decode($message->payload, true);
            echo "Procesando mensaje: " . $message->payload . "\n";
            processMessage($data);
            break;
        case RD_KAFKA_RESP_ERR__PARTITION_EOF:
            echo "No más mensajes; esperando...\n";
            break;
        case RD_KAFKA_RESP_ERR__TIMED_OUT:
            echo "Tiempo de espera agotado; esperando más mensajes...\n";
            break;
        default:
            echo "Error: " . $message->errstr() . "\n";
            break;
    }
}

function processMessage($data) {
    // Aquí puedes agregar lógica adicional de procesamiento si es necesario
    echo "Datos procesados: " . print_r($data, true) . "\n";
}