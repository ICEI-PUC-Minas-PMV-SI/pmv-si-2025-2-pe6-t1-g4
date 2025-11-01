<?php
namespace App\Core;

class Database {
    private $baseUrl;
    private $anonKey;
    private $serviceKey;
    public function __construct() {
        $this->baseUrl     = getenv("SUPABASE_URL") ?: "https://vvhzdmcfoswxextqvsct.supabase.co/rest/v1/";
        $this->anonKey     = getenv("SUPABASE_ANON_KEY") ?: "";
        $this->serviceKey  = getenv("SUPABASE_SERVICE_KEY") ?: "";
    }

    private function request($method, $endpoint, $data = null, $filters = [], $useServiceRole = false) {
        $url = rtrim($this->baseUrl, "/") . "/" . ltrim($endpoint, "/");

        if (!empty($filters)) {
            $query = http_build_query($filters);
            $url .= "?" . $query;
        }

        $ch = curl_init($url);

        $headers = [
            "apikey: {$this->anonKey}",
            "Content-Type: application/json",
            "Accept: application/json"
        ];

        if ($useServiceRole) {
            $headers[] = "Authorization: Bearer {$this->serviceKey}";
        } else {
            $userToken = $this->getUserToken();
            if ($userToken) {
                $headers[] = "Authorization: Bearer {$userToken}";
            }
        }

        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

        if ($data) {
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
        }

        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);

        $response = curl_exec($ch);
        if ($response === false) {
            throw new \Exception("Curl error: " . curl_error($ch));
        }

        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        $decoded = json_decode($response, true);

        return [
            "status" => $httpCode,
            "data"   => $decoded
        ];
    }

    // CRUD Genérico -------------------
    public function get($table, $filters = []) {
        $res = $this->request("GET", $table, null, $filters);
        return $res["data"];
    }

    public function getById($table, $id) {
        $id = trim($id);

        if (!preg_match('/^[0-9a-fA-F-]{36}$/', $id)) {
            throw new \Exception("ID inválido: $id");
        }

        $res = $this->request("GET", $table, null, ["id" => "eq.$id"]);
        return $res["data"];
    }

    public function getByColumn($table, $id, $campo){
        $id = trim($id);

        // if (!preg_match('/^[0-9a-fA-F-]{36}$/', $id)) {
        //     throw new \Exception("ID inválido: $id");
        // }

        $res = $this->request("GET", $table, null, [$campo => "eq.$id"]);
        return $res["data"];
    }

    public function insert($table, $data) {
        $res = $this->request("POST", $table, $data, [], true); // insert geralmente precisa do service role
        return $res["data"];
    }

    public function update($table, $id, $data) {
        $res = $this->request("PATCH", $table, $data, ["id" => "eq.$id"], true);
        return $res["data"];
    }

    public function delete($table, $id) {
        $res = $this->request("DELETE", $table, null, ["id" => "eq.$id"], true);
        return $res["status"] === 204;
    }

    public function getBaseUrl() {
        return $this->baseUrl;
    }

    public function getAnonKey() {
        return $this->anonKey;
    }

    public function getServiceKey() {
        return $this->serviceKey;
    }

    private function getUserToken() {
        $authHeader = null;

        if (isset($_SERVER['HTTP_AUTHORIZATION'])) {
            $authHeader = $_SERVER['HTTP_AUTHORIZATION'];
        } elseif (function_exists('apache_request_headers')) {
            $headers = apache_request_headers();
            if (isset($headers['Authorization'])) {
                $authHeader = $headers['Authorization'];
            }
        }
        if ($authHeader && preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
            return $matches[1]; 
        }
        return null;
    }

}
