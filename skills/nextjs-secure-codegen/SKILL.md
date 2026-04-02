---
name: nextjs-secure-codegen
description: >
  Skill de instrução para agentes de IA geradores de código em projetos Next.js + TailwindCSS
  com banco de dados Neon (PostgreSQL), hospedagem na Vercel. Foco principal em segurança
  cibernética: geração de código seguro, proteção contra ataques (XSS, CSRF, SQL Injection,
  SSRF, etc.), validação de inputs, headers de segurança, autenticação robusta, rate limiting
  e testes de segurança automatizados. Use quando o agente estiver gerando ou revisando código
  para projetos Next.js que exigem alto padrão de segurança.
metadata:
  author: sandro-roldan
  version: '1.0'
  stack: Next.js, TailwindCSS, Neon PostgreSQL, Vercel
  language: pt-BR
---

# Next.js Secure Code Generator

Instruções para agentes de IA que geram código em projetos Next.js + TailwindCSS com banco Neon e deploy na Vercel. Todo código gerado DEVE seguir padrões de segurança rigorosos contra ataques cibernéticos.

## Quando Usar Esta Skill

Use sempre que o agente estiver:

- Criando novos componentes, páginas, API Routes ou Server Actions em Next.js
- Configurando conexão com banco de dados Neon (PostgreSQL)
- Implementando autenticação e autorização
- Criando formulários ou inputs que recebem dados do usuário
- Configurando deploy e variáveis de ambiente na Vercel
- Revisando ou refatorando código existente para segurança
- Criando middlewares, rotas protegidas ou lógica de acesso

## Princípios Fundamentais

1. **Nunca confiar no client-side** — toda validação e autorização DEVE ser refeita no servidor
2. **Defesa em profundidade** — múltiplas camadas de segurança, nunca depender de uma só
3. **Princípio do menor privilégio** — conceder apenas as permissões mínimas necessárias
4. **Falhar de forma segura** — em caso de erro, negar acesso por padrão
5. **Validar todas as entradas** — todo dado vindo do usuário é potencialmente malicioso
6. **Manter segredos no servidor** — nunca expor chaves, tokens ou credenciais ao navegador

## Instruções de Geração de Código

### 1. Estrutura de Projeto Segura

Ao criar ou modificar a estrutura do projeto:

```
projeto/
├── .env.local              # Segredos locais (NUNCA commitar)
├── .env.example             # Template sem valores reais
├── .gitignore               # Deve incluir .env*, .next, node_modules
├── next.config.ts           # Headers de segurança obrigatórios
├── middleware.ts             # Proteção de rotas (NÃO ser a única camada de auth)
├── src/
│   ├── app/
│   │   ├── api/             # API Routes com validação Zod em todas
│   │   ├── (auth)/          # Route group para páginas autenticadas
│   │   └── (public)/        # Route group para páginas públicas
│   ├── lib/
│   │   ├── db.ts            # Conexão segura com Neon (pool + SSL)
│   │   ├── auth.ts          # Lógica de autenticação centralizada
│   │   ├── validation.ts    # Schemas Zod reutilizáveis
│   │   └── rate-limit.ts    # Rate limiting configurável
│   └── middleware/
│       └── security.ts      # Funções de segurança reutilizáveis
```

### 2. Headers de Segurança Obrigatórios

Todo projeto DEVE ter estes headers no `next.config.ts`:

```typescript
// next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  poweredBy: false, // Remove header X-Powered-By
  headers: async () => [
    {
      source: '/(.*)',
      headers: [
        {
          key: 'Content-Security-Policy',
          value: [
            "default-src 'self'",
            "script-src 'self' 'nonce-{NONCE}'",
            "style-src 'self' 'unsafe-inline'", // TailwindCSS precisa
            "img-src 'self' data: https:",
            "font-src 'self'",
            "connect-src 'self'",
            "frame-ancestors 'none'",
            "base-uri 'self'",
            "form-action 'self'",
          ].join('; '),
        },
        {
          key: 'Strict-Transport-Security',
          value: 'max-age=31536000; includeSubDomains; preload',
        },
        {
          key: 'X-Frame-Options',
          value: 'DENY',
        },
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff',
        },
        {
          key: 'Referrer-Policy',
          value: 'strict-origin-when-cross-origin',
        },
        {
          key: 'Permissions-Policy',
          value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
        },
      ],
    },
  ],
};

export default nextConfig;
```

### 3. Conexão Segura com Neon

SEMPRE usar conexão com SSL e pool configurado:

```typescript
// src/lib/db.ts
import { neon, neonConfig } from '@neondatabase/serverless';
import { Pool } from '@neondatabase/serverless';

// Validar que a variável existe no servidor
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL não configurada');
}

// Para queries simples (serverless-friendly)
neonConfig.fetchConnectionCache = true;
export const sql = neon(process.env.DATABASE_URL);

// Para conexões com pool (API Routes)
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { require: true },
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

// NUNCA construir queries com concatenação de strings
// ❌ PROIBIDO: sql(`SELECT * FROM users WHERE id = ${userId}`)
// ✅ CORRETO: sql(`SELECT * FROM users WHERE id = $1`, [userId])
```

