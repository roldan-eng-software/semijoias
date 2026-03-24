import Link from "next/link"

export const metadata = {
  title: "Termos de Uso",
  description: "Termos de Uso da Simone Semijoias - condições gerais de uso da loja virtual.",
}

export default function TermosPage() {
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

        <h1 className="font-playfair text-3xl text-dark-plum">Termos de Uso</h1>
        <p className="mt-2 text-sm text-muted-mauve">Última atualização: {currentYear}</p>

        <div className="mt-8 space-y-6 text-muted-mauve">
          <section>
            <h2 className="font-playfair text-xl text-dark-plum mb-3">
              1. Aceitação dos Termos
            </h2>
            <p>
              Ao acessar e utilizar a loja virtual da Simone Semijoias, você concorda em cumprir
              e estar vinculado a estes Termos de Uso. Se você não concordar com qualquer parte
              destes termos, não deverá utilizar nosso site.
            </p>
          </section>

          <section>
            <h2 className="font-playfair text-xl text-dark-plum mb-3">
              2. Cadastro e Conta
            </h2>
            <p>
              Para realizar compras, você deve fornecer informações verdadeiras e completas.
              É responsabilidade manter a confidencialidade de sua conta e senha.
              Você concorda em.notify imediatamente sobre qualquer uso não autorizado.
            </p>
          </section>

          <section>
            <h2 className="font-playfair text-xl text-dark-plum mb-3">
              3. Produtos e Preços
            </h2>
            <p>
              Todos os produtos estão sujeitos à disponibilidade. Nos reservamos o direito de
              corrigir preços, modificar disponibilidade e cancelar pedidos a qualquer momento.
              As imagens dos produtos são meramente ilustrativas.
            </p>
          </section>

          <section>
            <h2 className="font-playfair text-xl text-dark-plum mb-3">
              4. Pagamento
            </h2>
            <p>
              Aceitamos pagamentos via Mercado Pago (PIX, cartão de crédito e boleto).
              O processamento de pagamentos é feito de forma segura através da plataforma Mercado Pago.
              Não armazenamos dados de cartão de crédito em nossos sistemas.
            </p>
          </section>

          <section>
            <h2 className="font-playfair text-xl text-dark-plum mb-3">
              5. Envio e Entrega
            </h2>
            <p>
              Ofreemos frete grátis para pedidos acima de R$199. O prazo de entrega varia conforme
              a localização e forma de envio escolhida. Os custos de frete serão calculados no checkout.
            </p>
          </section>

          <section>
            <h2 className="font-playfair text-xl text-dark-plum mb-3">
              6. Trocas e Devoluções
            </h2>
            <p>
              Você pode solicitar troca ou devolução em até 7 dias após o recebimento do produto,
              conforme o Código de Defesa do Consumidor. O produto deve estar sem uso e na embalagem original.
              Custos de envio para devolução são responsabilidade do cliente, exceto em casos de defeito.
            </p>
          </section>

          <section>
            <h2 className="font-playfair text-xl text-dark-plum mb-3">
              7. Garantia
            </h2>
            <p>
              Oferecemos garantia de 6 meses contra defeitos de fabricação em todas as peças.
              A garantia não cobre:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Danos por uso inadequado</li>
              <li>Oxidação natural</li>
              <li>Arranhões e desgaste pelo uso</li>
              <li>Uso inadequado ou exposição a produtos químicos</li>
            </ul>
          </section>

          <section>
            <h2 className="font-playfair text-xl text-dark-plum mb-3">
              8. Propriedade Intelectual
            </h2>
            <p>
              Todo o conteúdo do site (imagens, textos, logotipos, design) é propriedade da
              Simone Semijoias ou de nossos fornecedores e é protegido por leis de direitos autorais.
              Reprodução sem autorização é proibida.
            </p>
          </section>

          <section>
            <h2 className="font-playfair text-xl text-dark-plum mb-3">
              9. Limitação de Responsabilidade
            </h2>
            <p>
              A Simone Semijoias não será responsável por danos indiretos, incidentais ou
              consequenciais decorrentes do uso ou incapacidade de usar nosso site.
            </p>
          </section>

          <section>
            <h2 className="font-playfair text-xl text-dark-plum mb-3">
              10. Contato
            </h2>
            <p>
              Para questões sobre estes Termos de Uso, entre em contato:
              <br />
              <strong>E-mail:</strong> contato@simoesemijoias.com.br
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
