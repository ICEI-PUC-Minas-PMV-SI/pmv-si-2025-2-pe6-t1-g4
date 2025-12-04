<?php
// backend-php/src/routes_auth.php

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

/**
 * POST /api/auth/register
 * Corpo esperado (JSON):
 * {
 *   "email": "aluno@teste.com",
 *   "password": "123456",
 *   "full_name": "Nome Sobrenome"
 * }
 *
 * OBS: O app hoje manda também cpf, phone etc.,
 * mas aqui, por enquanto, usamos só email/senha/nome
 * para criar o usuário de autenticação.
 */
$app->post('/api/auth/register', function (Request $request, Response $response) {
    $pdo = getPdo();

    // Lê JSON do corpo
    $bodyRaw = (string) $request->getBody();
    $body = json_decode($bodyRaw, true) ?? [];

    $email     = trim($body['email']     ?? '');
    $password  = $body['password']       ?? '';
    $full_name = trim($body['full_name'] ?? '');

    if ($email === '' || $password === '') {
        return jsonResponse($response, [
            'error'   => 'Dados inválidos',
            'message' => 'Email e senha são obrigatórios.'
        ], 400);
    }

    try {
        // 1) Criar usuário no Supabase Auth
        //    encrypted_password com bcrypt (gen_salt('bf'))
        $sqlUser = "
            insert into auth.users (id, email, encrypted_password)
            values (gen_random_uuid(), :email, crypt(:password, gen_salt('bf')))
            returning id
        ";

        $stmt = $pdo->prepare($sqlUser);
        $stmt->execute([
            ':email'    => $email,
            ':password' => $password,
        ]);

        $userId = $stmt->fetchColumn();
        if (!$userId) {
            throw new \RuntimeException('Falha ao criar usuário em auth.users');
        }

        // NÃO inserimos mais em public.profiles aqui,
        // porque o trigger on_auth_user_created já cria o profile:
        //
        //   insert into public.profiles (id, full_name)
        //   values (new.id, coalesce(new.raw_user_meta_data->>'full_name',''));
        //
        // Depois o app atualiza os dados via /api/profiles/:id (PUT).

        return jsonResponse($response, [
            'status' => 'ok',
            'user'   => [
                'id'        => $userId,
                'email'     => $email,
                'full_name' => $full_name,
                'role'      => 'aluno',
            ],
        ], 201);

    } catch (\PDOException $e) {
        error_log('PDOException em /api/auth/register: ' . $e->getMessage());

        if ($e->getCode() === '23505') {
            // 23505 = violação de UNIQUE (pode ser email, cpf, id, etc.)
            return jsonResponse($response, [
                'error'   => 'Violação de UNIQUE',
                'message' => 'Algum valor único já está cadastrado (email, id ou cpf).',
                'details' => $e->getMessage(),
            ], 409);
        }

        return jsonResponse($response, [
            'error'   => 'Erro de banco de dados',
            'details' => $e->getMessage(),
        ], 500);

    } catch (\Throwable $e) {
        return jsonResponse($response, [
            'error'   => 'Erro inesperado no cadastro',
            'details' => $e->getMessage(),
        ], 500);
    }
});

/**
 * POST /api/login
 * Corpo esperado (JSON):
 * {
 *   "email": "aluno@teste.com",
 *   "password": "123456"
 * }
 */
$app->post('/api/login', function (Request $request, Response $response) {
    $pdo = getPdo();

    $bodyRaw = (string) $request->getBody();
    $body = json_decode($bodyRaw, true) ?? [];

    $email    = trim($body['email']    ?? '');
    $password = $body['password']      ?? '';

    if ($email === '' || $password === '') {
        return jsonResponse($response, [
            'error'   => 'Dados inválidos',
            'message' => 'Email e senha são obrigatórios.'
        ], 400);
    }

    try {
        // Verifica usuário em auth.users usando crypt para comparar senha
      $sql = "
    select
      u.id,
      u.email,
      coalesce(p.full_name, '')      as full_name,
      coalesce(p.role, 'aluno')      as role,
      coalesce(p.avatar_url, '')     as avatar_url
    from auth.users u
    left join public.profiles p on p.id = u.id
    where u.email = :email
      and u.encrypted_password = crypt(:password, u.encrypted_password)
    limit 1
";


        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            ':email'    => $email,
            ':password' => $password,
        ]);

        $user = $stmt->fetch(\PDO::FETCH_ASSOC);

        if (!$user) {
            // Email ou senha inválidos
            return jsonResponse($response, [
                'error'   => 'Credenciais inválidas',
                'message' => 'Email ou senha incorretos.'
            ], 401);
        }

        // Se quiser, aqui daria pra gerar um JWT / token.
        // Por enquanto, devolvemos token = null só para manter o formato.
        return jsonResponse($response, [
            'status' => 'ok',
            'user'   => [
                'id'        => $user['id'],
                'email'     => $user['email'],
                'full_name' => $user['full_name'],
                'role'      => $user['role'],
                'avatar_url' => $user['avatar_url'], // 👈 novo
            ],
            'token'  => null,
        ], 200);

    } catch (\PDOException $e) {
        error_log('PDOException em /api/login: ' . $e->getMessage());

        return jsonResponse($response, [
            'error'   => 'Erro de banco de dados',
            'details' => $e->getMessage(),
        ], 500);

    } catch (\Throwable $e) {
        return jsonResponse($response, [
            'error'   => 'Erro inesperado no login',
            'details' => $e->getMessage(),
        ], 500);
    }
});

/**
 * Alias opcional: POST /api/auth/login
 * Usa a mesma lógica de /api/login, para compatibilizar qualquer código antigo.
 */
$app->post('/api/auth/login', function (Request $request, Response $response) {
    $pdo = getPdo();

    $bodyRaw = (string) $request->getBody();
    $body = json_decode($bodyRaw, true) ?? [];

    $email    = trim($body['email']    ?? '');
    $password = $body['password']      ?? '';

    if ($email === '' || $password === '') {
        return jsonResponse($response, [
            'error'   => 'Dados inválidos',
            'message' => 'Email e senha são obrigatórios.'
        ], 400);
    }

    try {
        $sql = "
            select
              u.id,
              u.email,
              coalesce(p.full_name, '')  as full_name,
              coalesce(p.role, 'aluno')  as role
            from auth.users u
            left join public.profiles p on p.id = u.id
            where u.email = :email
              and u.encrypted_password = crypt(:password, u.encrypted_password)
            limit 1
        ";

        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            ':email'    => $email,
            ':password' => $password,
        ]);

        $user = $stmt->fetch(\PDO::FETCH_ASSOC);

        if (!$user) {
            return jsonResponse($response, [
                'error'   => 'Credenciais inválidas',
                'message' => 'Email ou senha incorretos.'
            ], 401);
        }

        return jsonResponse($response, [
            'status' => 'ok',
            'user'   => [
                'id'        => $user['id'],
                'email'     => $user['email'],
                'full_name' => $user['full_name'],
                'role'      => $user['role'],
            ],
            'token'  => null,
        ], 200);

    } catch (\PDOException $e) {
        error_log('PDOException em /api/auth/login: ' . $e->getMessage());

        return jsonResponse($response, [
            'error'   => 'Erro de banco de dados',
            'details' => $e->getMessage(),
        ], 500);

    } catch (\Throwable $e) {
        return jsonResponse($response, [
            'error'   => 'Erro inesperado no login (/api/auth/login)',
            'details' => $e->getMessage(),
        ], 500);
    }
});
