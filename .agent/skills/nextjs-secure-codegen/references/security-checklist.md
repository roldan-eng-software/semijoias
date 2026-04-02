# Checklist de Segurança — Next.js + Neon + Vercel

Use este checklist para auditar projetos antes de cada deploy. Cada item deve ser verificado e corrigido se necessário.

---

## 1. Autenticação e Sessão

| Verificação | Prioridade | Como Testar |
|---|---|---|
| Tokens de sessão em cookies `httpOnly`, `Secure`, `SameSite=Lax` | Essencial | DevTools > Application > Cookies |
| Nenhum token em `localStorage` ou `sessionStorage` | Essencial | `grep -r "localStorage\|sessionStorage" src/` |
| Senha hash com bcrypt (custo ≥ 12) ou argon2 | Essencial | Verificar lib de auth |
| Expiração de sessão configurada (máx 24h) | Essencial | Verificar config de cookies |
| Auth verificada em CADA API Route e Server Action | Crítico | Auditar todas as rotas |
| Next.js atualizado (CVE-2025-29927 corrigido: ≥ 14.2.25 ou ≥ 15.2.3) | Crítico | `npm list next` |
| MFA disponível para ações sensíveis | Importante | Testar fluxo de MFA |
| Bloqueio de conta após tentativas falhas | Importante | Testar com senha errada 5x |

## 2. API Routes e Server Actions

| Verificação | Prioridade | Como Testar |
|---|---|---|
| Toda rota valida inputs com Zod | Essencial | `grep -r "safeParse\|parse" src/app/api/` |
| Rate limiting ativo em todas as rotas | Essencial | Disparar 100+ requests rápidos |
| Queries SQL parametrizadas (sem concatenação) | Crítico | `grep -r "\\$\{" src/lib/db` — deve retornar vazio |
| Verificação CSRF em rotas mutáveis (POST/PUT/DELETE) | Essencial | Testar request sem Origin header |
| Respostas não expõem dados internos | Essencial | Verificar mensagens de erro |
| Verificação de autorização (user só acessa seus dados) | Crítico | Testar com ID de outro usuário |

## 3. Banco de Dados (Neon)

| Verificação | Prioridade | Como Testar |
|---|---|---|
| Conexão SSL obrigatória (`ssl: { require: true }`) | Crítico | Verificar `db.ts` |
| `DATABASE_URL` sem prefixo `NEXT_PUBLIC_` | Crítico | `grep NEXT_PUBLIC_DATABASE .env*` — deve retornar vazio |
| Pool configurado com limites (`max`, `idleTimeout`) | Essencial | Verificar config do pool |
| Usuário de banco com permissões mínimas | Importante | Verificar roles no Neon |
| Dados sensíveis criptografados (PII, senhas) | Importante | Verificar schema do banco |
| Logs de queries habilitados no Neon | Recomendado | Verificar dashboard Neon |

## 4. Headers de Segurança

| Header | Valor Recomendado | Status |
|---|---|---|
| `Content-Security-Policy` | script-src 'self' com nonce | ✅ / ❌ |
| `Strict-Transport-Security` | max-age=31536000; includeSubDomains; preload | ✅ / ❌ |
| `X-Frame-Options` | DENY | ✅ / ❌ |
| `X-Content-Type-Options` | nosniff | ✅ / ❌ |
| `Referrer-Policy` | strict-origin-when-cross-origin | ✅ / ❌ |
| `Permissions-Policy` | camera=(), microphone=(), geolocation=() | ✅ / ❌ |
| `X-Powered-By` | Removido (poweredBy: false) | ✅ / ❌ |

**Testar headers:** `curl -I https://seu-site.vercel.app`

## 5. Variáveis de Ambiente

| Verificação | Prioridade | Como Testar |
|---|---|---|
| `.env.local` no `.gitignore` | Crítico | `cat .gitignore \| grep .env` |
| Nenhum segredo com prefixo `NEXT_PUBLIC_` | Crítico | `grep NEXT_PUBLIC_ .env* \| grep -i secret\|key\|password\|token` |
| `.env.example` existe sem valores reais | Essencial | Verificar manualmente |
| Variáveis validadas com Zod na inicialização | Essencial | Verificar `src/lib/env.ts` |
| Secrets diferentes em dev/staging/prod | Importante | Verificar Vercel settings |
| Variáveis configuradas nos 3 ambientes da Vercel | Essencial | Vercel > Project > Settings > Environment Variables |

## 6. Proteção XSS

| Verificação | Prioridade | Como Testar |
|---|---|---|
| Nenhum `dangerouslySetInnerHTML` sem DOMPurify | Crítico | `grep -r "dangerouslySetInnerHTML" src/` |
| Nenhum `eval()` ou `new Function()` | Crítico | `grep -r "eval(\|new Function" src/` |
| Inputs sanitizados no servidor | Essencial | Verificar schemas Zod |
| CSP configurada sem `unsafe-inline` em scripts | Essencial | Verificar `next.config.ts` |
| Dados do usuário escapados em renderização | Essencial | React faz por padrão, verificar exceções |

## 7. Proteção CSRF

