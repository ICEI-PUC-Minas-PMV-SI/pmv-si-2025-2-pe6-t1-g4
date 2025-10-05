<?php
namespace App\Controllers;

use App\Core\Database;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

class ProfessorController {
    private $db;
    private $table = 'profiles';

    public function __construct() {
        $this->db = new Database();
    }

    public function index(Request $request) {
        $data = $this->db->get($this->table . '?role=eq.professor');
        return new Response(json_encode($data), 200, ['Content-Type' => 'application/json']);
    }
}
