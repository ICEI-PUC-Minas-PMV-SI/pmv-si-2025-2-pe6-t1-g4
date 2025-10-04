<?php
use Symfony\Component\Routing\Route;
use App\Controllers\AuthController;
use App\Controllers\UsersController;
use App\Controllers\WorkoutsController;
use App\Controllers\TrainingController;
use App\Controllers\ProfessorController;
use App\Controllers\UsersController;
use App\Controllers\SheetController;
use App\Controllers\SheetTrainingController;
use App\Controllers\ScheduleWorkoutsController;
use App\Controllers\ClassController;

$routes->add('login', new Route('/login', [
    '_controller' => [new AuthController(), 'login']
], [], [], '', [], ['POST']));

 


$resources = [
    'users' => UsersController::class,
    'workouts' => WorkoutsController::class,
    'training' => TrainingController::class,
    'professor' => ProfessorController::class,
    'sheet' => SheetController::class,
    'sheet_training' => SheetTrainingController::class,
    'schedule_workouts' => ScheduleWorkoutsController::class,
    'class' => ClassController::class,

];

foreach ($resources as $name => $controller) {
    $routes->add($name.'_index', new Route('/'.$name, ['_controller' => [new $controller(), 'index']], [], [], '', [], ['GET']));
    $routes->add($name.'_show', new Route('/'.$name.'/{id}', ['_controller' => [new $controller(), 'show']], [], [], '', [], ['GET']));
    $routes->add($name.'_store', new Route('/'.$name, ['_controller' => [new $controller(), 'store']], [], [], '', [], ['POST']));
    $routes->add($name.'_update', new Route('/'.$name.'/{id}', ['_controller' => [new $controller(), 'update']], [], [], '', [], ['PUT']));
    $routes->add($name.'_delete', new Route('/'.$name.'/{id}', ['_controller' => [new $controller(), 'delete']], [], [], '', [], ['DELETE']));
}
