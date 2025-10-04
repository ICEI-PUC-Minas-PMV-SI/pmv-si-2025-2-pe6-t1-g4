<?php
namespace App\Controllers;

use App\Core\Database;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;


class TrainingController {
    private $db;
    private $table = 'training_sheets';

    public function __construct() {
        $this->db = new Database();
    }

    public function index(Request $request) {
        $providerSheetExercises = new SheetController();
        $providerExercises = new ExerciceController();


        $data = $this->db->get($this->table);
        foreach ($data as $keyFicha => $ficha) {
            $data[$keyFicha]['series'] = $providerSheetExercises->getByColumn($request,$ficha['id'] ,'sheet_id');
            foreach ($data[$keyFicha]['series'] as $key2 => $serie) {
                $data[$keyFicha]['series'][$key2]['exercicio'] = $providerExercises->getByColumn($request, $serie['exercise_id'], 'id')[0];
            }

        }

        return new Response(json_encode($data), 200, ['Content-Type' => 'application/json']);
    }

    public function show(Request $request, $id) {
        $providerSheetExercises = new SheetController();
        $providerExercises = new ExerciceController();

        $data = $this->db->getById($this->table, $id)[0];

        $data['series'] = $providerSheetExercises->getByColumn($request,$data['id'] ,'sheet_id');

        foreach ($data['series'] as $key => $value) {
             $data['series'][$key]['exercicio'] = $providerExercises->getByColumn($request, $value['exercise_id'], 'id')[0];
        }
        return new Response(json_encode($data), 200, ['Content-Type' => 'application/json']);
    }

    public function studentSheets(Request $request, $idAluno){
        $data = $this->db->get($this->table);
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
}
