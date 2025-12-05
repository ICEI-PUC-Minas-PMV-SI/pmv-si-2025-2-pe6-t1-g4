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

## Tela Inicial e Cadastro
A tela de abertura apresenta:

* imagem de fundo representando ambiente de academia,

* logotipo centralizado,

* botões para Login e Criar Conta.
O fluxo de cadastro segue um modelo vertical simples, com campos agrupados e botões evidentes, facilitando a leitura e o preenchimento.

<img width="300" height="900" alt="Image" src="https://github.com/user-attachments/assets/9ab4a834-44b8-40e4-83a1-c7a36a851d17" />

Imagem 3 - Tela Inicial

## Login
A tela de login é objetiva, com:

* campos de e-mail e senha,

* botão de acesso em destaque,

* teclado adaptado ao tipo de input,

* alinhamento centralizado e minimalista.

Essa simplicidade reduz barreiras de entrada e melhora a experiência inicial.

<img width="300" height="900" alt="Image" src="https://github.com/user-attachments/assets/5c66e834-9aff-4c28-bb54-76e2e1caab31" />

Imagem 4 - Login

## Resumo
A tela de resumo funciona como um dashboard do aluno, apresentando:

* Cartões de informações rápidas (nível, próximos treinos, aulas agendadas).

* Indicadores de saúde (ex.: batimentos cardíacos ou métricas do treino).

* Acesso rápido às principais funções do dia.

Os cards são coloridos, grandes e fáceis de clicar, reforçando acessibilidade no toque.

<img width="300" height="900" alt="Image" src="https://github.com/user-attachments/assets/1e32db45-7244-4da1-a290-65f694eed8df" />

Imagem 5 - Resumo

## Aulas
A área de aulas oferece recursos de agendamento e visualização:

* Cards com aulas disponíveis ou previstas,

* Tela de calendário para escolha de datas para reagendamento de aulas,

* Botões de “Cancelar” e “Confirmar" bem posicionados,

* Representações visuais de atividades (ex.: spinning, funcional, musculação).

O design promove clareza nas ações e reduz erros do usuário.

<img width="300" height="900" alt="Image" src="https://github.com/user-attachments/assets/689240b8-681a-47de-9312-b062a243c03e" />

Imagem 6 - Aulas

## Treinos
A tela de treinos apresenta:

* Cards verticais com o nome do treino, grupo muscular e imagem ilustrativa do respectivo treino,

* Separação por níveis ou tipos de exercício,

* Acesso rápido ao detalhamento de cada treino.

A interface prioriza organização e clareza para o aluno visualizar seus planos de exercício como separação por cores de grupos de treinos (Peito cor roxa, ombros cor verde, etc...).

<img width="300" height="900" alt="Image" src="https://github.com/user-attachments/assets/cdbed148-9ff7-44a0-81ad-c3879d9b96b6" />

Imagem 7 - Treinos

## Perfil
Nessa seção, o usuário pode gerenciar:

* dados pessoais,

* peso, idade e outras métricas,

* informações de contato,

* Trocar senha.

O layout lembra uma tela de configurações, porém com estética fitness e elementos visuais consistentes com o restante do app.

<img width="300" height="900" alt="Image" src="https://github.com/user-attachments/assets/a917575c-b4af-499a-9997-26d0e44d4a70" />

Imagem 8 - Perfil

## Interações do Usuário

As interações foram pensadas para serem naturais e consistentes:

* Toques diretos em cards, ícones e opções.

* Transições suaves entre telas, reforçando continuidade.

* Feedback visual em botões (alteração de cor, animações curtas).

* Uso de ícones intuitivos para navegação pela barra inferior.

* Uso de componentes nativos mobile, garantindo familiaridade.

### Wireframes
Os wireframes do TrainerHub seguem um visual dark, com cards grandes, botões arredondados e ícones simples, mantendo sempre o mesmo estilo moderno e fitness. Todas as telas usam fotos de fundo, cores fortes para destaque e uma navegação inferior fixa. A organização é vertical, com elementos bem espaçados e consistentes em todo o app.

<img width="795" height="828" alt="Image" src="https://github.com/user-attachments/assets/9085846e-5aef-46b7-9762-60c6c24bc144" />

