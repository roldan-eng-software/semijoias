---
name: arquitetura
description: Planejamento integral de arquitetura de software, design system, fluxos de navegação e modelagem de dados. Utilize este skill SEMPRE que o usuário iniciar um novo projeto, funcionalidade complexa ou mencionar "arquitetura", "banco de dados", "diagramas", "ER", "design", "estilos" ou "fluxo do sistema". Este skill força o planejamento e design (Stitch MCP) ANTES da escrita de código.
---

# Arquitetura

Este skill é o ponto de partida obrigatório para qualquer desenvolvimento estruturado. Ele garante que a base técnica, a hierarquia de acesso e a experiência do usuário (UX/UI) sejam validadas antes da implementação.

## Processo de Trabalho Obrigatório

O agente não deve escrever código funcional antes de completar as fases desta arquitetura.

### 1. Entrevista de Contexto (Obrigatória)

Antes de qualquer diagrama ou design, o agente DEVE fazer as seguintes perguntas:

- Qual é o **tema central** e o **foco principal** do projeto?
- Quais problemas específicos ele resolve para os usuários?
- Quem são os perfis de usuário (atualmente definidos como Admin, Gestor e Usuário), e quais suas responsabilidades principais?
- Há alguma restrição tecnológica ou integração (MCPs) específica desejada?

### 2. Estrutura de Acesso e Rotas

Defina a hierarquia de permissões (RBAC - Role-Based Access Control):

- **Admin**: Controle total do sistema, gerenciamento de usuários e configurações globais.
- **Gestor**: Acesso a relatórios, gerenciamento de equipes ou departamentos, mas sem configurações críticas.
- **Usuário**: Acesso básico às funcionalidades principais do produto.

Mappeie as rotas principais da aplicação e qual nível de acesso cada uma exige.

### 3. Modelagem de Dados (MER/DER)

Crie diagramas usando a sintaxe **Mermaid** diretamente no chat:

- **ER (Entidade-Relacionamento)**: Foque nos conceitos e associações lógicas.
- **DER (Diagrama Entidade-Relacionamento)**: Detalhe tabelas, campos, chaves primárias (PK) e estrangeiras (FK), e tipos de dados.
- Explique as decisões de modelagem (por que usar certas relações, normalização, etc.).

### 4. Fluxo e Navegação

- **Sitemap**: Estrutura hierárquica de todas as páginas/telas do sistema.
- **User Flow**: Diagrama detalhando o caminho do usuário desde o login até as tarefas principais (ex: checkout, criação de post, etc.). Utilize Mermaid para visualização.

### 5. Design System e Estilos

Defina os tokens de design básicos:

- **Cores**: Defina uma paleta primária, secundária, neutros e estados (sucesso, erro, alerta). Use valores HSL ou Hex.
- **Tipografia**: Escolha fontes modernas (ex: Inter, Montserrat) e defina a escala de tamanhos (h1, h2, corpo, pequeno).
- **Espaçamento**: Defina uma escala de spacing (ex: múltiplos de 4px ou 8px).

### 6. Design Frontend Preview (Stitch MCP) - ANTES DO CÓDIGO

**IMPORTANTE:** Nunca comece a codar antes de gerar o design visual das telas.
Utilize o MCP `StitchMCP` para:

1. Criar um projeto com `create_project`.
2. Definir o **Design System** global com `create_design_system` (configurando fontes, cores e estilo).
3. Gerar as telas principais usando `generate_screen_from_text` com base no sitemap.
4. Refinar com `edit_screens` conforme o feedback do usuário.
5. Apresentar as telas geradas para validação final antes da materialização do código.

### 7. Tecnologias e MCPs

Liste quais tecnologias serão usadas (ex: Next.js, Prisma, Neon DB) e quais MCPs serão necessários para as funcionalidades (ex: context7 para docs, github para backup).

## Regras de Resposta

1. Seja consultivo e estratégico, agindo como um Arquiteto de Software Sênior.
2. Sempre use blocos de código Mermaid para diagramas.
3. Não ignore a fase de design no Stitch; ela é fundamental para alinhar expectativas.
