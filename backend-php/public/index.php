<?php
// backend-php/public/index.php

use Slim\Factory\AppFactory;
use Slim\Psr7\Response;
use Psr\Http\Message\ServerRequestInterface as Request;

require __DIR__ . '/../vendor/autoload.php';

// Carrega .env
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/..');
$dotenv->safeLoad();

$app = AppFactory::create();

// (opcional, mas bom ter)
$app->addRoutingMiddleware();
$app->addErrorMiddleware(true, true, true);

// 👉 carrega a função getPdo() (conexão com Supabase)
require __DIR__ . '/../src/db.php';

// Middleware de CORS (pra Expo/React Native conseguir chamar)
$app->add(function (Request $request, $handler) {
    /** @var Response $response */
    $response = $handler->handle($request);
    $response = $response
        ->withHeader('Access-Control-Allow-Origin', '*')
        ->withHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        ->withHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');

    if ($request->getMethod() === 'OPTIONS') {
        return $response->withStatus(204);
    }

    return $response;
});

// 👉 só depois de criar o $app e carregar o db.php, carrega as rotas
require __DIR__ . '/../src/routes.php';

$app->run();

