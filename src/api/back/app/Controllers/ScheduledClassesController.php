<?php
namespace App\Controllers;

use App\Core\Database;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

class ScheduledClassesController {
    private $db;
    private $table = 'class_bookings';

    public function __construct() {
        $this->db = new Database();
    }

    public function index(Request $request) {
        $data = $this->db->get($this->table);
        return new Response(json_encode($data), 200, ['Content-Type' => 'application/json']);
    }

    public function show(Request $request, $id) {
        $data = $this->db->getById($this->table, $id);
        return new Response(json_encode($data), 200, ['Content-Type' => 'application/json']);
    }

    public function store(Request $request) {
        $data = json_decode($request->getContent(), true);
        $inserted = $this->db->insert($this->table, $data);
        return new Response(json_encode($inserted), 201, ['Content-Type' => 'application/json']);
    }

    public function update(Request $request, $id) {
        $data = json_decode($request->getContent(), true);
        $updated = $this->db->update($this->table, $id, $data);
        return new Response(json_encode($updated), 200, ['Content-Type' => 'application/json']);
    }

    public function delete(Request $request, $id) {
        $deleted = $this->db->delete($this->table, $id);
        return new Response(json_encode($deleted), 200, ['Content-Type' => 'application/json']);
    }

    public function findByColumn(Request $request, $column, $id) {
        $providerClass = new ClassController();

        $data = $this->db->getByColumn($this->table, $id, $column);
        foreach ($data as $key => $agendamento) {
            $classe = $providerClass->getByColumn($request,$agendamento['class_id'] ,'id');
            $data[$key]['classe'] = $classe[0]['titulo'];
            
        }
        return new Response(json_encode($data), 200, ['Content-Type' => 'application/json']);
    }

    public function getByColumn(Request $request, $id, $campo){
        return $this->db->getByColumn($this->table, $id,$campo);
    }


}
