# APIs e Web Services
O planejamento de uma aplicação de APIs Web é essencial para garantir a comunicação entre o aplicativo mobile (alunos e professores), o painel web da academia e os serviços de backend.
Para este projeto, a API servirá como intermediária entre o Supabase (banco relacional e serviços de autenticação) e os clientes (app e painel web), assegurando acesso seguro, escalável e padronizado aos recursos da plataforma.

A proposta da API é integrar as funcionalidades de cadastro de usuários, gerenciamento de fichas de treino, monitoramento de evolução física, agendamento de treinos/aulas e relatórios de progresso, permitindo que todos os módulos do sistema conversem entre si de forma organizada e performática.

<!-- O planejamento de uma aplicação de APIS Web é uma etapa fundamental para o sucesso do projeto. Ao planejar adequadamente, você pode evitar muitos problemas e garantir que a sua API seja segura, escalável e eficiente.

Aqui estão algumas etapas importantes que devem ser consideradas no planejamento de uma aplicação de APIS Web.

[Inclua uma breve descrição do projeto.] -->

## Objetivos da API
O objetivo da API é oferecer uma camada de serviços segura e padronizada para suportar as principais operações do sistema, evitando inconsistências e duplicidade de dados.

Principais objetivos:

- Disponibilizar serviços RESTful para cadastro, consulta, atualização e exclusão de dados (CRUD).
- Integrar aplicativo mobile (.NET MAUI) e painel web de forma centralizada, mantendo dados sincronizados.
- Garantir autenticação e autorização por meio do Supabase Auth, assegurando o acesso de acordo com o perfil do usuário (aluno, personal ou gestor).
- Prover escalabilidade e alta disponibilidade para suportar um número crescente de usuários.
- Facilitar a manutenção e evolução do sistema, seguindo boas práticas de arquitetura de APIs.

<!-- O primeiro passo é definir os objetivos da sua API. O que você espera alcançar com ela? Você quer que ela seja usada por clientes externos ou apenas por aplicações internas? Quais são os recursos que a API deve fornecer? -->[Inclua os objetivos da sua api.]

## Modelagem da Aplicação
A modelagem da aplicação foi construída para refletir as operações de uma academia, integrando usuários, fichas de treino, exercícios, aulas e pagamentos. A figura abaixo apresenta o diagrama de entidades e relacionamentos do banco de dados criado no Supabase.

Estrutura de Dados
- **auth.users:** <br>
Tabela nativa do Supabase responsável por autenticação.
Armazena credenciais (e-mail, senha, provedores externos) e serve como chave de identificação do usuário.

- **profiles:** <br>
Tabela vinculada a auth.users.id.
Contém informações adicionais de cada usuário: full_name, cpf, phone, peso_kg, altura_cm, genero, data_nascimento e o campo role (enum user_role com valores admin, professor, aluno).

- **workouts:** <br>
Define tipos de treinos disponíveis (ex.: força, resistência, cardio).
Campos: name, level e created_at.

- **exercises:** <br>
Armazena exercícios cadastrados: name, muscle_group e description.
#training_sheets
Representa fichas de treino associando aluno ↔ professor ↔ treino.
Campos: aluno_id, professor_id, workout_id, status, created_at.

- **sheet_exercises:** <br>
Detalha os exercícios contidos em cada ficha: ordem, series, repeticoes, carga e descanso_segundos.

- **classes:** <br>
Gerencia aulas coletivas ou individuais.
Campos: professor_id, titulo, descricao, inicio, fim, capacidade e created_at.

- **class_bookings:** <br>
Liga alunos a aulas específicas, controlando as inscrições: class_id, aluno_id e created_at.

- **payments:** <br>
Registra pagamentos de mensalidades: aluno_id, due_date, amount, status e paid_at.


Relacionamentos
- auth.users.id ↔ profiles.id – cada usuário autenticado possui um perfil.
- profiles.id ↔ training_sheets.aluno_id – ficha de treino do aluno.
- profiles.id ↔ training_sheets.professor_id – ficha vinculada ao professor.
- training_sheets.id ↔ sheet_exercises.sheet_id – exercícios pertencentes à ficha.
- exercises.id ↔ sheet_exercises.exercise_id – vínculo do exercício ao item da ficha.
- profiles.id ↔ payments.aluno_id – pagamentos associados a cada aluno.
- classes.id ↔ class_bookings.class_id – inscrições feitas em aulas.
- profiles.id ↔ class_bookings.aluno_id – aluno inscrito na aula.


