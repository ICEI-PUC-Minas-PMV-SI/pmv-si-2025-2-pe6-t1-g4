<?php
require_once __DIR__ . '/../vendor/autoload.php';

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\RouteCollection;
use Symfony\Component\Routing\RequestContext;
use Symfony\Component\Routing\Matcher\UrlMatcher;
use Symfony\Component\Routing\Exception\ResourceNotFoundException;

$request = Request::createFromGlobals();

$routes = new RouteCollection();
require __DIR__ . '/../app/Routes/api.php'; 

$context = new RequestContext();
$context->fromRequest($request);
$matcher = new UrlMatcher($routes, $context);

try {
    $parameters = $matcher->match($request->getPathInfo());

    $controller = $parameters['_controller'];
    unset($parameters['_controller'], $parameters['_route']);

    if (isset($parameters['coluna'], $parameters['id'])) {
        $method = 'findByColumn';
        $parameters = [
            'request' => $request,
            'column'  => $parameters['coluna'],
            'id'      => $parameters['id']
        ];
        $response = call_user_func_array([new $controller[0], $method], $parameters);
    } else {
        $response = call_user_func_array($controller, array_merge([$request], $parameters));
    }

    $response->send();

} catch (ResourceNotFoundException $e) {
    $response = new Response(json_encode(['error' => 'Not Found']), 404, ['Content-Type' => 'application/json']);
    $response->send();

} catch (Exception $e) {
    $response = new Response(json_encode(['error' => 'Internal Server Error', 'message' => $e->getMessage()]), 500, ['Content-Type' => 'application/json']);
    $response->send();
}