### 4. Validação de Inputs com Zod

TODA entrada de dados DEVE ser validada com Zod no servidor:

```typescript
// src/lib/validation.ts
import { z } from 'zod';

// Sanitizar strings para prevenir XSS
const sanitizedString = z.string().transform((val) =>
  val.replace(/[<>'"]/g, '').trim()
);

// Schemas reutilizáveis
export const emailSchema = z.string().email().max(255).toLowerCase();
export const passwordSchema = z.string().min(8).max(128);
export const idSchema = z.string().uuid();
export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

// Exemplo de schema para criação de recurso
export const createUserSchema = z.object({
  name: sanitizedString.min(2).max(100),
  email: emailSchema,
  password: passwordSchema,
});
```

### 5. API Routes Seguras

TODA API Route DEVE seguir este padrão:

```typescript
// src/app/api/example/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { verifyAuth } from '@/lib/auth';
import { rateLimit } from '@/lib/rate-limit';
import { sql } from '@/lib/db';

const bodySchema = z.object({
  title: z.string().min(1).max(200).trim(),
  content: z.string().min(1).max(5000).trim(),
});

export async function POST(request: NextRequest) {
  try {
    // 1. Rate limiting
    const rateLimitResult = await rateLimit(request);
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Muitas requisições. Tente novamente mais tarde.' },
        { status: 429 }
      );
    }

    // 2. Autenticação (NUNCA depender apenas do middleware)
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    // 3. Validação do body
    const body = await request.json();
    const parsed = bodySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    // 4. Query parametrizada (NUNCA concatenar)
    const result = await sql(
      'INSERT INTO posts (title, content, user_id) VALUES ($1, $2, $3) RETURNING id',
      [parsed.data.title, parsed.data.content, user.id]
    );

    // 5. Resposta sem expor dados internos
    return NextResponse.json({ id: result[0].id }, { status: 201 });

  } catch (error) {
    // 6. Log do erro real, resposta genérica ao cliente
    console.error('Erro em POST /api/example:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
```

### 6. Server Actions Seguras

```typescript
'use server';

import { z } from 'zod';
import { auth } from '@/lib/auth';
import { sql } from '@/lib/db';
import { revalidatePath } from 'next/cache';

const updateProfileSchema = z.object({
  name: z.string().min(2).max(100).trim(),
  bio: z.string().max(500).trim().optional(),
});

export async function updateProfile(formData: FormData) {
  // 1. Autenticar no Server Action (OBRIGATÓRIO)
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('Não autorizado');
  }

  // 2. Validar inputs
  const parsed = updateProfileSchema.safeParse({
    name: formData.get('name'),
    bio: formData.get('bio'),
  });

  if (!parsed.success) {
    return { error: 'Dados inválidos', details: parsed.error.flatten() };
  }

  // 3. Query parametrizada
  await sql(
    'UPDATE users SET name = $1, bio = $2, updated_at = NOW() WHERE id = $3',
    [parsed.data.name, parsed.data.bio ?? null, session.user.id]
  );

  revalidatePath('/profile');
  return { success: true };
}
```

### 7. Middleware de Proteção de Rotas

> **ALERTA CRÍTICO**: Middleware NÃO deve ser a única camada de autenticação.
> A CVE-2025-29927 demonstrou que middlewares Next.js podem ser bypassados.
> Sempre re-verificar auth em API Routes e Server Actions.

```typescript
// middleware.ts
import { NextRequest, NextResponse } from 'next/server';

const protectedPaths = ['/dashboard', '/api/protected', '/admin'];
const publicPaths = ['/', '/login', '/register', '/api/public'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Bloquear header de bypass (CVE-2025-29927)
  if (request.headers.get('x-middleware-subrequest')) {
    return new NextResponse(null, { status: 403 });
  }

  // Verificar se a rota é protegida
  const isProtected = protectedPaths.some((path) =>
    pathname.startsWith(path)
  );

  if (isProtected) {
    const token = request.cookies.get('session-token')?.value;
    if (!token) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Adicionar headers de segurança extras
  const response = NextResponse.next();
  response.headers.set('X-Request-Id', crypto.randomUUID());
  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|public/).*)'],
};
```

### 8. Rate Limiting