![Image](https://github.com/user-attachments/assets/61db8174-1f96-4ba5-ac19-7c6eff595ffc)


<!-- [Descreva a modelagem da aplicação, incluindo a estrutura de dados, diagramas de classes ou entidades, e outras representações visuais relevantes.] -->


## Tecnologias Utilizadas
As tecnologias utilizadas são:

- Backend: PHP com o framework Symfony;
- Banco de Dados: Supabase;
- Autenticação e Autorização: Supabase Auth;
- Armazenamento de Arquivos: Supabase Storage;
- Hospedagem da API:  Backend está hospedado no GitHub e executado localmente em ambiente de desenvolvimento;
- Monitoramento e Logs: Integração planejada com Supabase Logs

<!-- Existem muitas tecnologias diferentes que podem ser usadas para desenvolver APIs Web. A tecnologia certa para o seu projeto dependerá dos seus objetivos, dos seus clientes e dos recursos que a API deve fornecer.

[Lista das tecnologias principais que serão utilizadas no projeto.] -->

## API Endpoints
### Endpoint 1
Buscar Usuário
- Método: GET
- URL: {{base_url}}/users/700002f4-6278-4b01-9b7e-d690ac678a84
- Parâmetros:

param1: id (string, required):700002f4-6278-4b01-9b7e-d690ac678a84
- Resposta:
  - Sucesso (200 OK)

```
{
  "id": "700002f4-6278-4b01-9b7e-d690ac678a84",
  "role": "aluno",
  "full_name": "Jose Geraldo",
  "cpf": null,
  "phone": null,
  "created_at": "2025-09-27T02:14:31.229311+00:00",
  "peso_kg": null,
  "altura_cm": null,
  "genero": null,
  "updated_at": "2025-10-04T21:36:53.943907+00:00",
  "data_nascimento": null
}

```
- Erro 404 Not Found — usuário não encontrado:

```
{
  "message": "Error",
  "error": {
    "code": "not_found",
    "detail": "User with id 7000024a-6278-4b01-9b7e-d960ac678a84 not found."
  }
}

```

### Endpoint 2
Insert dados do Usuário
- Método: POST
- URL: {{base_url}}/users
- Resposta:
  - Sucesso (201 Created)

```
{
  "code": "23503",
  "details": "Key (id)=(dbf22f1c-7a3b-4a80-b8db-5dbb8e073b6b) is not present in table \"users\".",
  "hint": null,
  "message": "insert or update on table \"profiles\" violates foreign key constraint \"profiles_id_fkey\""
}

```

### Endpoint 3
Update
- Método: PUT
- URL: {{base_url}}/users/2f492373-56e4-4a08-93ba-e12fbf197a25
- Resposta:
  - Sucesso (200 OK)

```

 {
  "role": "aluno",
  "full_name": "Aluno para teste",
  "cpf": "123.456.789-10",
  "phone": "11999999999",
  "created_at": "2025-09-27T02:14:31.229311+00:00",
  "peso_kg": 72,
  "altura_cm": 172,
  "genero": null,
  "updated_at": "2025-10-04T21:36:53.943907+00:00",
  "data_nascimento": "04/22/2002"
}

```

### Endpoint 4
Dados Alterados
- Método: GET
- URL: {{base_url}}/users
- Resposta:
  - Sucesso (200 OK)

```
{
  "id": "21492373-5f14-48a8-938a-a12158079725",
  "role": "aluno",
  "full_name": "Aluno para teste",
  "cpf": "135-934-156-14",
  "phone": "(32) 991488001",
  "created_at": "2025-09-29T23:14:01.22931+00:00",
  "peso_kg": 72,
  "altura_cm": 172,
  "genero": null,
  "updated_at": "2025-10-05T23:03:05.096+00:00",
  "data_nascimento": "2000-04-22"
}

```

### Endpoint 5
Todas fichas de treino
- Método: GET
- URL: {{base_url}}/training
- Parâmetros:
- Resposta:
  - Sucesso (200 OK)

```
{
  "id": "5512b4d4-8e2d-484a-8449-6ea0c9e5c69e",
  "aluno_id": "7000024a-6278-4b01-9b7e-d690ac678a84",
  "professor_id": "97eb9900-dae6-4b5c-a6b1-914d4f4d2dc3",
  "workout_id": "c5fe4cef-c4d7-41c1-8b85-dfc2447e9f9c",
  "status": 1,
  "created_at": "2025-01-10T15:19:00+00:00",
  "series": [
    {
      "id": "f62e767e-a99a-4949-ac71-696c0743d4e9",
      "sheet_id": "5512b4d4-8e2d-484a-8449-6ea0c9e5c69e",
      "exercise_id": "2a9ea9cf-790f-4916-9a85-64cf493d0a2a",
      "ordem": 1,
      "series": 3,
      "repeticoes": 12,
      "carga": 100,
      "descanso_segundos": 60,
      "exercicio": {
        "id": "2a9ea9cf-790f-4916-9a85-64cf493d0a2a",
        "name": "Supino Reto",
        "muscle_group": "Peito",
        "description": "Barra no peitoral, controle na descida."
      }
    },
    {
      "id": "b6c1d699-e73b-4e61-8cad-99f41370bada",
      "sheet_id": "5512b4d4-8e2d-484a-8449-6ea0c9e5c69e",
      "exercise_id": "2f437508-982b-4374-87e0-4f0811a52201",
      "ordem": 2,
      "series": 3,
      "repeticoes": 12,
      "carga": 30,
      "descanso_segundos": 60,
      "exercicio": {
        "id": "2f437508-982b-4374-87e0-4f0811a52201",
        "name": "Supino Inclinado com Halteres",
        "muscle_group": "Peito",
        "description": "Halteres no peitoral, inclinação a 45 graus, controle na descida."
      }
    }

  ]
}

```

### Endpoint 6
Criando ficha nova
- Método: POST
- URL: {{base_url}}/training
- Parâmetros:
- Resposta:
  - Sucesso (201 Created)

```
{
  "aluno_id": "2f492373-56e4-4a08-93ba-e12fbf197a25",
  "professor_id": "07be9898-dae6-4a56-a6b1-a914d4f12dc0",
  "workout_id": "c5fe4cef-c4d7-41c1-8b85-dfc2447e9f9c",
  "status": 1,
  "created_at": "01-10-2025 15:19"
}

```

### Endpoint 7
Ficha de treino após umas série ter sido adicionada com um exercício
- Método: GET
- URL: {{base_url}}/training/2663f444-e9aa-45fd-86d0-8a3dd74eefa4
- Resposta
  - Sucesso (200 OK)

```
{
  "id": "2663f444-e9aa-45fd-86d0-8a3dd74eefa4",
  "aluno_id": "2f492373-56e4-4a08-93ba-e12fbf197a25",
  "professor_id": "07be9898-dae6-4a56-a6b1-a914d4f12dc0",
  "workout_id": "c5fe4cef-c4d7-41c1-8b85-dfc2447e9f9c",
  "status": 1,
  "created_at": "2025-01-10T15:19:00+00:00",
  "series": [
    {
      "id": "841f8b0b-b31b-4674-8824-59b24601b431",
      "sheet_id": "2663f444-e9aa-45fd-86d0-8a3dd74eefa4",
      "exercise_id": "2f437508-982b-4374-87e0-4f0811a52201",
      "ordem": 1,
      "series": 3,
      "repeticoes": 12,
      "carga": 30,
      "descanso_segundos": 60,
      "exercicio": {
        "id": "2f437508-982b-4374-87e0-4f0811a52201",
        "name": "Supino Inclinado com Halteres",
        "muscle_group": "Peito",
        "description": "Halteres no peitoral, inclinacao a 45 graus, controle na descida."
      }
    }
  ]
}

```

## Considerações de Segurança
A segurança da aplicação é garantida pelo uso do Supabase para autenticação, autorização e armazenamento de dados. O acesso é controlado por papéis (aluno, professor e administrador) e protegido pelas políticas de Row Level Security (RLS), que limitam cada usuário aos seus próprios dados. A comunicação entre API, banco e clientes é criptografada via SSL, e as credenciais são protegidas com tokens JWT. Além disso, o Supabase assegura que arquivos e informações sensíveis só sejam acessados por usuários autorizados, prevenindo acessos indevidos e mantendo a integridade dos dados.

<!-- [Discuta as considerações de segurança relevantes para a aplicação distribuída, como autenticação, autorização, proteção contra ataques, etc.] -->

## Implantação

1. **Requisitos de hardware e software:** <br>
Hardware (local): máquina/servidor 4 GB RAM, SSD recomendado. <br>
Software: PHP 8.1+, Git, PHP-FPM Apache. <br>
Banco e serviços: Supabase (Postgres); conexões com sslmode=require. <br>
Rede / Segurança: acesso SSH ao servidor local para deploy e configuração.

2. **Plataforma de hospedagem:** <br>
Hospedagem local: execução da API em um servidor local (máquina física ou VM) configurado com PHP-FPM + Nginx/Apache. <br>
GitHub: repositório para versionamento do código e uso do GitHub Actions para pipelines (build, testes e geração de artefatos).

3. **Ambiente de implantação** <br>

4. **Deploy** <br>
Local (manual): <br>
Atualizar código via git pull no servidor. <br>
Rodar composer install se houver mudanças em dependências. <br>
Aplicar migrações e limpar cache (comandos acima). <br>
Reiniciar PHP-FPM / Nginx para aplicar a nova versão. <br>

5. **Testes** <br>
Teste realizados com o objetivo de cobrir os Requisitos Funcionais da API, assim como verificar a integração  os valores unitários e a carga que da API. Assim como, visualização de endpoints críticos (rota de login, rota de perfil, etc).
   


<!-- [Instruções para implantar a aplicação distribuída em um ambiente de produção.]

1. Defina os requisitos de hardware e software necessários para implantar a aplicação em um ambiente de produção.
2. Escolha uma plataforma de hospedagem adequada, como um provedor de nuvem ou um servidor dedicado.
3. Configure o ambiente de implantação, incluindo a instalação de dependências e configuração de variáveis de ambiente.
4. Faça o deploy da aplicação no ambiente escolhido, seguindo as instruções específicas da plataforma de hospedagem.
5. Realize testes para garantir que a aplicação esteja funcionando corretamente no ambiente de produção. -->

## Testes
A estratégia contempla 4 frentes: Cobertura dos Requisitos Funcionais e Requisitos Não Funcionais, testes unitários, testes de integração e testes de carga. Testes automatizados rodarão localmente e em CI (GitHub Actions).

Cobertura dos Requisitos Funcionais e Não Funcionais:
  
RF-01 - Cadastro de Alunos
- CT-001

RF-02 - Gerenciar fichas individuais
- CT-002

RF-03 - Registrar evolução física
- CT-003

RF-04 - Acesso em tempo real à ficha
- CT-004

RF-05 - Relatórios de progresso
- CT-005

RF-06 - Agendamento
- CT-006

RF-07 - Notificações/pagamentos
- CT-007

Testes unitários
- CT-008
- CT-009

Testes de Integração
- CT-010
- CT-011

Testes de Carga
- CT-012
- CT-013







<!-- [Descreva a estratégia de teste, incluindo os tipos de teste a serem realizados (unitários, integração, carga, etc.) e as ferramentas a serem utilizadas.]

1. Crie casos de teste para cobrir todos os requisitos funcionais e não funcionais da aplicação.
2. Implemente testes unitários para testar unidades individuais de código, como funções e classes.
3. Realize testes de integração para verificar a interação correta entre os componentes da aplicação.
4. Execute testes de carga para avaliar o desempenho da aplicação sob carga significativa.
5. Utilize ferramentas de teste adequadas, como frameworks de teste e ferramentas de automação de teste, para agilizar o processo de teste. -->

# Referências
JWT.IO. **JSON Web Token Introduction.** Disponível em: <https://jwt.io/introduction/>. Acesso em: 05 out. 2025.
SYMFONY. **Symfony Framework Documentation.** Disponível em: <https://symfony.com/doc/current/index.html>. Acesso em: 05 out. 2025.
SUPABASE. **Supabase Auth Documentation.** Disponível em: <https://supabase.com/docs/guides/auth>. Acesso em: 05 out. 2025.
<!-- Inclua todas as referências (livros, artigos, sites, etc) utilizados no desenvolvimento do trabalho. --> 

# Planejamento

##  Quadro de tarefas

### Mês 3 (Set.Out./2025)

Atualizado em: 04/10/2024

| Responsável   | Tarefa/Requisito | Iniciado em    | Prazo      | Status | Terminado em    |
| :----         |    :----         |      :----:    | :----:     | :----: | :----:          |
| Leonardo      | Atualização do Documento | 02/10/2025    | 05/10/2025 | ✔️    | 05/10/2024      |
| Lucas         |                          | 02/10/2025    | 05/10/2025 | 📝    | 05/10/2025      |
| Wellington    |                          | 02/10/2025    | 05/10/2025 | ⌛    | 05/10/2025      |
| Augusto       | Setup base da API/rotas  | 11/09/2025    | 05/10/2025 | ✔️    | 05/10/2025      |

Legenda:
- ✔️: terminado
- 📝: em execução
- ⌛: atrasado
- ❌: não iniciado

