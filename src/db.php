<?php
function getDbConnection() {
    $serverName = "db";
    $database = "master";
    $uid = "SA";
    $pwd = "YourStrong@Passw0rd";

    try {
        $conn = new PDO("sqlsrv:Server=$serverName;Database=$database", $uid, $pwd);
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        return $conn;
    } catch (PDOException $e) {
        die("Error connecting to SQL Server: " . $e->getMessage());
    }
}

// Crear la tabla usr si no existe
function createUsrTable($conn) {
    $sql = "IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='usr' AND xtype='U')
            CREATE TABLE usr (
                id INT PRIMARY KEY IDENTITY(1,1),
                usuario VARCHAR(255) NOT NULL,
                correo VARCHAR(255) NOT NULL,
                mensaje TEXT
            )";
    $conn->exec($sql);
}

// Inicializar la conexión y crear la tabla
$conn = getDbConnection();
createUsrTable($conn);