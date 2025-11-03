# Front-end Web
O Front-end Web tem como objetivo oferecer uma interface moderna e responsiva para alunos, personal trainers e gestores de academias, permitindo fácil acesso às principais funcionalidades do sistema, cadastramento de aluno, visualização de treinos, acompanhamento de evolução física e agendamento de aulas. Seu design busca unir praticidade e motivação, proporcionando uma experiência intuitiva e envolvente ao usuário.

<!-- [Inclua uma breve descrição do projeto e seus objetivos.] -->

## Projeto da Interface Web
A estrutura dos projeto está dividida em:

- **Página Inicial:** Página que apresenta a idealização do projeto com: botões de navegação (Sobre, Registrar, Entrar), frase de efeito, e indicadores de desempenho (anos de experiência, número de alunos, número de treinadores, taxa de satisfação). Deve ser altamente impactante visualmente, com chamadas para ação (CTA) claras.

- **Sobre:** Apresentação da TrainerHub, objetivos, equipe, mapa de divisão.

- **Registrar (Cadastro):** Formulário de cadastro com campos por tipo de usuário (Aluno, Personal, Gestor).

- **Entrar (Login):** Tela de autenticação com recuperação de senha e login. Preenchida através de e-mail ou CPF e senha.

- **Perfil do Aluno ou Professor:** Dados pessoais (nome, email, CPF), informações físicas (peso, altura), edição de perfil.

- **Agendamentos / Calendário:** Calendário interativo (mês/semana/dia), reserva de aulas, visualização de vagas e histórico de agendamentos.

- **Detalhe da Aula / Reserva:** Informações da aula (instrutor, duração, vagas), botão de reservar/cancelar e regras de participação.


<!-- [Descreva o projeto da interface Web da aplicação, incluindo o design visual, layout das páginas, interações do usuário e outros aspectos relevantes.]  -->

### Wireframes
Esses wireframes representam o esqueleto visual do front-end da aplicação TrainerHub, demonstrando como cada seção e funcionalidade principal será organizada dentro da interface. Eles apresentam uma identidade consistente, com predominância de tons escuros, contraste em vermelho e uso de imagens motivacionais que reforçam o conceito fitness e de performance.

O layout mostra uma navegação clara e intuitiva, com menus laterais e áreas centrais bem definidas para conteúdo dinâmico — como perfis, treinos, calendário de aulas e formulários de autenticação. A distribuição dos elementos prioriza a usabilidade e fluidez de interação, mantendo coerência entre as páginas e facilitando a transição entre login, cadastro, visualização de treinos e gerenciamento de perfil.

De modo geral, os wireframes traduzem um design funcional e profissional, equilibrando estética e propósito, garantindo que o usuário tenha uma experiência envolvente, direta e coerente com a proposta visual do sistema.

<img width="1046" height="834" alt="Image" src="https://github.com/user-attachments/assets/db8f75cc-b3c9-4609-bd5d-3e53e8d54fab" />

<center>Imagem 2 - Wireframes</center>

<!-- [Inclua os wireframes das páginas principais da interface, mostrando a disposição dos elementos na página.] -->

### Design Visual
O layout apresenta um design moderno e profissional, com uma paleta de cores escura predominante, composta por tons de preto, cinza e detalhes em vermelho transmitindo força, energia e intensidade, características diretamente associadas ao universo fitness.

Paleta de cores
- Preto e cinza escuro: base principal, garantindo contraste e foco no conteúdo, resaltando o foco e determinação;
- Vermelho: cor utilizada em botões e títulos para criar ênfase e dinamismo, contraste com o preto;
- Branco e cinza claro: usados para o texto, proporcionando legibilidade e equilíbrio visual, contraste com cores escuras.
Essa combinação cria um visual sofisticado e impactante, típico de marcas voltadas para performance e tecnologia.

Tipografia
A tipografia é feita por uma estética moderna e objetiva, com linhas retas e claras reforçando a ideia de elementos de academia e treino.
A fonte de maior destaque é Rubik seguindo a ideia central do projeto.

Ícones
Os icones escolhidos, seguem a ideia minimalista, sendo pequenos e de cores neutras, como branco ou preto.

## Fluxo de Dados
1. Login / Autenticação
- Usuário envia credenciais no front-end → Front-end chama endpoint /auth/login.
- Backend valida credenciais 
- Front-end armazena token com segurança e atualiza estado do usuário.

2. Consulta de Treinos / Perfil
- Front faz GET /api/alunos/{id}/treinos com Authorization bearer token.
- Backend valida token, busca dados no banco (ex.: Postgres) e retorna JSON.
- Front recebe e renderiza componentes (cards, gráficos), com cache local e estratégias de revalidação.

3. Agendamento de Aulas
- Front apresenta calendário; usuário seleciona data/hora e confirma.
- Front envia POST /api/agendamentos com payload.
- Backend trata regras de negócio (conflito de horário, limite de vagas) → persiste e publica evento (ex.: fila/worker) para notificação.

4. Evolução Física (uploads)
- Upload de fotos/medidas → front envia para serviço de storage (ex.: S3) via signed URL ou proxy server.
- Backend registra metadata no DB e atualiza histórico do aluno.

<!-- [Diagrama ou descrição do fluxo de dados na aplicação.] -->

