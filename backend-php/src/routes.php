<?php
// backend-php/src/routes.php

use Slim\App;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Message\ResponseInterface as Response;

require_once __DIR__ . '/db.php';

/** @var App $app */

// Health check
$app->get('/api/ping', function (Request $request, Response $response) {
    $response->getBody()->write(json_encode([
        'status'  => 'ok',
        'message' => 'TrainerHub API PHP rodando',
    ]));
    return $response->withHeader('Content-Type', 'application/json');
});

// -----------------------------------------------------------------------------
// GET /api/profiles/{id}  -> perfil + email (tabela profiles + auth.users)
// -----------------------------------------------------------------------------
$app->get('/api/profiles/{id}', function (Request $request, Response $response, array $args) {
    $id  = $args['id']; // uuid em texto
    $pdo = getPdo();

    $sql = "
        select 
            p.id,
            p.role,
            p.full_name,
            p.cpf,
            p.phone,
            p.peso_kg,
            p.altura_cm,
            p.genero,
            p.data_nascimento,
            p.created_at,
            p.updated_at,
            u.email
        from profiles p
        join auth.users u on u.id = p.id
        where p.id = :id
        limit 1
    ";

    $stmt = $pdo->prepare($sql);
    $stmt->execute([':id' => $id]);
    $profile = $stmt->fetch();

    if (!$profile) {
        $response->getBody()->write(json_encode(['message' => 'Profile não encontrado']));
        return $response->withStatus(404)->withHeader('Content-Type', 'application/json');
    }

    $response->getBody()->write(json_encode($profile));
    return $response->withHeader('Content-Type', 'application/json');
});

// -----------------------------------------------------------------------------
// PUT /api/profiles/{id}  -> atualiza dados básicos do perfil
// -----------------------------------------------------------------------------
$app->put('/api/profiles/{id}', function (Request $request, Response $response, array $args) {
    $id  = $args['id'];
    $pdo = getPdo();

    // Lê JSON enviado pelo app
    $body = (string) $request->getBody();
    $data = json_decode($body, true) ?? [];

    $fullName        = $data['full_name']        ?? null;
    $phone           = $data['phone']            ?? null;
    $alturaCm        = $data['altura_cm']        ?? null;
    $pesoKg          = $data['peso_kg']          ?? null;
    $dataNascimento  = $data['data_nascimento']  ?? null; // formato yyyy-mm-dd

    try {
        $sql = "
            update profiles
            set full_name       = :full_name,
                phone           = :phone,
                altura_cm       = :altura_cm,
                peso_kg         = :peso_kg,
                data_nascimento = :data_nascimento,
                updated_at      = now()
            where id = :id
        ";

        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            ':full_name'       => $fullName,
            ':phone'           => $phone,
            ':altura_cm'       => $alturaCm,
            ':peso_kg'         => $pesoKg,
            ':data_nascimento' => $dataNascimento,
            ':id'              => $id,
        ]);

        $response->getBody()->write(json_encode(['status' => 'ok']));
        return $response->withHeader('Content-Type', 'application/json');

    } catch (\Throwable $e) {
        $response->getBody()->write(json_encode([
            'error'   => 'Erro ao atualizar perfil',
            'details' => $e->getMessage(),
        ]));
        return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
    }
});

// -----------------------------------------------------------------------------
// GET /api/alunos/{alunoId}/treinos  -> lista as training_sheets do aluno
// -----------------------------------------------------------------------------
$app->get('/api/alunos/{alunoId}/treinos', function (Request $request, Response $response, array $args) {
    $alunoId = $args['alunoId'];
    $pdo     = getPdo();

    $sql = "
        select
            ts.id,
            ts.aluno_id,
            ts.professor_id,
            ts.workout_id,
            ts.status,
            ts.created_at,
            w.name      as workout_name,
            w.level     as workout_level,
            prof.full_name as professor_name
        from training_sheets ts
        left join workouts w   on w.id = ts.workout_id
        left join profiles prof on prof.id = ts.professor_id
        where ts.aluno_id = :aluno_id
        order by ts.created_at desc
    ";

    $stmt = $pdo->prepare($sql);
    $stmt->execute([':aluno_id' => $alunoId]);
    $rows = $stmt->fetchAll();

    $response->getBody()->write(json_encode($rows));
    return $response->withHeader('Content-Type', 'application/json');
});

// -----------------------------------------------------------------------------
// GET /api/treinos/{sheetId}  -> detalhe do treino + exercícios
// -----------------------------------------------------------------------------
$app->get('/api/treinos/{sheetId}', function (Request $request, Response $response, array $args) {
    $sheetId = $args['sheetId'];
    $pdo     = getPdo();

    // 1. Dados do treino (ficha)
    $sqlSheet = "
        select
            ts.id,
            ts.aluno_id,
            ts.professor_id,
            ts.workout_id,
            ts.status,
            ts.created_at,
            w.name           as workout_name,
            w.level          as workout_level,
            aluno.full_name  as aluno_name,
            prof.full_name   as professor_name
        from training_sheets ts
        left join workouts  w     on w.id = ts.workout_id
        left join profiles  aluno on aluno.id = ts.aluno_id
        left join profiles  prof  on prof.id = ts.professor_id
        where ts.id = :id
        limit 1
    ";

    $stmtSheet = $pdo->prepare($sqlSheet);
    $stmtSheet->execute([':id' => $sheetId]);
    $sheet = $stmtSheet->fetch();

    if (!$sheet) {
        $response->getBody()->write(json_encode(['message' => 'Treino não encontrado']));
        return $response->withStatus(404)->withHeader('Content-Type', 'application/json');
    }

    // 2. Exercícios da ficha
    $sqlExercises = "
        select
            se.id,
            se.ordem,
            se.series,
            se.repeticoes,
            se.carga,
            se.descanso_segundos,
            se.observacoes,
            e.id           as exercise_id,
            e.name         as exercise_name,
            e.muscle_group as exercise_muscle_group,
            e.description  as exercise_description
        from sheet_exercises se
        join exercises e on e.id = se.exercise_id
        where se.sheet_id = :sheet_id
        order by se.ordem asc
    ";

    $stmtEx = $pdo->prepare($sqlExercises);
    $stmtEx->execute([':sheet_id' => $sheetId]);
    $exercises = $stmtEx->fetchAll();

    $payload = [
        'treino'     => $sheet,
        'exercicios' => $exercises,
    ];

    $response->getBody()->write(json_encode($payload));
    return $response->withHeader('Content-Type', 'application/json');
});