Imagem 9 - WireFrames

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
1. A aplicação mobile utiliza React Native com Expo, exigindo apenas um ambiente com Node.js e Expo CLI para gerar a aplicação. Para publicação, é necessário acesso a serviços de build do Expo e, caso o app seja distribuído as máquinas configuradas para geração de builds nativas (Android e iOS). O backend deve estar hospedado e acessível por meio de uma URL estável.

2. Como o app é distribuído via Expo Go durante o desenvolvimento, o que precisa de hospedagem é apenas o backend. Pode-se utilizar plataformas como Render, Railway, Vercel, DigitalOcean ou outro serviço de nuvem que suporte a API utilizada pela aplicação.

3. No backend, configurar variáveis como URL do banco de dados, chaves de acesso e parâmetros de segurança. No front-end, ajustar variáveis de ambiente para apontar para a API em produção. Todas as dependências devem estar instaladas conforme definido no projeto.

4. Enviar o backend para a plataforma selecionada e validar que a API está acessível. O app em React Native pode ser executado por meio do Expo Go no dispositivo móvel para acessar a versão apontando para o backend em produção. Quando necessário, também é possível gerar builds nativas usando o serviço de build do Expo.

5. Validar funcionalidades diretamente no dispositivo físico, garantindo funcionamento de autenticação, navegação, carregamento de dados, imagens e demais recursos integrados ao backend hospedado

<!-- [Instruções para implantar a aplicação distribuída em um ambiente de produção.]

1. Defina os requisitos de hardware e software necessários para implantar a aplicação em um ambiente de produção.
2. Escolha uma plataforma de hospedagem adequada, como um provedor de nuvem ou um servidor dedicado.
3. Configure o ambiente de implantação, incluindo a instalação de dependências e configuração de variáveis de ambiente.
4. Faça o deploy da aplicação no ambiente escolhido, seguindo as instruções específicas da plataforma de hospedagem.
5. Realize testes para garantir que a aplicação esteja funcionando corretamente no ambiente de produção. -->

## Testes
Fluxo de Login
- Foram realizadas múltiplas tentativas de login utilizando e-mail e senha.
- Os logs confirmam o envio correto dos dados para a API.
- O retorno do servidor indica que o login foi processado e a resposta foi recebida sem erros críticos de autenticação.

Carregamento e Exibição dos Dados do Usuário
- Após o login, o app requisita informações do perfil.
- Os dados retornados incluem CPF, nome completo, gênero, data de criação, data de nascimento, peso, altura, telefone e outros identificadores.
- Os logs mostram que a aplicação consegue interpretar e exibir esses dados de maneira consistente.

Teste de Salvamento/Atualização de Perfil
- O app envia payloads contendo informações atualizadas do usuário (peso, altura, nome etc.).
- As requisições são aceitas pela API e retornam Status HTTP 200, indicando sucesso no salvamento.
- O log mostra o corpo enviado e o retorno da API, confirmando a integridade do processo.

Alertas de Depreciação
- Foram emitidos avisos do React Native sobre componentes que serão removidos no futuro (react-native-safe-area-context).
- Esses avisos não impedem o funcionamento, mas indicam necessidade de atualização futura.

Erros de Estilo (não críticos)
- Há logs de pequenos erros como “Property styles doesn’t exist”, relacionados provavelmente a algum componente visual.
- Eles não interrompem os testes de API, mas indicam ajustes no front-end.

<img width="1280" height="775" alt="Image" src="https://github.com/user-attachments/assets/34f63fc8-d6e6-4232-a67e-b1b8afa1ceba" />

Imagem 10 - Testes

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
| Lucas         |Atualização GitHub|    10/11/2025  | 30/11/2025 | ✔️      |   17/11/2025   |
| Wellington    |Projeto interface |    10/11/2025  | 30/11/2025 | ✔️      |   29/11/2025   |
| Leonardo      |Atualização GitHub|    10/11/2025  | 30/11/2025 | ✔️      |   30/11/2025   |


Legenda:
- ✔️: terminado
- 📝: em execução
- ⌛: atrasado
- ❌: não iniciado

