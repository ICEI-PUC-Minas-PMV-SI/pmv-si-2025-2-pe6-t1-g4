<?php
// backend-php/src/routes.php

use Slim\App;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Message\ResponseInterface as Response;

require_once __DIR__ . '/db.php';

// helper genérico pra respostas JSON
function jsonResponse(Response $response, array $data, int $status = 200): Response {
    $response->getBody()->write(json_encode($data));
    return $response
        ->withStatus($status)
        ->withHeader('Content-Type', 'application/json');
}

// rotas de auth (login, register, etc.)
require_once __DIR__ . '/routes_auth.php';

/** @var App $app */

// -----------------------------------------------------------------------------
// Health check
// -----------------------------------------------------------------------------
$app->get('/api/ping', function (Request $request, Response $response) {
    return jsonResponse($response, [
        'status'  => 'ok',
        'message' => 'TrainerHub API PHP rodando',
    ]);
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
            p.avatar_url,
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
    $profile = $stmt->fetch(\PDO::FETCH_ASSOC);

    if (!$profile) {
        return jsonResponse($response, ['message' => 'Profile não encontrado'], 404);
    }

    return jsonResponse($response, $profile);
});


// -----------------------------------------------------------------------------
// PUT /api/profiles/{id}  -> atualiza dados básicos do perfil + avatar_url
// -----------------------------------------------------------------------------
$app->put('/api/profiles/{id}', function (Request $request, Response $response, array $args) {
    $id  = $args['id'];
    $pdo = getPdo();

    // Lê JSON enviado pelo app
    $body = (string) $request->getBody();
    $data = json_decode($body, true) ?? [];

    $fullName       = $data['full_name']       ?? null;
    $phone          = $data['phone']           ?? null;
    $alturaCm       = $data['altura_cm']       ?? null;
    $pesoKg         = $data['peso_kg']         ?? null;
    $dataNascimento = $data['data_nascimento'] ?? null; // formato yyyy-mm-dd

    // avatar_url pode vir null; se não vier no JSON, forçamos null
    $avatarUrl = array_key_exists('avatar_url', $data)
        ? $data['avatar_url']
        : null;

    try {
        $sql = "
            update profiles
            set full_name       = :full_name,
                phone           = :phone,
                altura_cm       = :altura_cm,
                peso_kg         = :peso_kg,
                data_nascimento = :data_nascimento,
                avatar_url      = :avatar_url,
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
            ':avatar_url'      => $avatarUrl,
            ':id'              => $id,
        ]);

        return jsonResponse($response, ['status' => 'ok']);

    } catch (\Throwable $e) {
        return jsonResponse($response, [
            'error'   => 'Erro ao atualizar perfil',
            'details' => $e->getMessage(),
        ], 500);
    }
});


// ============================================================================
// TREINOS
// ============================================================================

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
            w.name         as workout_name,
            w.level        as workout_level,
            w.cover_url    as workout_cover_url,
            w.description  as workout_description,
            prof.full_name as professor_name
        from training_sheets ts
        left join workouts w    on w.id = ts.workout_id
        left join profiles prof on prof.id = ts.professor_id
        where ts.aluno_id = :aluno_id
        order by ts.created_at desc
    ";

    $stmt = $pdo->prepare($sql);
    $stmt->execute([':aluno_id' => $alunoId]);
    $rows = $stmt->fetchAll(\PDO::FETCH_ASSOC);

    return jsonResponse($response, $rows);
});


