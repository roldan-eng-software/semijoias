Para implementar um banner de cookies em conformidade com a LGPD em um projeto Next.js com DaisyUI, siga estes passos:

1. **Componente de Banner Granular:**
   Utilize um modal do DaisyUI para capturar as preferências. Não use apenas um botão "Entendi".
   - Botão "Aceitar Todos": Verde (`btn-success`).
   - Botão "Rejeitar": Neutro (`btn-ghost`).
   - Link de "Preferências": Abre uma lista de checkboxes.

2. **Categorias de Consentimento:**
   - **Essenciais:** Sempre ativos (não podem ser desativados).
   - **Analíticos:** Google Analytics, etc.
   - **Marketing:** Beacons de anúncios.

3. **Armazenamento:**
   Guarde a escolha no `localStorage`. Se o usuário estiver logado (via **Better Auth**), salve também no perfil dele para persistência entre dispositivos.

4. **Bloqueio de Scripts:**
   Use o componente `Script` do Next.js com lógica condicional baseada no estado do consentimento.

5. **Revogação:**
   Garanta que o link "Gerenciar Preferências" esteja sempre disponível no rodapé para que o usuário possa revogar o consentimento a qualquer momento.
