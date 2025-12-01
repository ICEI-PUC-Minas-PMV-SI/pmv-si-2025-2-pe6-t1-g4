# Front-end Móvel

O projeto consiste no desenvolvimento da interface mobile do aplicativo TrainerHub. O app oferece uma experiência completa para alunos que desejam acompanhar seus treinos, agendar aulas e visualizar métricas de desempenho diretamente pelo celular.

A interface é organizada em fluxos principais: Cadastro/Login, Resumo, Aulas, Treinos e Perfil, apresentando um design moderno, escuro e com elementos visuais voltados para o universo fitness.

# Projeto da Interface
<!-- [Descreva o projeto da interface móvel da aplicação, incluindo o design visual, layout das páginas, interações do usuário e outros aspectos relevantes.] -->

A interface móvel do TrainerHub foi projetada para oferecer uma experiência moderna, intuitiva e orientada ao usuário, voltada para os alunos que desejam acompanhar treinos, métricas e agendamentos diretamente pelo smartphone. O design combina elementos visuais de alto contraste, fotografias temáticas e uma arquitetura de navegação clara, garantindo fluidez e acessibilidade em todas as etapas do uso.

## Design Visual

A identidade visual do app segue uma estética moderna, fitness e minimalista, utilizando:

* Paleta escura (dark mode) como padrão, reforçando contraste, economia de energia e foco no conteúdo principal.

* Elementos neons/roxos em ícones, botões e destaques, transmitindo inovação e energia.

* Componentes arredondados (cards, botões e frames), alinhados ao design mobile contemporâneo.

* Tipografia limpa, privilegiando legibilidade e hierarquia visual.

## Arquitetura de Navegação

A navegação é baseada em uma barra inferior fixa, com acesso direto às principais áreas:

* Resumo

* Aulas

* Treinos

* Perfil

Essa estrutura permite que o usuário transite rapidamente entre funcionalidades importantes, sem necessidade de menus extensos ou múltiplos passos.

## Layout e Fluxo das Páginas

Tela Inicial e Cadastro
A tela de abertura apresenta:

* imagem de fundo representando ambiente de academia,

* logotipo centralizado,

* botões para Login e Criar Conta.
O fluxo de cadastro segue um modelo vertical simples, com campos agrupados e botões evidentes, facilitando a leitura e o preenchimento.

(IMAGEM AQUI) 

## Login
A tela de login é objetiva, com:

* campos de e-mail e senha,

* botão de acesso em destaque,

* teclado adaptado ao tipo de input,

* alinhamento centralizado e minimalista.

Essa simplicidade reduz barreiras de entrada e melhora a experiência inicial.
(IMAGEM AQUI)

## Resumo
A tela de resumo funciona como um dashboard do aluno, apresentando:

* Cartões de informações rápidas (nível, próximos treinos, aulas agendadas).

* Indicadores de saúde (ex.: batimentos cardíacos ou métricas do treino).

* Acesso rápido às principais funções do dia.

Os cards são coloridos, grandes e fáceis de clicar, reforçando acessibilidade no toque.
(IMAGEM AQUI)

## Aulas
A área de aulas oferece recursos de agendamento e visualização:

* Cards com aulas disponíveis ou previstas,

* Tela de calendário para escolha de datas para reagendamento de aulas,

* Botões de “Cancelar” e “Confirmar" bem posicionados,

* Representações visuais de atividades (ex.: spinning, funcional, musculação).

O design promove clareza nas ações e reduz erros do usuário.
(IMAGEM AQUI)

## Treinos
A tela de treinos apresenta:

* Cards verticais com o nome do treino, grupo muscular e imagem ilustrativa do respectivo treino,

* Separação por níveis ou tipos de exercício,

* Acesso rápido ao detalhamento de cada treino.

A interface prioriza organização e clareza para o aluno visualizar seus planos de exercício como separação por cores de grupos de treinos (Peito cor roxa, ombros cor verde, etc...).
(IMAGEM AQUI)

## Perfil
Nessa seção, o usuário pode gerenciar:

* dados pessoais,

* peso, idade e outras métricas,

* informações de contato,

* Trocar senha.

O layout lembra uma tela de configurações, porém com estética fitness e elementos visuais consistentes com o restante do app.
(IMAGEM AQUI)

## Interações do Usuário

As interações foram pensadas para serem naturais e consistentes:

* Toques diretos em cards, ícones e opções.

* Transições suaves entre telas, reforçando continuidade.

* Feedback visual em botões (alteração de cor, animações curtas).

* Uso de ícones intuitivos para navegação pela barra inferior.

* Uso de componentes nativos mobile, garantindo familiaridade.

### Wireframes
Os wireframes do TrainerHub seguem um visual dark, com cards grandes, botões arredondados e ícones simples, mantendo sempre o mesmo estilo moderno e fitness. Todas as telas usam fotos de fundo, cores fortes para destaque e uma navegação inferior fixa. A organização é vertical, com elementos bem espaçados e consistentes em todo o app.
<img width="795" height="828" alt="Image" src="https://github.com/user-attachments/assets/9085846e-5aef-46b7-9762-60c6c24bc144" /> <br/>
Imagem 3 - WireFrames

