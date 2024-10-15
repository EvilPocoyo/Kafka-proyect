<?php
require_once __DIR__ . '/vendor/autoload.php';
require_once __DIR__ . '/db.php';

header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

use RdKafka\Conf;
use RdKafka\Producer;

function sendToKafka($message) {
    $conf = new Conf();
    $conf->set('metadata.broker.list', 'kafka:9092');

    $producer = new Producer($conf);
    $topic = $producer->newTopic("incoming-data");

    $topic->produce(RD_KAFKA_PARTITION_UA, 0, json_encode($message));
    $producer->flush(10000);
}

// Recibir datos del front-end
$data = json_decode(file_get_contents('php://input'), true);

if ($data && isset($data['usuario']) && isset($data['correo']) && isset($data['mensaje'])) {
    // Guardar en la base de datos
    $conn = getDbConnection();
    $stmt = $conn->prepare("INSERT INTO usr (usuario, correo, mensaje) VALUES (?, ?, ?)");
    $stmt->execute([$data['usuario'], $data['correo'], $data['mensaje']]);

    // Enviar a Kafka
    sendToKafka($data);
    echo json_encode(["status" => "success", "message" => "Datos guardados y enviados a Kafka"]);
} else {
    echo json_encode(["status" => "error", "message" => "Datos incompletos o no recibidos"]);
}