// -----------------------------------------------------------------------------
// GET /api/treinos/{id}  -> detalhe de UM treino (sheet + exercícios)
// -----------------------------------------------------------------------------
$app->get('/api/treinos/{id}', function (Request $request, Response $response, array $args) {
    $treinoId = $args['id']; // <- é o id da training_sheets (ts.id)
    $pdo      = getPdo();

    try {
        $sql = "
            select
                ts.id                 as treino_id,
                ts.status             as treino_status,
                ts.created_at         as treino_created_at,

                w.id                  as workout_id,
                w.name                as workout_name,
                w.level               as workout_level,
                w.description         as workout_description,

                p.full_name           as professor_name,

                se.id                 as sheet_exercise_id,
                se.ordem,
                se.series,
                se.repeticoes,
                se.carga,
                se.descanso_segundos,
                se.image_url,

                e.id                  as exercise_id,
                e.name                as exercise_name,
                e.muscle_group        as exercise_muscle_group,
                e.description         as exercise_description
            from training_sheets ts
            join workouts w           on w.id = ts.workout_id
            join profiles p           on p.id = ts.professor_id
            left join sheet_exercises se on se.sheet_id = ts.id
            left join exercises e     on e.id = se.exercise_id
            where ts.id = :treino_id
            order by se.ordem asc nulls last
        ";

        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            ':treino_id' => $treinoId,
        ]);

        $rows = $stmt->fetchAll(\PDO::FETCH_ASSOC);

        if (!$rows) {
            return jsonResponse($response, [
                'error'   => 'Treino não encontrado',
                'message' => 'Nenhum treino com esse id.',
            ], 404);
        }

        // monta header do treino + lista de exercícios
        $first = $rows[0];

        $treino = [
            'id'                  => $first['treino_id'],
            'status'              => $first['treino_status'],
            'created_at'          => $first['treino_created_at'],
            'workout_id'          => $first['workout_id'],
            'workout_name'        => $first['workout_name'],
            'workout_level'       => $first['workout_level'],
            'workout_description' => $first['workout_description'],
            'professor_name'      => $first['professor_name'],
        ];

        $exercicios = [];
        foreach ($rows as $r) {
            if (!$r['sheet_exercise_id']) {
                continue; // pode não ter exercícios ainda
            }
            $exercicios[] = [
                'id'                    => $r['sheet_exercise_id'],
                'exercise_id'           => $r['exercise_id'],
                'exercise_name'         => $r['exercise_name'],
                'exercise_muscle_group' => $r['exercise_muscle_group'],
                'exercise_description'  => $r['exercise_description'],
                'ordem'                 => $r['ordem'],
                'series'                => $r['series'],
                'repeticoes'            => $r['repeticoes'],
                'carga'                 => $r['carga'],
                'descanso_segundos'     => $r['descanso_segundos'],
                'image_url'             => $r['image_url'],
            ];
        }

        return jsonResponse($response, [
            'treino'     => $treino,
            'exercicios' => $exercicios,
        ]);

    } catch (\Throwable $e) {
        error_log('Erro em GET /api/treinos/{id}: ' . $e->getMessage());
        return jsonResponse($response, [
            'error'   => 'Erro ao carregar detalhe do treino',
            'details' => $e->getMessage(),
        ], 500);
    }
});


// ============================================================================
// AULAS
// ============================================================================

// -----------------------------------------------------------------------------
// GET /api/alunos/{id}/aulas  -> lista aulas agendadas do aluno
// -----------------------------------------------------------------------------
$app->get('/api/alunos/{id}/aulas', function (Request $request, Response $response, array $args) {
    $alunoId = $args['id'];
    $pdo     = getPdo();

    try {
        $sql = "
            select
              cb.id          as booking_id,
              c.id           as class_id,
              c.titulo,
              c.descricao,
              c.inicio,
              c.fim,
              c.capacidade,
              c.cover_url,
              p.full_name    as professor_name
            from class_bookings cb
            join classes       c on c.id = cb.class_id
            join profiles      p on p.id = c.professor_id
            where cb.aluno_id = :aluno_id
            order by c.inicio asc
        ";

        $stmt = $pdo->prepare($sql);
        $stmt->execute([':aluno_id' => $alunoId]);
        $rows = $stmt->fetchAll(\PDO::FETCH_ASSOC);

        return jsonResponse($response, $rows);

    } catch (\Throwable $e) {
        error_log('Erro em GET /api/alunos/{id}/aulas: ' . $e->getMessage());

        return jsonResponse($response, [
            'error'   => 'Erro ao listar aulas do aluno',
            'details' => $e->getMessage(),
        ], 500);
    }
});


