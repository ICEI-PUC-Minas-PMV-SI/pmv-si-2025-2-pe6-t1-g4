# Apresentação da Solução

## Considerações Finais — Projeto TrainerHub

Este documento apresenta a avaliação final do projeto TrainerHub, nas documentações internas e nos artefatos disponíveis (front-end web, front-end mobile, backend). 

## 1. Avaliação dos frameworks e tecnologias

**Resumo das tecnologias**

- Front-end Web: React (Create React App), MUI.
- Front-end Mobile: React Native com Expo, Supabase JS.
- Backend: PHP, PDO para Postgres, integração direta com schema do Supabase.
- Banco de dados: PostgreSQL (via Supabase).
- Ferramentas: Composer (PHP), npm yarn (JS).

**Pontos fortes**

- **React + MUI (web):** rápido para entregar UI com componentes prontos, boa compatibilidade com acessibilidade e temas.
- **React Native + Expo (mobile):** acelera prototipação e facilita builds multiplataforma; integração com supabase facilita autenticação de dados em tempo real.
- **PHP + Postgres:** leve, de fácil implantação em PHP hostings; integração direta com Supabase permite controle manual das queries e capacidade de customização.
- **Supabase (Postgres):** oferece backend-as-a-service reduz esforço com infra de autenticação e real-time.

**Pontos fracos**

- **Integração entre módulos pouco padronizada:** a comunicação entre Web, Mobile e Backend PHP não seguiu um padrão unificado de arquitetura (ex.: REST padronizado, versionamento, documentação de rotas), o que dificultou testes e alinhamento entre as partes.
- **Ausência de um backend centralizado:** como cada camada acessava ou manipulava dados de forma independente, houve maior risco de inconsistências, duplicação de lógica e dificuldade de manutenção.
- **Dependência de desenvolvimento local:** a ausência de um ambiente unificado de testes impediu que a equipe visualizasse o produto integrado em tempo real, o que atrasou a identificação de problemas e exigiu sincronização manual de arquivos.

**Recomendações**

- Integração mais clara entre módulos
- Redução de divergências no desenvolvimento
- Documentação melhor distribuída
- Fluxo mais previsível
- Maior eficiência na colaboração

## 2. Análise crítica da arquitetura e propostas de melhoria

### 2.1 Arquitetura 

### 2.3 Propostas de melhoria arquitetural 

## 3. Retrato atualizado da gestão do trabalho

### Último Mês

Atualizado em: 04/11/2025

| Responsável   | Tarefa/Requisito | Iniciado em    | Prazo      | Status | Terminado em    |
| :----         |    :----         |      :----:    | :----:     | :----: | :----:          |
| Leonardo      | Slide/Apresentação          | 30/11/2025  | 02/11/2025 | ✔️    | 02/11/2025 |
| Leonardo      | Atualização da Conclusão    | 04/12/2025  | 07/12/2025 | ✔️    | 04/12/2025 |
| Wellington    | Desonvolvimento Vídeo Mobile| 04/12/2025  | 05/11/2025 | ✔️    | 04/12/2025 |
| Wellington    | Interligação Mobile         | 28/11/2025  | 05/12/2025 | ✔️    | 04/12/2025 |
| Lucas         | Desenvolvimento Vídeo Web   | 03/12/2025  | 05/12/2025 | ✔️    | 04/12/2025 |
| Augusto       | Desenvolvimento Vídeo Web   | 03/12/2025  | 05/12/2025 | ✔️    | 04/12/2025 |

Na última entrega do trabalho, todos os integrantes do grupo colaboraram ativamente para a realização da Etapa final, o que tornou a entrega mais consistente e bem estruturada. Houve maior integração entre os membros, melhor comunicação e alinhamento das ideias, permitindo que as tarefas fossem concluídas dentro do prazo e com melhor qualidade, conforme relatado no quadro acima.

## 4. Comentários sobre responsabilidades e atribuições da equipe

A equipe utilizou o quadro descrito, seguindo práticas de metodologia ágil. Ferramentas como o Trello foram adotadas para organizar, distribuir e acompanhar as tarefas de cada integrante, tornando o fluxo de trabalho mais eficiente. Esse método permitiu uma visão geral do progresso, facilitando o alinhamento das responsabilidades individuais.

### 4.1 Pontos Negativos

Na prática, porém, a equipe não manteve o foco na utilização consistente das ferramentas propostas para a execução das etapas do projeto. Como consequência, ocorreram atrasos, retrabalhos e dificuldade na localização dos arquivos ao longo do percurso. Além disso, não houve a definição de um líder ou responsável por centralizar as decisões e garantir o alinhamento entre os membros. Essa ausência de liderança resultou em divergências na comunicação, falta de direcionamento claro e redução na eficiência da equipe em momentos críticos.

### 4.2 Possíveis Melhorias

- Adotar o quadro de tarefas como fonte oficial de acompanhamento do projeto, garantindo que todos os membros atualizem o status de suas atividades regularmente. Isso reduz retrabalhos e aumenta a visibilidade coletiva do progresso.
- Eleger um responsável por centralizar decisões, organizar reuniões rápidas de alinhamento e assegurar que todos compreendam suas atribuições. Esse papel melhora a comunicação e evita divergências durante o desenvolvimento.
- Registrar decisões, responsabilidades e fluxos de desenvolvimento no Notion ou em um documento compartilhado ajuda a organizar o conhecimento e facilita a entrada de outros membros no projeto. (com mais frequência)

## 5. Conclusão

O projeto TrainerHub possui uma base técnica sólida, fundamentada em escolhas de tecnologia modernas, que se mostraram adequadas para a construção de um produto multiplataforma, simples de manter e coerente com os objetivos da disciplina. Todas as ideias implementadas representam de forma fiel aquilo que o projeto deseja demonstrar: uma solução funcional, intuitiva e alinhada às necessidades de uma aplicação voltada para o ambiente fitness.

