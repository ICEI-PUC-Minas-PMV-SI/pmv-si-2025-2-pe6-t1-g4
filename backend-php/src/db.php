<?php

// backend-php/src/db.php

function getPdo(): PDO
{
    static $pdo = null;
    if ($pdo !== null) {
        return $pdo;
    }

    $host = $_ENV['SUPABASE_HOST'] ?? '';
    $port = $_ENV['SUPABASE_PORT'] ?? '5432';
    $db   = $_ENV['SUPABASE_DB'] ?? 'postgres';
    $user = $_ENV['SUPABASE_USER'] ?? '';
    $pass = $_ENV['SUPABASE_PASSWORD'] ?? '';

    $dsn = "pgsql:host={$host};port={$port};dbname={$db}";

    try {
        $pdo = new PDO($dsn, $user, $pass, [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        ]);
        return $pdo;
    } catch (PDOException $e) {
        http_response_code(500);
        header('Content-Type', 'application/json');
        echo json_encode([
            'error'   => 'Erro de conexão com o banco',
            'details' => $e->getMessage(),
        ]);
        exit;
    }
}

