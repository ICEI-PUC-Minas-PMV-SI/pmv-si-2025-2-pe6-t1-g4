<?php
use Symfony\Component\Routing\Route;

$routes->add('login', new Route('/login', [
    '_controller' => [new App\Controllers\AuthController(), 'login']
], [], [], '', [], ['POST']));

$resources = [
    'users' => App\Controllers\UsersController::class,
    'training' => App\Controllers\TrainingController::class,
    'workouts' => App\Controllers\WorkoutsController::class,
    'professor' => App\Controllers\ProfessorController::class,
    'sheet' => App\Controllers\SheetController::class,
    'sheet_training' => App\Controllers\SheetTrainingController::class,
    'schedule_workouts' => App\Controllers\ScheduleWorkoutsController::class,
    'class' => App\Controllers\ClassController::class,
    'scheduled_classes' => App\Controllers\ScheduledClassesController::class,
    'payments' => App\Controllers\PaymentsController::class,
    'exercises' => App\Controllers\ExerciceController::class,
];

foreach ($resources as $name => $controller) {
    $routes->add($name.'_index', new Route("/$name", [
        '_controller' => [new $controller(), 'index']
    ], [], [], '', [], ['GET']));

    $routes->add($name.'_show', new Route("/$name/{id}", [
        '_controller' => [new $controller(), 'show']
    ], [], ['id' => '.+'], '', [], ['GET']));

    $routes->add($name.'_store', new Route("/$name", [
        '_controller' => [new $controller(), 'store']
    ], [], [], '', [], ['POST']));

    $routes->add($name.'_update', new Route("/$name/{id}", [
        '_controller' => [new $controller(), 'update']
    ], [], ['id' => '.+'], '', [], ['PUT', 'PATCH']));

    $routes->add($name.'_delete', new Route("/$name/{id}", [
        '_controller' => [new $controller(), 'delete']
    ], [], ['id' => '.+'], '', [], ['DELETE']));

    $routes->add($name.'_by_column', new Route("/$name/{coluna}/{id}", [
        '_controller' => [new $controller(), $controller === 'TrainingController' ? 'findByColumn' : 'show']
    ], [], ['id' => '.+'], '', [], ['GET']));
}