## Tecnologias Utilizadas
As tecnologis utilizadas no Front-end são: 

- React.js – biblioteca principal para criação da interface.
- GitHub e Git – versionamento e controle colaborativo do código.
- npm – gerenciamento de dependências.
<!-- [Lista das tecnologias principais que serão utilizadas no projeto.] -->

## Considerações de Segurança
Como o ambiente da aplicação é local e controlado, as principais medidas de segurança estão concentradas no banco de dados PostgreSQL. Entre as práticas adotadas estão:
- Autenticação e autorização de usuários diretamente no PostgreSQL;
- Controle de permissões conforme o tipo de acesso (usuário, treinador ou administrador);
- Armazenamento seguro de credenciais por meio de variáveis de ambiente;
- Restrições de acesso à porta do banco de dados apenas para a aplicação autorizada;
- Backup local seguro para evitar perda de dados.

Essas medidas garantem a integridade e a confidencialidade das informações dentro do ambiente de desenvolvimento e operação local.

<!-- [Discuta as considerações de segurança relevantes para a aplicação distribuída, como autenticação, autorização, proteção contra ataques, etc.] -->

## Implantação
A implantação do sistema TrainerHub deverá seguir um processo padronizado e definido para garantir estabilidade, segurança e escalabilidade do ambiente de produção.

Requisitos de Hardware e Software

Front-end:
- Hospedagem estática utilizando Vercel, responsável pela entrega do aplicativo React.
- Build gerado via npm run build e entregue automaticamente pelo pipeline de integração contínua.

Banco de Dados:
- PostgreSQL, hospedado em Render Managed Database, com backups automáticos diários.

Storage:
- Utilização do AWS S3 para armazenamento de arquivos estáticos e imagens de perfil dos usuários.

Cache e Filas:
- Redis gerenciado no Render, utilizado para filas de agendamento e cache de dados temporários.

Domínio e SSL:
- Domínio configurado no Vercel, com certificado SSL automático via Let’s Encrypt.

Ambiente de Integração Contínua:
- CI/CD implementado com GitHub Actions, realizando build, testes e deploy automatizados a cada push na branch principal.

  
Etapas do Processo de Deploy:
1. Build de Produção – Executar npm run build no front-end e npm run start no backend.
2. Pipeline Automático (CI/CD) – Testes e validação do build via GitHub Actions.
3. Publicação no Vercel e Render – Deploy contínuo ativado em ambas as plataformas.
4. Configuração de Variáveis de Ambiente – Chaves de API, URLs do backend e credenciais seguras armazenadas nos painéis das plataformas.
5. Validação Pós-Deploy – Testes funcionais e de integração automatizados para confirmar estabilidade do ambiente.
6. Monitoramento – Uso do Sentry (front-end) e Grafana + Prometheus (backend) para métricas de erro e performance.

<!-- [Instruções para implantar a aplicação distribuída em um ambiente de produção.]

1. Defina os requisitos de hardware e software necessários para implantar a aplicação em um ambiente de produção.
2. Escolha uma plataforma de hospedagem adequada, como um provedor de nuvem ou um servidor dedicado.
3. Configure o ambiente de implantação, incluindo a instalação de dependências e configuração de variáveis de ambiente.
4. Faça o deploy da aplicação no ambiente escolhido, seguindo as instruções específicas da plataforma de hospedagem.
5. Realize testes para garantir que a aplicação esteja funcionando corretamente no ambiente de produção.-->

## Testes

<!-- [Descreva a estratégia de teste, incluindo os tipos de teste a serem realizados (unitários, integração, carga, etc.) e as ferramentas a serem utilizadas.]

1. Crie casos de teste para cobrir todos os requisitos funcionais e não funcionais da aplicação.
2. Implemente testes unitários para testar unidades individuais de código, como funções e classes.
3. Realize testes de integração para verificar a interação correta entre os componentes da aplicação.
4. Execute testes de carga para avaliar o desempenho da aplicação sob carga significativa.
5. Utilize ferramentas de teste adequadas, como frameworks de teste e ferramentas de automação de teste, para agilizar o processo de teste. -->

# Referências
- React.js — https://reactjs.org
- Tailwind CSS — https://tailwindcss.com
- Vercel — https://vercel.com
- Render — https://render.com
- PostgreSQL — https://www.postgresql.org
- Redis — https://redis.io
- GitHub Actions — https://github.com/features/actions
- OWASP Top Ten — https://owasp.org
- Figma — https://www.figma.com

# Planejamento

##  Quadro de tarefas

### Mês 3

Atualizado em: 02/11/2025

| Responsável   | Tarefa/Requisito | Iniciado em    | Prazo      | Status | Terminado em    |
| :----         |    :----         |      :----:    | :----:     | :----: | :----:          |
| Leonardo      | Atualização Doc. | 13/10/2025   | 02/11/2025 | ✔️    | 02/11/2025      |
| Leonardo      | Desenvolvimento Front-end    | 13/10/2025    | 02/11/2025 | ✔️    | 31/10/2025 |
| Lucas         | Desenvolvimento Front-end    | 13/10/2025    | 02/11/2025 | ✔️    | 31/10/2025 |

Legenda:
- ✔️: terminado
- 📝: em execução
- ⌛: atrasado
- ❌: não iniciado

