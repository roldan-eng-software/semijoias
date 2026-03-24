import Link from "next/link"

export const metadata = {
  title: "Política de Privacidade",
  description: "Política de Privacidade da Simone Semijoias - saiba como protegemos seus dados.",
}

export default function PrivacidadePage() {
  const currentYear = new Date().getFullYear()

  return (
    <div className="min-h-screen bg-ivory py-12">
      <div className="mx-auto max-w-3xl px-4">
        <Link
          href="/"
          className="mb-8 inline-block text-sm text-muted-mauve hover:text-rose-gold"
        >
          ← Voltar para a página inicial
        </Link>

        <h1 className="font-playfair text-3xl text-dark-plum">Política de Privacidade</h1>
        <p className="mt-2 text-sm text-muted-mauve">Última atualização: {currentYear}</p>

        <div className="mt-8 space-y-6 text-muted-mauve">
          <section>
            <h2 className="font-playfair text-xl text-dark-plum mb-3">
              1. Introdução
            </h2>
            <p>
              A Simone Semijoias respeita sua privacidade e está comprometida em proteger seus dados pessoais.
              Esta Política de Privacidade explica como coletamos, usamos, divulgamos e protegemos suas informações.
            </p>
          </section>

          <section>
            <h2 className="font-playfair text-xl text-dark-plum mb-3">
              2. Dados que Coletamos
            </h2>
            <p>Podemos coletar os seguintes tipos de informações:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li><strong>Dados pessoais:</strong> nome, e-mail, telefone, CPF</li>
              <li><strong>Dados de endereço:</strong> para entrega de pedidos</li>
              <li><strong>Dados de pagamento:</strong> processados de forma segura pelo Mercado Pago</li>
              <li><strong>Dados de navegação:</strong> cookies e informações de acesso</li>
            </ul>
          </section>

          <section>
            <h2 className="font-playfair text-xl text-dark-plum mb-3">
              3. Como Usamos Seus Dados
            </h2>
            <p>Utilizamos seus dados para:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Processar e entregar seus pedidos</li>
              <li>Comunicar sobre status de pedidos</li>
              <li>Enviar e-mails de confirmação e verificação</li>
              <li>Melhorar nossa experiência de compra</li>
              <li>Cumprir obrigações legais</li>
            </ul>
          </section>

          <section>
            <h2 className="font-playfair text-xl text-dark-plum mb-3">
              4. Proteção de Dados
            </h2>
            <p>
              Implementamos medidas de segurança técnicas e organizacionais para proteger seus dados,
              incluindo criptografia SSL, acesso restrito e armazenamento seguro. Seus dados de pagamento
              são processados diretamente pelo Mercado Pago, que segue os mais altos padrões de segurança.
            </p>
          </section>

          <section>
            <h2 className="font-playfair text-xl text-dark-plum mb-3">
              5. Seus Direitos
            </h2>
            <p>Você tem direito a:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Acessar seus dados pessoais</li>
              <li>Corrigir dados incorretos</li>
              <li>Solicitar exclusão de dados</li>
              <li>Cancelar recebimento de comunicações</li>
            </ul>
          </section>

          <section>
            <h2 className="font-playfair text-xl text-dark-plum mb-3">
              6. Cookies
            </h2>
            <p>
              Utilizamos cookies para melhorar sua experiência de navegação, analisar tráfego e
              personalizar conteúdo. Você pode controlar cookies através das configurações do seu navegador.
            </p>
          </section>

          <section>
            <h2 className="font-playfair text-xl text-dark-plum mb-3">
              7. Contato
            </h2>
            <p>
              Em caso de dúvidas sobre esta Política de Privacidade, entre em contato pelo e-mail:
              <strong> contato@simoesemijoias.com.br</strong>
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
