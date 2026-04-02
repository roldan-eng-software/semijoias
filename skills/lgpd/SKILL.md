---
name: LGPD
description: Guia completo para adequação de projetos Next.js às leis brasileiras de LGPD (Lei Geral de Proteção de Dados). Use esta skill sempre que o usuário mencionar "privacidade", "cookies", "LGPD", "termos de uso", "proteção de dados" ou quando precisar ajustar o sistema de autenticação para conformidade legal no Brasil.
---

# Skill LGPD: Conformidade para Projetos Web Modernos

Esta skill fornece um roteiro técnico e normativo para garantir que aplicações Next.js (utilizando TailwindCSS, DaisyUI, Prisma/Neon e Better Auth) estejam em conformidade com as exigências da LGPD atualizadas (2024/2025).

## 1. Gestão de Consentimento e Cookies (Frontend)

O banner de cookies deve ser granular e transparente. Não use banners que apenas possuem um botão "OK".

### Requisitos Técnicos:
*   **Granularidade:** O usuário deve poder escolher entre: (1) Necessários, (2) Analíticos, (3) Marketing.
*   **Equivalência de Botões:** O botão de "Rejeitar Todos" deve ter o mesmo destaque visual e facilidade que o "Aceitar Todos".
*   **Revogação:** Deve existir um link fixo no rodapé escrito "Gerenciar Preferências de Privacidade" para alterar o consentimento a qualquer momento.

### Implementação Sugerida com DaisyUI:
1. Use um component `Modal` ou `Drawer` para o gerenciamento de preferências.
2. Armazene o consentimento no `localStorage` e também no banco de dados se o usuário estiver logado.
3. Utilize hooks do Next.js para carregar scripts externos (como Google Analytics) apenas após o consentimento específico.

## 2. Transparência e Páginas Legais

O projeto DEVE conter as seguintes páginas acessíveis pelo rodapé:
- `/politica-de-privacidade`: Texto claro com linguagem simples.
- `/termos-de-uso`: Regras de uso do site.
- `/cookies`: Detalhamento de cada cookie utilizado.

> [!IMPORTANT]
> A LGPD exige que a informação seja acessível. Evite "juridiquês" excessivo e use hierarquia de cabeçalhos (H2, H3) para organizar o texto.

## 3. Direitos do Titular (Funcionalidades)

Você deve implementar rotas ou painéis que permitam ao usuário:
1. **Acesso:** Ver quais dados o sistema possui sobre ele.
2. **Correção:** Alterar dados incompletos ou inexatos.
3. **Exclusão (Esquecimento):** Deletar sua conta e todos os dados associados (respeitando prazos legais de guarda de documentos fiscais/legais).
4. **Portabilidade:** Baixar um JSON com seus dados.

## 4. Segurança e Backend (Neon/Prisma/Better Auth)

A segurança é o pilar preventivo da LGPD. Use as seguintes práticas:

### Criptografia e Proteção:
- Certifique-se de que todos os dados sensíveis no banco Neon sejam acessados via SSL/TLS.
- Se usar **Better Auth**, verifique se o log de auditoria de login está ativo para detectar tentativas de invasão.
- Minimize a coleta: Se você não precisa do CPF para a funcionalidade principal, NÃO o solicite.

### Logs de Auditoria:
A ANPD pode exigir prova de quem acessou os dados. No `Prisma`, use middlewares ou extensões para registrar logs de "Read/Write" em tabelas sensíveis.

## 5. Identificação do Encarregado (DPO)

Toda empresa (exceto agentes de pequeno porte sob certas condições) deve indicar um Encarregado de Dados.
*   Adicione no rodapé ou na página de privacidade o contato do DPO (ex: dpo@seusite.com.br).

## 6. Fluxo de Trabalho de Implementação

Sempre que esta skill for ativada, siga esta ordem:
1. **Mapeamento:** Pergunte quais dados são coletados e qual a base legal (Consentimento, Legítimo Interesse ou Execução de Contrato).
2. **Frontend:** Implemente o `CookieBanner` granular com DaisyUI.
3. **Páginas:** Crie os arquivos em `/app/(legal)/...` com o conteúdo fornecido pela assessoria jurídica ou templates padrão de mercado.
4. **Dashboard:** Adicione a aba "Privacidade" no perfil do usuário para gestão de dados e exclusão de conta.

---
> [!TIP]
> Use o componente `alert-info` do DaisyUI para informar usuários sobre atualizações na política de privacidade sempre que houver mudanças significativas.
