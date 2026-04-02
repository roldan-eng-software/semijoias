# Padrões de Código Seguro — Next.js + Neon + Vercel

Referência de padrões de código seguros com exemplos práticos. Use como guia ao gerar ou revisar código.

---

## 1. Padrão: Autenticação em API Route

### ✅ Correto — Verificação completa

```typescript
// src/app/api/users/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { verifySession } from '@/lib/auth';
import { sql } from '@/lib/db';

const paramsSchema = z.object({
  id: z.string().uuid(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // 1. Autenticar
  const session = await verifySession(request);
  if (!session) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  // 2. Validar parâmetros
  const { id } = await params;
  const parsed = paramsSchema.safeParse({ id });
  if (!parsed.success) {
    return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
  }

  // 3. Autorizar (user só acessa seus próprios dados)
  if (parsed.data.id !== session.userId && session.role !== 'admin') {
    return NextResponse.json({ error: 'Acesso negado' }, { status: 403 });
  }

  // 4. Query parametrizada
  const user = await sql(
    'SELECT id, name, email, created_at FROM users WHERE id = $1',
    [parsed.data.id]
  );

  if (user.length === 0) {
    return NextResponse.json({ error: 'Não encontrado' }, { status: 404 });
  }

  // 5. Retornar apenas campos necessários (sem senha, sem dados internos)
  return NextResponse.json(user[0]);
}
```

### ❌ Incorreto — Vulnerável

```typescript
// NUNCA FAZER ISSO
export async function GET(request: NextRequest, { params }) {
  // ❌ Sem autenticação
  // ❌ Sem validação de params
  // ❌ SQL concatenado
  // ❌ Retorna todos os campos (incluindo senha)
  const user = await sql(`SELECT * FROM users WHERE id = '${params.id}'`);
  return NextResponse.json(user[0]);
}
```

---

## 2. Padrão: Formulário Seguro com Server Action

### ✅ Correto

```tsx
// src/app/contact/page.tsx
'use client';

import { useActionState } from 'react';
import { submitContact } from './actions';

export default function ContactForm() {
  const [state, formAction, isPending] = useActionState(submitContact, null);

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Nome
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          maxLength={100}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm
                     focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          maxLength={255}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm
                     focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700">
          Mensagem
        </label>
        <textarea
          id="message"
          name="message"
          required
          maxLength={2000}
          rows={4}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm
                     focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      {state?.error && (
        <p className="text-sm text-red-600" role="alert">{state.error}</p>
      )}
      {state?.success && (
        <p className="text-sm text-green-600" role="alert">Mensagem enviada.</p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="rounded-md bg-blue-600 px-4 py-2 text-white
                   hover:bg-blue-700 disabled:opacity-50"
      >
        {isPending ? 'Enviando...' : 'Enviar'}
      </button>
    </form>
  );
}
```

```typescript
// src/app/contact/actions.ts
'use server';

import { z } from 'zod';
import { sql } from '@/lib/db';
import { rateLimit } from '@/lib/rate-limit';
import { headers } from 'next/headers';

const contactSchema = z.object({
  name: z.string().min(2).max(100).trim()
    .transform(val => val.replace(/[<>]/g, '')),
  email: z.string().email().max(255).toLowerCase(),
  message: z.string().min(10).max(2000).trim()
    .transform(val => val.replace(/[<>]/g, '')),
});

export async function submitContact(_prevState: unknown, formData: FormData) {
  // Rate limiting por IP
  const headersList = await headers();
  const ip = headersList.get('x-forwarded-for') ?? 'unknown';

  // Simular rate limit check
  // Em produção, usar sistema de rate limit real

  // Validar
  const parsed = contactSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    message: formData.get('message'),
  });

  if (!parsed.success) {
    return { error: 'Por favor, preencha todos os campos corretamente.' };
  }

  try {
    await sql(
      'INSERT INTO contacts (name, email, message) VALUES ($1, $2, $3)',
      [parsed.data.name, parsed.data.email, parsed.data.message]
    );
    return { success: true };
  } catch (error) {
    console.error('Erro ao salvar contato:', error);
    return { error: 'Não foi possível enviar. Tente novamente.' };
  }
}
```

