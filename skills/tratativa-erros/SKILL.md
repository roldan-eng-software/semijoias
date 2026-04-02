---
name: Tratativa-Erros
description: Configura um sistema completo de tratativa de erros para projetos Next.js. Use esta skill quando o usuário mencionar "erros", "exceções", "logs", "telas de erro" ou "debugging", ou ao iniciar a arquitetura de um novo projeto. Garante que os erros sejam amigáveis na UI (DaisyUI) e detalhados no terminal em desenvolvimento (localhost).
---

# Skill de Tratativa de Erros (Next.js + DaisyUI)

Esta skill fornece um fluxo de trabalho padronizado para gerenciar erros em projetos Next.js, garantindo uma experiência de usuário premium e facilidade de depuração para o desenvolvedor.

## Objetivos Criados
1.  **Visibilidade na UI**: Erros amigáveis e informativos para o usuário final.
2.  **Rastreabilidade no Terminal**: Logs detalhados no servidor (terminal) durante o desenvolvimento local.
3.  **Resiliência**: Captura global de erros para evitar que a aplicação trave (white screen of death).

## 🛠️ Stack Recomendada
- **Framework**: Next.js (App Router + TypeScript)
- **UI**: DaisyUI + TailwindCSS
- **Ícones**: Lucide React (padrão do Next.js moderno)

## 🚀 Como Aplicar (Configuração Automática)

A forma mais rápida de configurar o sistema é executando o script de setup:

```bash
node .agent/skills/tratativa-erros/scripts/setup-error-handling.mjs
```

Este script criará/atualizará:
- `src/app/error.tsx`: Catch-all para erros de rota.
- `src/app/not-found.tsx`: Página 404 personalizada.
- `src/app/global-error.tsx`: Handler de erro crítico da raiz.
- `src/lib/logger.ts`: Utilitário de log inteligente.

## 📝 Guia de Implementação Manual

Se preferir fazer manualmente ou precisar de customização:

### 1. Sistema de Logs (`src/lib/logger.ts`)
Centralize todos os logs aqui. Ele deve mostrar detalhes apenas em `localhost`.

```typescript
export const logger = {
  error: (message: string, error?: any) => {
    const isDev = process.env.NODE_ENV === 'development';
    console.error(`[ERROR] ${message}`);
    if (isDev && error) {
      console.error(error); // Mostra o stack trace completo no terminal
    }
  },
  info: (message: string) => {
    console.log(`[INFO] ${message}`);
  }
};
```

### 2. Tela de Erro Interativa (`src/app/error.tsx`)
Use componentes da DaisyUI para uma interface que "Uau" o usuário mesmo no erro.

```tsx
'use client';
import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log automático no console do cliente
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-4 text-center">
      <div className="alert alert-error max-w-lg shadow-lg">
        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        <div className="flex flex-col text-left">
          <h3 className="font-bold text-lg">Ops! Algo deu errado.</h3>
          <p className="text-sm">O sistema encontrou um erro inesperado. Já estamos cientes.</p>
        </div>
      </div>
      <button 
        onClick={() => reset()} 
        className="btn btn-primary mt-8 gap-2"
      >
        Tentar Novamente
      </button>
    </div>
  );
}
```

### 3. Tratativa em Server Actions
Sempre envolva a lógica de mutação com o logger:

```typescript
'use server';
import { logger } from "@/lib/logger";

export async function myAction(data: any) {
  try {
    // ... lógica
  } catch (error) {
    logger.error("Falha ao executar myAction", error);
    throw new Error("Não foi possível processar sua solicitação.");
  }
}
```

## ⚠️ Regras Importantes
- **Nunca exponha erros sensíveis** (como segredos do Banco de Dados) na UI para o usuário.
- **Sempre logue o erro no servidor** antes de enviá-lo ao cliente.
- **Use o logger** em vez de `console.log` direto para facilitar a migração para sistemas como Sentry no futuro.
