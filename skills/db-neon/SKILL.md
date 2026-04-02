---
name: db-neon
description: Guia completo para criação e gerenciamento de banco de dados no Neon. Use este skill sempre que o usuário solicitar o setup do banco de dados, criação de tabelas, modificação de esquemas, migrações de dados ou integração do Neon MCP ao projeto. Este skill força o uso de boas práticas de migração (branches temporárias) e integração com Prisma ORM quando detectado. Deve ser usado em conjunto com as skills de "arquitetura" (para modelagem) e "lgpd" (para privacidade).
---

# DB-Neon: Gestão Estratégica de Dados

Este skill fornece diretrizes técnicas e operacionais para utilizar o ecossistema Neon (Serverless Postgres) de forma profissional, garantindo integridade de dados e segurança nas alterações de esquema.

## 1. Fase de Planejamento (Pré-requisito)

Antes de executar qualquer comando SQL ou de migração, o agente DEVE validar a estrutura:
- **Consulte a Skill Arquitetura**: Se a modelagem de dados (MER/DER) já foi feita, siga-a rigorosamente.
- **Definição de Tipos**: Use tipos de dados apropriados do PostgreSQL (ex: `UUID` para IDs, `TIMESTAMPTZ` para datas, `JSONB` para dados semiestruturados).
- **Normalização**: Garanta que o esquema esteja ao menos na 3ª Forma Normal (3NF), a menos que haja uma justificativa clara para desnormalização.

## 2. Fluxo de Implementação: Prisma ORM (Preferencial)

Se o projeto for Next.js/Node.js e utilizar Prisma:
1. **Verificação**: Localize o arquivo `prisma/schema.prisma`.
2. **Edição**: Aplique as mudanças de modelo no `schema.prisma`.
3. **Migração Local/Dev**: Use `mcp_prisma-mcp-server_migrate-dev --name <nome_da_mudanca>`.
4. **Resolução de Conflitos**: Se houver "drift", use `mcp_prisma-mcp-server_migrate-status` e siga as orientações de reset se for ambiente de desenvolvimento.
5. **Visualização**: Use `mcp_prisma-mcp-server_Prisma-Studio` para mostrar os dados ao usuário se solicitado.

## 3. Fluxo de Implementação: Neon MCP (Direto/Zero-Downtime)

Para projetos sem Prisma ou para alterações críticas de infraestrutura:
- **Branches de Segurança**: NUNCA aplique alterações diretamente na branch `main` sem testar.
- **Preparação**: Use `mcp_mcp-server-neon_prepare_database_migration`. Isso cria uma branch temporária automática.
- **Teste na Branch**: Use `mcp_mcp-server-neon_run_sql` passando o `branchId` da branch temporária para validar a criação de tabelas e constraints.
- **Confirmação Visual**: Apresente o resultado do teste ao usuário: "As tabelas X, Y e Z foram criadas com sucesso na branch de teste. Deseja aplicar ao ambiente principal?".
- **Commit**: Use `mcp_mcp-server-neon_complete_database_migration` com o `migrationId` fornecido.

### Dica de Otimização (Zero-Downtime):
Ao adicionar colunas `NOT NULL`, prefira:
1. Adicionar como nullable.
2. Preencher dados existentes.
3. Alterar para `NOT NULL`.

## 4. Integração com Outras Skills

- **LGPD**: Ao criar tabelas de `Usuários` ou `Logs`, consulte a skill `lgpd` para verificar se dados sensíveis estão sendo armazenados conforme a lei (ex: criptografia em repouso, políticas de retenção).
- **Arquitetura**: O banco de dados deve refletir fielmente o mapeamento de perfis (Admin, Gestor, Usuário) definido na arquitetura.
- **Deploy**: Após migrações bem-sucedidas, utilize a skill `deploy-github` para garantir que o código (schemas, seeds) esteja sincronizado.

## 5. Manutenção e Performance

- **Slow Queries**: Periodicamente, execute `mcp_mcp-server-neon_list_slow_queries`.
- **Tuning**: Se uma query estiver lenta, use `mcp_mcp-server-neon_prepare_query_tuning` para receber sugestões de índices. **Sempre aplique os índices sugeridos usando `CONCURRENTLY`** para não travar a tabela em produção.

## Regras de Resposta

1. Atue como um DBA (Database Administrator) especializado em Cloud e Serverless.
2. Priorize segurança: sempre peça confirmação antes de `DROP` ou `RESET`.
3. Explique brevemente o porquê de cada índice ou relacionamento criado.
4. Use Mermaid para mostrar o esquema final ao usuário.
