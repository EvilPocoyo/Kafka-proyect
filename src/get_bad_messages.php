<?php
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

$messages = file_get_contents(__DIR__ . '/bad_messages.json');
$messages = explode("\n", trim($messages));
$messages = array_map('json_decode', $messages);

echo json_encode(array_filter($messages));