---

## 3. Padrão: Conexão Neon com Drizzle ORM

```typescript
// src/lib/db.ts — Drizzle ORM com Neon (alternativa)
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL não definida');
}

const sql = neon(process.env.DATABASE_URL);
export const db = drizzle(sql, { schema });

// Uso seguro com Drizzle (queries são parametrizadas automaticamente)
// ✅ const users = await db.select().from(schema.users).where(eq(schema.users.id, userId));
// ❌ NUNCA: await db.execute(sql`SELECT * FROM users WHERE id = ${userId}`)
```

```typescript
// src/lib/schema.ts
import { pgTable, uuid, varchar, text, timestamp, boolean } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: text('password_hash').notNull(), // NUNCA armazenar senha em texto puro
  role: varchar('role', { length: 20 }).notNull().default('user'),
  isActive: boolean('is_active').notNull().default(true),
  emailVerified: boolean('email_verified').notNull().default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
```

---

## 4. Padrão: Upload de Arquivo Seguro

```typescript
// src/app/api/upload/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

// Magic bytes para verificação de tipo real
const MAGIC_BYTES: Record<string, number[]> = {
  'image/jpeg': [0xFF, 0xD8, 0xFF],
  'image/png': [0x89, 0x50, 0x4E, 0x47],
  'image/webp': [0x52, 0x49, 0x46, 0x46],
};

function verifyMagicBytes(buffer: ArrayBuffer, mimeType: string): boolean {
  const bytes = new Uint8Array(buffer);
  const expected = MAGIC_BYTES[mimeType];
  if (!expected) return false;
  return expected.every((byte, i) => bytes[i] === byte);
}

function sanitizeFilename(name: string): string {
  // Remover path traversal e caracteres perigosos
  return name
    .replace(/\.\./g, '')
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .substring(0, 100);
}

export async function POST(request: NextRequest) {
  const user = await verifyAuth(request);
  if (!user) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get('file') as File | null;

  if (!file) {
    return NextResponse.json({ error: 'Nenhum arquivo enviado' }, { status: 400 });
  }

  // 1. Verificar tipo MIME declarado
  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: 'Tipo de arquivo não permitido' }, { status: 400 });
  }

  // 2. Verificar tamanho
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: 'Arquivo muito grande (máx 5MB)' }, { status: 400 });
  }

  // 3. Verificar magic bytes (tipo REAL do arquivo)
  const buffer = await file.arrayBuffer();
  if (!verifyMagicBytes(buffer, file.type)) {
    return NextResponse.json({ error: 'Conteúdo do arquivo não corresponde ao tipo' }, { status: 400 });
  }

  // 4. Sanitizar nome do arquivo
  const safeName = sanitizeFilename(file.name);
  const uniqueName = `${crypto.randomUUID()}-${safeName}`;

  // 5. Fazer upload para storage seguro (exemplo com Vercel Blob)
  // const blob = await put(uniqueName, buffer, { access: 'public' });

  return NextResponse.json({ filename: uniqueName }, { status: 201 });
}
```

---

## 5. Padrão: Proteção contra SSRF

```typescript
// src/lib/safe-fetch.ts
import { z } from 'zod';

// Lista de domínios permitidos para requisições externas
const ALLOWED_DOMAINS = [
  'api.example.com',
  'cdn.example.com',
];

// IPs privados que NUNCA devem ser acessados
const PRIVATE_IP_RANGES = [
  /^10\./,
  /^172\.(1[6-9]|2[0-9]|3[0-1])\./,
  /^192\.168\./,
  /^127\./,
  /^0\./,
  /^169\.254\./,
  /^::1$/,
  /^fc00:/,
  /^fe80:/,
];

export async function safeFetch(url: string, options?: RequestInit): Promise<Response> {
  // Validar URL
  const urlSchema = z.string().url();
  const parsed = urlSchema.safeParse(url);
  if (!parsed.success) {
    throw new Error('URL inválida');
  }

  const urlObj = new URL(parsed.data);

  // Verificar protocolo
  if (!['http:', 'https:'].includes(urlObj.protocol)) {
    throw new Error('Protocolo não permitido');
  }

  // Verificar domínio na allowlist
  if (!ALLOWED_DOMAINS.includes(urlObj.hostname)) {
    throw new Error('Domínio não permitido');
  }

  // Verificar se não é IP privado
  if (PRIVATE_IP_RANGES.some((range) => range.test(urlObj.hostname))) {
    throw new Error('Acesso a IPs privados não permitido');
  }

  return fetch(parsed.data, {
    ...options,
    redirect: 'error', // Não seguir redirects automaticamente
  });
}
```