## Fluxo de Dados

Usuário (App Mobile)
- Interage com telas: Login / Cadastro, Resumo, Aulas, Treinos, Perfil.
- Ações do usuário geram requisições HTTP(S) para a API (ex.: autenticar, buscar treinos, marcar aula, atualizar perfil).
- Cliente (React Native / Expo)

Implementa chamadas à API usando Axios
- Armazena localmente apenas o necessário em storage seguro.

API Backend (PHP)
- Recebe as requisições, valida, executa regras de negócio e persiste/consulta dados no banco.
- Retorna JSON com status/códigos HTTP adequados.

Banco de Dados (Supabase / PostgreSQL)
- Guarda usuários, treinos, aulas, histórico e relacionamentos.
- Backups e replicação são responsabilidade do provedor (Supabase) quando usado como serviço.

## Tecnologias Utilizadas
- React Native (via Expo)
- Expo CLI 
- react-native-paper 
- @expo/vector-icons, expo-image-picker, expo-status-bar
- AsyncStorage / SecureStore (armazenamento local)

## Considerações de Segurança
Armazenamento Seguro
- Tokens de autenticação devem ser guardados no SecureStore.
- AsyncStorage apenas para informações não sensíveis (tema, preferências).
- Limpar todo o armazenamento no logout.

Comunicação com a API
- Apenas HTTPS.
- Token enviado no cabeçalho: Authorization: Bearer <token>.
- Nunca registrar tokens em logs.

Validação no Front-end
- Validar dados básicos antes de enviar: e-mail, CPF, campos obrigatórios.
- Evitar inputs maliciosos e limitar tamanhos de texto.

Proteção de Sessão
- Se o token expirar, redirecionar para o login.
- Bloquear telas privadas sem autenticação.

Interface Segura
- Mascarar CPF e outros dados sensíveis.
- Não exibir mensagens de erro detalhadas.

Dependência com o Backend (mínima, mas importante)
- Backend deve validar tudo novamente.
- Erros vindos da API não devem revelar informações internas.

## Implantação

[Instruções para implantar a aplicação distribuída em um ambiente de produção.]

1. Defina os requisitos de hardware e software necessários para implantar a aplicação em um ambiente de produção.
2. Escolha uma plataforma de hospedagem adequada, como um provedor de nuvem ou um servidor dedicado.
3. Configure o ambiente de implantação, incluindo a instalação de dependências e configuração de variáveis de ambiente.
4. Faça o deploy da aplicação no ambiente escolhido, seguindo as instruções específicas da plataforma de hospedagem.
5. Realize testes para garantir que a aplicação esteja funcionando corretamente no ambiente de produção.

## Testes

<!-- [Descreva a estratégia de teste, incluindo os tipos de teste a serem realizados (unitários, integração, carga, etc.) e as ferramentas a serem utilizadas.]

1. Crie casos de teste para cobrir todos os requisitos funcionais e não funcionais da aplicação.
2. Implemente testes unitários para testar unidades individuais de código, como funções e classes.
3. Realize testes de integração para verificar a interação correta entre os componentes da aplicação.
4. Execute testes de carga para avaliar o desempenho da aplicação sob carga significativa.
5. Utilize ferramentas de teste adequadas, como frameworks de teste e ferramentas de automação de teste, para agilizar o processo de teste. -->

# Referências

- Documentação oficial React Native.
- Documentação Expo (se usar Expo).
- React Navigation docs.
- PostgreSQL official docs.
- Materiais sobre LGPD (Lei Geral de Proteção de Dados) — regras de tratamento de dados no Brasil.
- Boas práticas de CI/CD (GitHub Actions / GitLab CI).
- Guias de design mobile: Material Design / Apple Human Interface Guidelines (para heurísticas de UX).

# Planejamento
O projeto seguiu sendo realizado por meio de divisões de tarefas para cada integrante da equipe, tornando o a realização do projeto mais eficiente e veloz.
##  Quadro de tarefas
### Mês 4

Atualizado em: 30/11/2025

| Responsável   | Tarefa/Requisito |   Iniciado em  | Prazo      | Status  |  Terminado em  |
| :----         |    :----         |      :----:    | :----:     | :----:  | :----:         |
| Augusto       |Design de usuário |    10/11/2025  | 17/11/2025 | ✔️      |   17/11/2025   |
| Leonardo      |Design de usuário |    10/11/2025  | 17/11/2025 | ✔️      |   17/11/2025   |
| Lucas         |Design de usuário |    10/11/2025  | 17/11/2025 | ✔️      |   17/11/2025   |
| Wellington    |Projeto interface |    10/11/2025  | 17/11/2025 | ✔️      |   17/11/2025   |
| Leonardo      |Atualização GitHub|    10/11/2025  | 30/11/2025 | ✔️      |   30/11/2025   |


Legenda:
- ✔️: terminado
- 📝: em execução
- ⌛: atrasado
- ❌: não iniciado