```typescript
// src/lib/rate-limit.ts
import { NextRequest } from 'next/server';

const rateLimitMap = new Map<string, { count: number; timestamp: number }>();

interface RateLimitConfig {
  windowMs: number;   // Janela de tempo em ms
  maxRequests: number; // Máximo de requisições na janela
}

const configs: Record<string, RateLimitConfig> = {
  default: { windowMs: 15 * 60 * 1000, maxRequests: 100 },
  auth: { windowMs: 15 * 60 * 1000, maxRequests: 5 },
  upload: { windowMs: 60 * 60 * 1000, maxRequests: 10 },
};

export async function rateLimit(
  request: NextRequest,
  type: keyof typeof configs = 'default'
) {
  const ip = request.headers.get('x-forwarded-for') ?? 'unknown';
  const key = `${ip}:${type}`;
  const config = configs[type];
  const now = Date.now();

  const entry = rateLimitMap.get(key);

  if (!entry || now - entry.timestamp > config.windowMs) {
    rateLimitMap.set(key, { count: 1, timestamp: now });
    return { success: true, remaining: config.maxRequests - 1 };
  }

  if (entry.count >= config.maxRequests) {
    return { success: false, remaining: 0 };
  }

  entry.count++;
  return { success: true, remaining: config.maxRequests - entry.count };
}
```

### 9. Variáveis de Ambiente

Regras obrigatórias:

- **NUNCA** prefixar segredos com `NEXT_PUBLIC_` (isso expõe ao navegador)
- **SEMPRE** incluir `.env.local` e `.env` no `.gitignore`
- **SEMPRE** validar que variáveis existem antes de usar
- **SEMPRE** criar `.env.example` com chaves sem valores

```typescript
// src/lib/env.ts
import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string().url().startsWith('postgresql://'),
  JWT_SECRET: z.string().min(32),
  NEXTAUTH_SECRET: z.string().min(32),
  NEXTAUTH_URL: z.string().url(),
  NODE_ENV: z.enum(['development', 'production', 'test']),
});

// Validar na inicialização
export const env = envSchema.parse(process.env);
```

```bash
# .env.example
DATABASE_URL=
JWT_SECRET=
NEXTAUTH_SECRET=
NEXTAUTH_URL=http://localhost:3000
NODE_ENV=development
```

### 10. Proteção contra CSRF em Server Actions

Next.js Server Actions já verificam `Origin` vs `Host` automaticamente. Para API Routes customizadas:

```typescript
// src/lib/csrf.ts
import { NextRequest } from 'next/server';

export function verifyCsrf(request: NextRequest): boolean {
  const origin = request.headers.get('origin');
  const host = request.headers.get('host');

  if (!origin || !host) return false;

  const originHost = new URL(origin).host;
  return originHost === host;
}
```

### 11. Tratamento Seguro de Erros

NUNCA expor detalhes internos ao cliente:

```typescript
// ❌ PROIBIDO
return NextResponse.json({ error: error.message, stack: error.stack });

// ❌ PROIBIDO
return NextResponse.json({ error: 'Query falhou: SELECT * FROM users...' });

// ✅ CORRETO
console.error('Erro interno:', error); // Log para debug
return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
```

### 12. Cookies Seguros

Sempre configurar cookies com flags de segurança:

```typescript
import { cookies } from 'next/headers';

(await cookies()).set('session-token', token, {
  httpOnly: true,       // Impede acesso via JavaScript
  secure: true,         // Apenas HTTPS
  sameSite: 'lax',      // Proteção CSRF
  maxAge: 60 * 60 * 24, // 24 horas
  path: '/',
});
```

## Regras para Testes de Segurança

Ao gerar código, o agente DEVE incluir ou sugerir testes para:

1. **Validação de inputs** — testar com dados maliciosos (SQL injection, XSS payloads)
2. **Autenticação** — testar acesso sem token, token expirado, token inválido
3. **Autorização** — testar acesso a recursos de outros usuários
4. **Rate limiting** — testar que limites são aplicados corretamente
5. **Headers de segurança** — verificar presença de todos os headers obrigatórios
6. **Variáveis de ambiente** — testar que app falha se variáveis críticas estão ausentes

Consultar `references/security-checklist.md` para o checklist completo de auditoria.
Consultar `references/secure-code-patterns.md` para padrões de código e testes detalhados.

## Regras que o Agente NUNCA Deve Quebrar

1. **NUNCA** usar `dangerouslySetInnerHTML` sem sanitizar com DOMPurify
2. **NUNCA** concatenar strings em queries SQL — usar parametrização
3. **NUNCA** armazenar tokens em `localStorage` ou `sessionStorage`
4. **NUNCA** expor `DATABASE_URL` ou secrets com `NEXT_PUBLIC_`
5. **NUNCA** confiar em dados do client-side sem revalidar no servidor
6. **NUNCA** retornar stack traces ou mensagens de erro internas ao cliente
7. **NUNCA** depender exclusivamente do middleware para autenticação
8. **NUNCA** usar `eval()`, `Function()` ou `innerHTML` com dados de usuário
9. **NUNCA** desativar SSL na conexão com Neon
10. **NUNCA** commitar arquivos `.env` no repositório
