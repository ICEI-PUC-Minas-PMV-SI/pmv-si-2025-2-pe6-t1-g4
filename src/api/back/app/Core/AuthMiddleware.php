<?php
namespace App\Middleware;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Controllers\AuthController;

class AuthMiddleware {
    public function handle(Request $request, $next) {
        $authHeader = $request->headers->get('Authorization');
        if (!AuthController::validateToken($authHeader)) {
            return new Response(json_encode(['error' => 'Unauthorized']), 401, ['Content-Type' => 'application/json']);
        }
        return $next($request);
    }
}
