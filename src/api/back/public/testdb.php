<?php
$host = "";
$port = "";
$dbname = "";
$user = "";
$password = "";

try {
    $dsn = "pgsql:host=$host;port=$port;dbname=$dbname;sslmode=require";
    $pdo = new PDO($dsn, $user, $password, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);

    echo "Conexão bem-sucedida com o Supabase!<br>";

    $stmt = $pdo->query("SELECT NOW()");
    $row = $stmt->fetch();
    echo "Hora no banco: " . $row['now'];

} catch (PDOException $e) {
    echo "Erro de conexão: " . $e->getMessage();
}