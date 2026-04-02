Para garantir a conformidade da sua stack Better Auth + Prisma + Neon com a LGPD:

1. **Log de Auditoria:** Use as hooks do Better Auth para registrar tentativas de login, logs de acesso e alterações em dados cadastrais. Isso serve para prestar contas à ANPD se necessário.

2. **Minimização de Dados:** Configure o Prisma para coletar apenas o necessário. Se estiver migrando do Supabase para o Neon, aproveite para remover colunas desnecessárias.

3. **Criptografia em Trânsito:** O Neon já fornece conexões SSL/TLS por padrão. Garanta que o Prisma Client esteja configurado para exigir SSL.

4. **Direito à Exclusão:** Implemente uma Server Action no Next.js que delete todos os registros relacionados ao ID do usuário no Prisma quando solicitado ("Direito ao Esquecimento").

5. **Dados Sensíveis:** Se armazenar RG/CPF, use criptografia adicional se possível, embora o Neon já utilize criptografia em repouso.
