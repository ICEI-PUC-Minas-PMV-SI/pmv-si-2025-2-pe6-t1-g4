<?php
namespace App\Core;

use Symfony\Component\Routing\RouteCollection;
use Symfony\Component\Routing\Route;

class Router {
    public static function loadRoutes() {
        $routes = new RouteCollection();
        require __DIR__ . '/../Routes/api.php';
        return $routes;
    }
}
