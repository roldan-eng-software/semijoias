---
name: inicio-projeto-next
description: Automates the setup of a new Next.js project with TailwindCSS and DaisyUI pre-configured. Use this skill whenever the user asks to "iniciar um projeto", "começar projeto Next", "setup inicial", or "criar base limpa". This skill must perform all setup steps automatically without asking the user for configuration details.
---

# Inicio Projeto Next

Esta skill automatiza a criação de um novo projeto Next.js com TailwindCSS e DaisyUI, seguindo as melhores práticas de desenvolvimento e design.

## Regras Críticas

- **NÃO FAÇA PERGUNTAS**: O usuário quer que você configure tudo automaticamente.
- **STACK FIXA**: Next.js (App Router, TypeScript, TailwindCSS) + DaisyUI.
- **DESIGN PREMIUM**: O projeto deve começar com uma estética moderna e limpa.

## Execução do Setup

1.  **Inicialização do Next.js**
    Execute o seguinte comando para criar a base do projeto no diretório atual:

    ```bash
    npx -y create-next-app@latest ./ --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm --no-git
    ```

2.  **Instalação do DaisyUI e Utilitários**
    Instale o DaisyUI e utilitários úteis:

    ```bash
    npm install -D daisyui@latest lucide-react
    npm install theme-change
    ```

3.  **Configuração Automática**
    Execute o script de configuração fornecido pela skill (está localizado em `.agent/skills/inicio-projeto-next/scripts/config-setup.mjs`):

    ```bash
    node .agent/skills/inicio-projeto-next/scripts/config-setup.mjs
    ```

4.  **Interface Inicial (Home Page)**
    Substitua o `src/app/page.tsx` por uma landing page minimalista mas impressionante usando DaisyUI:
    - Use uma Hero section.
    - Inclua um componente de Navbar simples.
    - Adicione um seletor de temas (integrando `theme-change`).

5.  **Organização de Pastas**
    Crie as pastas básicas no diretório `src/`:
    - `src/components/`
    - `src/lib/`
    - `src/hooks/`
    - `src/services/`

## Finalização

Ao terminar, informe ao usuário que o projeto foi configurado com sucesso e está pronto para rodar (`npm run dev`). Destaque que a DaisyUI está ativa e o projeto segue as melhores práticas do Next.js App Router.