---

## 6. Padrão: Sanitização de HTML (quando necessário)

```typescript
// src/lib/sanitize.ts
import DOMPurify from 'isomorphic-dompurify';

const ALLOWED_TAGS = [
  'p', 'br', 'strong', 'em', 'ul', 'ol', 'li',
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'a', 'blockquote', 'code', 'pre',
];

const ALLOWED_ATTR = ['href', 'target', 'rel'];

export function sanitizeHtml(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    ALLOW_DATA_ATTR: false,
    ADD_ATTR: ['target'],
    FORBID_TAGS: ['script', 'style', 'iframe', 'form', 'input'],
    FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover'],
  });
}

// Uso em componente React
// ✅ <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(content) }} />
// ❌ <div dangerouslySetInnerHTML={{ __html: content }} />
```

---

## 7. Padrão: Logging Seguro

```typescript
// src/lib/logger.ts

type LogLevel = 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  requestId?: string;
  userId?: string;
  metadata?: Record<string, unknown>;
}

// Lista de campos que NUNCA devem ser logados
const SENSITIVE_FIELDS = [
  'password', 'token', 'secret', 'authorization',
  'cookie', 'creditCard', 'ssn', 'cpf',
];

function redactSensitive(obj: Record<string, unknown>): Record<string, unknown> {
  const redacted: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (SENSITIVE_FIELDS.some((field) => key.toLowerCase().includes(field))) {
      redacted[key] = '[REDACTED]';
    } else if (typeof value === 'object' && value !== null) {
      redacted[key] = redactSensitive(value as Record<string, unknown>);
    } else {
      redacted[key] = value;
    }
  }
  return redacted;
}

export function log(level: LogLevel, message: string, metadata?: Record<string, unknown>) {
  const entry: LogEntry = {
    level,
    message,
    timestamp: new Date().toISOString(),
    metadata: metadata ? redactSensitive(metadata) : undefined,
  };

  // Em produção, enviar para serviço de log (ex: Vercel Logs, Axiom)
  if (level === 'error') {
    console.error(JSON.stringify(entry));
  } else {
    console.log(JSON.stringify(entry));
  }
}

// Uso:
// log('error', 'Falha na autenticação', { email: user.email, ip: request.ip });
// log('info', 'Usuário criado', { userId: user.id });
// log('warn', 'Rate limit atingido', { ip: '1.2.3.4', endpoint: '/api/login' });
```

---

## 8. Padrão: Testes de Segurança

