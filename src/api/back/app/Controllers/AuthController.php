<?php
namespace App\Controllers;

use App\Core\Database;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

class AuthController {
    private $db;

    public function __construct() {
        $this->db = new Database();
    }

    public function login(Request $request) {
        $data = json_decode($request->getContent(), true);

        $email = $data['email'] ?? null;
        $password = $data['password'] ?? null;

        if (!$email || !$password) {
            return new Response(json_encode(["error" => "Email e senha obrigatórios"]), 400, ["Content-Type" => "application/json"]);
        }

        $url = "https://vvhzdmcfoswxextqvsct.supabase.co/auth/v1/token?grant_type=password";

        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            "apikey: {$this->db->getAnonKey()}",
            "Content-Type: application/json"
        ]);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
            "email" => $email,
            "password" => $password
        ]));

        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        $response = curl_exec($ch);

        if ($response === false) {
            return new Response(json_encode(["error" => curl_error($ch)]), 500, ["Content-Type" => "application/json"]);
        }

        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        return new Response($response, $httpCode, ["Content-Type" => "application/json"]);
    }
}
