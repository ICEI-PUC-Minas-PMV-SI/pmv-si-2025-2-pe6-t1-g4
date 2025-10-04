<?php
require_once __DIR__ . '/../vendor/autoload.php';

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;


// cria request do Symfony
$request = Request::createFromGlobals();
$path    = trim($request->getPathInfo(), '/'); // ex: profiles/uuid
$method  = $request->getMethod();

// rota especial de login
if ($path === 'login' && $method === 'POST') {
    $controller = new App\Controllers\AuthController();
    $response   = $controller->login($request);
    $response->send();
    exit;
}

// mapeamento das entidades para os controllers
$routes = [
    'profiles'          => App\Controllers\UsersController::class,
    'workouts'          => App\Controllers\WorkoutsController::class,
    'training'          => App\Controllers\TrainingController::class,
    'professor'         => App\Controllers\ProfessorController::class,
    'sheet'             => App\Controllers\SheetController::class,
    'sheet_training'    => App\Controllers\SheetTrainingController::class,
    'schedule_workouts' => App\Controllers\ScheduleWorkoutsController::class,
    'class'             => App\Controllers\ClassController::class,

];

// quebra a URL
$parts  = explode('/', $path);
$entity = $parts[0] ?? '';
$id     = $parts[1] ?? null;
if (isset($routes[$entity])) {
    $controllerClass = $routes[$entity];
    $controller      = new $controllerClass();

    switch ($method) {
        case 'GET':
            $response = $id
                ? $controller->show($request, $id)
                : $controller->index($request);
            break;

        case 'POST':
            if ($id) {
                $response = $controller->update($request, $id);
            }else{
                $response = $controller->store($request);
            }
            break;

        case 'PUT':
        case 'PATCH':
            if ($id) {
                $response = $controller->update($request, $id);
            } else {
                $response = new Response(
                    json_encode(['error' => 'ID obrigatório']),
                    400,
                    ['Content-Type' => 'application/json']
                );
            }
            break;

        case 'DELETE':
            if ($id) {
                $response = $controller->delete($request, $id);
            } else {
                $response = new Response(
                    json_encode(['error' => 'ID obrigatório']),
                    400,
                    ['Content-Type' => 'application/json']
                );
            }
            break;

        default:
            $response = new Response(
                json_encode(['error' => 'Method Not Allowed']),
                405,
                ['Content-Type' => 'application/json']
            );
    }
} else {
    $response = new Response(
        json_encode(['error' => 'Not Found']),
        404,
        ['Content-Type' => 'application/json']
    );
}

$response->send();
