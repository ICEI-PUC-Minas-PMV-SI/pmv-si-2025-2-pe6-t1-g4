<?php
use Symfony\Component\Routing\Route;
use App\Controllers\AuthController;


$routes->add('login', new Route('/login', [
    '_controller' => [new AuthController(), 'login']
], [], [], '', [], ['POST']));

$resources = [

];

foreach ($resources as $name => $controller) {
    $routes->add($name.'_index', new Route('/'.$name, ['_controller' => [new $controller(), 'index']], [], [], '', [], ['GET']));
    $routes->add($name.'_show', new Route('/'.$name.'/{id}', ['_controller' => [new $controller(), 'show']], [], [], '', [], ['GET']));
    $routes->add($name.'_store', new Route('/'.$name, ['_controller' => [new $controller(), 'store']], [], [], '', [], ['POST']));
    $routes->add($name.'_update', new Route('/'.$name.'/{id}', ['_controller' => [new $controller(), 'update']], [], [], '', [], ['PUT']));
    $routes->add($name.'_delete', new Route('/'.$name.'/{id}', ['_controller' => [new $controller(), 'delete']], [], [], '', [], ['DELETE']));
}