| Verificação | Prioridade | Como Testar |
|---|---|---|
| Cookies com `SameSite=Lax` ou `Strict` | Essencial | DevTools > Cookies |
| Server Actions usam POST (automático no Next.js) | Essencial | Verificar implementação |
| API Routes custom verificam Origin header | Essencial | `curl -X POST` sem Origin |
| Formulários não aceitam GET para mutações | Essencial | Testar com GET request |

## 8. Deploy na Vercel

| Verificação | Prioridade | Como Testar |
|---|---|---|
| Deployment Protection ativada (Preview) | Essencial | Vercel > Settings > Deployment Protection |
| Source maps desativados em produção | Essencial | Verificar se `.map` arquivos são públicos |
| Variáveis de ambiente separadas por ambiente | Essencial | Vercel > Environment Variables |
| Domínio com HTTPS forçado | Essencial | Testar acesso HTTP (deve redirecionar) |
| Webhooks da Vercel protegidos com secret | Importante | Verificar config de webhooks |
| Function logs ativos para monitoramento | Recomendado | Vercel > Logs |

## 9. Dependências

| Verificação | Prioridade | Como Testar |
|---|---|---|
| `npm audit` sem vulnerabilidades críticas/altas | Essencial | `npm audit` |
| Dependabot ou Renovate configurado | Importante | Verificar `.github/` |
| `package-lock.json` commitado | Essencial | Verificar repositório |
| Nenhum pacote obsoleto com CVEs | Essencial | `npm outdated` + verificar advisories |

## 10. Proteção contra Ataques Comuns

### SQL Injection
```bash
# Testar: nenhum resultado deve aparecer
grep -rn "\\$\{.*\}" src/ --include="*.ts" --include="*.tsx" | grep -i "sql\|query\|select\|insert\|update\|delete"
```

### XSS (Cross-Site Scripting)
```bash
# Testar inputs com payloads maliciosos
# <script>alert('xss')</script>
# " onmouseover="alert('xss')
# javascript:alert('xss')
```

### SSRF (Server-Side Request Forgery)
```bash
# Verificar que URLs externas são validadas com allowlist
grep -rn "fetch\|axios\|got\|request" src/ --include="*.ts" | grep -v node_modules
```

### Path Traversal
```bash
# Verificar sanitização de nomes de arquivo
grep -rn "readFile\|writeFile\|createReadStream" src/ --include="*.ts"
```

### Broken Access Control
```bash
# Verificar que toda rota protegida checa autorização
grep -rn "session\|user\|auth" src/app/api/ --include="*.ts" -l
```

## Script de Auditoria Rápida

```bash
#!/bin/bash
echo "=== Auditoria de Segurança Next.js ==="
echo ""
echo "1. Verificando vulnerabilidades em dependências..."
npm audit --production 2>/dev/null || echo "   ATENÇÃO: npm audit encontrou problemas"

echo ""
echo "2. Verificando segredos expostos..."
grep -rn "NEXT_PUBLIC_.*SECRET\|NEXT_PUBLIC_.*KEY\|NEXT_PUBLIC_.*PASSWORD\|NEXT_PUBLIC_.*TOKEN" .env* 2>/dev/null && echo "   ❌ SEGREDOS EXPOSTOS!" || echo "   ✅ Nenhum segredo exposto"

echo ""
echo "3. Verificando SQL injection potencial..."
grep -rn '\$\{' src/ --include="*.ts" --include="*.tsx" 2>/dev/null | grep -i "sql\|query" && echo "   ❌ POSSÍVEL SQL INJECTION!" || echo "   ✅ Sem concatenação SQL detectada"

echo ""
echo "4. Verificando dangerouslySetInnerHTML..."
grep -rn "dangerouslySetInnerHTML" src/ --include="*.tsx" --include="*.ts" 2>/dev/null && echo "   ⚠️  Verificar sanitização com DOMPurify" || echo "   ✅ Sem dangerouslySetInnerHTML"

echo ""
echo "5. Verificando eval/Function..."
grep -rn "eval(\|new Function(" src/ --include="*.ts" --include="*.tsx" 2>/dev/null && echo "   ❌ USO DE EVAL DETECTADO!" || echo "   ✅ Sem eval/Function"

echo ""
echo "6. Verificando localStorage para tokens..."
grep -rn "localStorage\|sessionStorage" src/ --include="*.ts" --include="*.tsx" 2>/dev/null | grep -i "token\|session\|auth\|jwt" && echo "   ❌ TOKENS EM STORAGE!" || echo "   ✅ Sem tokens em storage"

echo ""
echo "7. Verificando .env no .gitignore..."
grep -q ".env" .gitignore 2>/dev/null && echo "   ✅ .env está no .gitignore" || echo "   ❌ .env NÃO ESTÁ NO .GITIGNORE!"

echo ""
echo "8. Verificando headers de segurança no next.config..."
grep -q "X-Frame-Options\|Content-Security-Policy\|Strict-Transport-Security" next.config.ts 2>/dev/null && echo "   ✅ Headers de segurança configurados" || echo "   ⚠️  Headers de segurança não encontrados em next.config.ts"

echo ""
echo "=== Auditoria concluída ==="
```