// -----------------------------------------------------------------------------
// GET /api/aulas/{bookingId}/slots
// Retorna as datas/horários possíveis para remarcar uma aula desse booking
// -----------------------------------------------------------------------------
$app->get('/api/aulas/{bookingId}/slots', function (Request $request, Response $response, array $args) {
    $bookingId = $args['bookingId'] ?? null;
    $pdo       = getPdo();

    if (!$bookingId) {
        return jsonResponse($response, [
            'error'   => 'bookingId inválido',
            'message' => 'Informe o ID da reserva na URL.',
        ], 400);
    }

    try {
        // 1) Descobre a aula atual (professor + título)
        $sqlBase = "
            select
              c.id           as class_id,
              c.professor_id,
              c.titulo
            from class_bookings cb
            join classes c on c.id = cb.class_id
            where cb.id = :booking_id
            limit 1
        ";

        $stmtBase = $pdo->prepare($sqlBase);
        $stmtBase->execute([':booking_id' => $bookingId]);
        $base = $stmtBase->fetch(\PDO::FETCH_ASSOC);

        if (!$base) {
            return jsonResponse($response, [
                'error'   => 'Reserva não encontrada',
                'message' => 'Nenhuma aula encontrada para este booking.',
            ], 404);
        }

        $profId = $base['professor_id'];
        $titulo = $base['titulo'];

        // 2) Slots disponíveis: mesmas aulas (mesmo professor + título) e futuras
        $sqlSlots = "
            select
              c.id          as class_id,
              c.titulo,
              c.inicio,
              c.fim,
              c.capacidade,
              c.cover_url
            from classes c
            where c.professor_id = :prof_id
              and c.titulo       = :titulo
              and c.inicio      >= now()
            order by c.inicio asc
        ";

        $stmtSlots = $pdo->prepare($sqlSlots);
        $stmtSlots->execute([
            ':prof_id' => $profId,
            ':titulo'  => $titulo,
        ]);

        $rows  = $stmtSlots->fetchAll(\PDO::FETCH_ASSOC);
        $slots = [];

        foreach ($rows as $row) {
            $dt = new \DateTime($row['inicio']);

            $slots[] = [
                'class_id'   => $row['class_id'],
                'inicio'     => $row['inicio'],
                'fim'        => $row['fim'],
                'date'       => $dt->format('Y-m-d'),
                'time'       => $dt->format('H:i'),
                'capacidade' => $row['capacidade'],
                'cover_url'  => $row['cover_url'],
            ];
        }

        return jsonResponse($response, [
            'status'        => 'ok',
            'booking_id'    => $bookingId,
            'current_class' => [
                'class_id'     => $base['class_id'],
                'titulo'       => $base['titulo'],
                'professor_id' => $base['professor_id'],
            ],
            'slots'         => $slots,
        ]);

    } catch (\Throwable $e) {
        error_log('Erro em GET /api/aulas/{bookingId}/slots: ' . $e->getMessage());

        return jsonResponse($response, [
            'error'   => 'Erro ao listar slots de remarcação',
            'details' => $e->getMessage(),
        ], 500);
    }
});


