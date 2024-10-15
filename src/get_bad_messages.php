<?php
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once __DIR__ . '/db.php';

$conn = getDbConnection();
$stmt = $conn->query("SELECT * FROM usr WHERE mensaje IS NOT NULL");
$messages = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($messages);