```typescript
// __tests__/security/api-routes.test.ts
import { describe, it, expect } from 'vitest';

describe('Segurança de API Routes', () => {
  const baseUrl = 'http://localhost:3000';

  // Teste 1: Rotas protegidas rejeitam requests sem auth
  it('deve retornar 401 sem token de autenticação', async () => {
    const response = await fetch(`${baseUrl}/api/users/me`);
    expect(response.status).toBe(401);
  });

  // Teste 2: Validação de input rejeita dados maliciosos
  it('deve rejeitar SQL injection em parâmetros', async () => {
    const response = await fetch(`${baseUrl}/api/users/1' OR '1'='1`);
    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body).not.toHaveProperty('password');
  });

  // Teste 3: XSS payload é sanitizado
  it('deve sanitizar XSS em inputs', async () => {
    const response = await fetch(`${baseUrl}/api/posts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: '<script>alert("xss")</script>Hello',
        content: 'Test content',
      }),
    });
    if (response.ok) {
      const body = await response.json();
      expect(body.title).not.toContain('<script>');
    }
  });

  // Teste 4: Rate limiting funciona
  it('deve bloquear após exceder rate limit', async () => {
    const requests = Array.from({ length: 110 }, () =>
      fetch(`${baseUrl}/api/public/health`)
    );
    const responses = await Promise.all(requests);
    const blocked = responses.filter((r) => r.status === 429);
    expect(blocked.length).toBeGreaterThan(0);
  });

  // Teste 5: Headers de segurança presentes
  it('deve ter headers de segurança obrigatórios', async () => {
    const response = await fetch(baseUrl);
    const headers = response.headers;

    expect(headers.get('x-frame-options')).toBe('DENY');
    expect(headers.get('x-content-type-options')).toBe('nosniff');
    expect(headers.get('strict-transport-security')).toContain('max-age=');
    expect(headers.get('referrer-policy')).toBeTruthy();
    expect(headers.has('x-powered-by')).toBe(false);
  });

  // Teste 6: Broken access control
  it('deve impedir acesso a dados de outro usuário', async () => {
    // Simular login como user A e tentar acessar dados de user B
    const response = await fetch(`${baseUrl}/api/users/outro-user-id`, {
      headers: { Cookie: 'session-token=token-do-user-a' },
    });
    expect(response.status).toBe(403);
  });

  // Teste 7: Verificar que middleware bloqueia bypass (CVE-2025-29927)
  it('deve bloquear header x-middleware-subrequest', async () => {
    const response = await fetch(`${baseUrl}/dashboard`, {
      headers: { 'x-middleware-subrequest': 'true' },
    });
    expect(response.status).toBe(403);
  });
});
```

```typescript
// __tests__/security/env-validation.test.ts
import { describe, it, expect } from 'vitest';

describe('Validação de Variáveis de Ambiente', () => {
  it('não deve ter segredos com prefixo NEXT_PUBLIC_', () => {
    const publicVars = Object.keys(process.env).filter((key) =>
      key.startsWith('NEXT_PUBLIC_')
    );

    const sensitiveWords = ['secret', 'key', 'password', 'token', 'database'];

    for (const varName of publicVars) {
      const lower = varName.toLowerCase();
      for (const word of sensitiveWords) {
        expect(lower).not.toContain(word);
      }
    }
  });

  it('DATABASE_URL deve usar SSL', () => {
    const dbUrl = process.env.DATABASE_URL;
    if (dbUrl) {
      expect(dbUrl).toContain('sslmode=require');
    }
  });
});
```

---

## 9. Padrão: Open Redirect Protection

```typescript
// src/lib/safe-redirect.ts

/**
 * Valida que uma URL de redirecionamento é segura (interna).
 * Previne ataques de Open Redirect.
 */
export function safeRedirectUrl(url: string | null, fallback = '/'): string {
  if (!url) return fallback;

  // Aceitar apenas URLs relativas (internas)
  try {
    // Se consegue parsear como URL absoluta, é externa
    new URL(url);
    return fallback; // Rejeitar URLs absolutas
  } catch {
    // URL relativa — verificar que começa com /
    if (url.startsWith('/') && !url.startsWith('//')) {
      return url;
    }
    return fallback;
  }
}

// Uso no login redirect:
// const redirectTo = safeRedirectUrl(searchParams.get('redirect'));
// redirect(redirectTo);
```

---

## 10. Padrão: Configuração Segura do Vercel (vercel.json)

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "no-store, no-cache, must-revalidate" },
        { "key": "Pragma", "value": "no-cache" }
      ]
    },
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-DNS-Prefetch-Control", "value": "on" }
      ]
    }
  ],
  "rewrites": [],
  "redirects": [
    {
      "source": "/:path*",
      "has": [{ "type": "header", "key": "x-forwarded-proto", "value": "http" }],
      "destination": "https://%{host}/:path*",
      "permanent": true
    }
  ]
}
```