// -----------------------------------------------------------------------------
// POST /api/aulas/{bookingId}/remarcar
// Body JSON: { "class_id": "novo-class-id" }
// Atualiza class_bookings.class_id para remarcar a aula
// -----------------------------------------------------------------------------
$app->post('/api/aulas/{bookingId}/remarcar', function (Request $request, Response $response, array $args) {
    $bookingId = $args['bookingId'] ?? null;
    $pdo       = getPdo();

    if (!$bookingId) {
        return jsonResponse($response, [
            'error'   => 'bookingId inválido',
            'message' => 'Informe o ID da reserva na URL.',
        ], 400);
    }

    $raw  = (string) $request->getBody();
    $body = json_decode($raw, true) ?? [];
    $newClassId = $body['class_id'] ?? null;

    if (!$newClassId) {
        return jsonResponse($response, [
            'error'   => 'Dados inválidos',
            'message' => 'Informe o campo class_id no corpo da requisição.',
        ], 400);
    }

    try {
        // 1) Verifica se o booking existe
        $sqlBooking = "select aluno_id, class_id from class_bookings where id = :id limit 1";
        $stmtB = $pdo->prepare($sqlBooking);
        $stmtB->execute([':id' => $bookingId]);
        $booking = $stmtB->fetch(\PDO::FETCH_ASSOC);

        if (!$booking) {
            return jsonResponse($response, [
                'error'   => 'Reserva não encontrada',
                'message' => 'Nenhum registro em class_bookings para este ID.',
            ], 404);
        }

        // 2) Verifica se a nova aula existe e pega capacidade
        $sqlClass = "select id, capacidade, inicio, fim from classes where id = :id limit 1";
        $stmtC = $pdo->prepare($sqlClass);
        $stmtC->execute([':id' => $newClassId]);
        $class = $stmtC->fetch(\PDO::FETCH_ASSOC);

        if (!$class) {
            return jsonResponse($response, [
                'error'   => 'Aula destino não encontrada',
                'message' => 'Nenhum registro em classes para o class_id informado.',
            ], 404);
        }

        // 3) (Opcional) Valida capacidade da aula
        if (!is_null($class['capacidade'])) {
            $sqlCount = "
                select count(*) 
                from class_bookings 
                where class_id = :class_id
            ";
            $stmtCount = $pdo->prepare($sqlCount);
            $stmtCount->execute([':class_id' => $newClassId]);
            $ocupacao = (int) $stmtCount->fetchColumn();

            if ($ocupacao >= (int) $class['capacidade']) {
                return jsonResponse($response, [
                    'error'   => 'Aula lotada',
                    'message' => 'Não é possível remarcar, a nova turma já está cheia.',
                ], 409);
            }
        }

        // 4) Faz a remarcação (troca de class_id)
        $sqlUpdate = "
            update class_bookings
            set class_id   = :new_class_id,
                created_at = now()
            where id = :booking_id
        ";

        $stmtU = $pdo->prepare($sqlUpdate);
        $stmtU->execute([
            ':new_class_id' => $newClassId,
            ':booking_id'   => $bookingId,
        ]);

        return jsonResponse($response, [
            'status'       => 'ok',
            'message'      => 'Aula remarcada com sucesso.',
            'booking_id'   => $bookingId,
            'new_class_id' => $newClassId,
        ]);

    } catch (\Throwable $e) {
        error_log('Erro em POST /api/aulas/{bookingId}/remarcar: ' . $e->getMessage());

        return jsonResponse($response, [
            'error'   => 'Erro ao remarcar aula',
            'details' => $e->getMessage(),
        ], 500);
    }
});


// -----------------------------------------------------------------------------
// GET /api/aulas/{classId}  -> detalhe de uma aula específica
// (mantido para quando você quiser mostrar mais info da aula)
// -----------------------------------------------------------------------------
$app->get('/api/aulas/{classId}', function (Request $request, Response $response, array $args) {
    $classId = $args['classId'];
    $pdo     = getPdo();

    $sql = "
        select
            c.id,
            c.titulo,
            c.descricao,
            c.inicio,
            c.fim,
            c.capacidade,
            c.created_at,
            prof.full_name as professor_name,
            prof.phone     as professor_phone,
            (
                select count(*)::integer
                from class_bookings cb
                where cb.class_id = c.id
            ) as inscritos
        from classes c
        left join profiles prof on prof.id = c.professor_id
        where c.id = :id
        limit 1
    ";

    $stmt = $pdo->prepare($sql);
    $stmt->execute([':id' => $classId]);
    $row = $stmt->fetch(\PDO::FETCH_ASSOC);

    if (!$row) {
        return jsonResponse($response, ['message' => 'Aula não encontrada'], 404);
    }

    return jsonResponse($response, $row);
});
