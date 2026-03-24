import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"

export const metadata = {
  title: "Sobre Nós | Simone Semijoias",
  description: "Conheça a história da Simone Semijoias - semijoias elegantes e sofisticadas banhadas a ouro 18k e prata 925.",
}

export default function SobrePage() {
  return (
    <div className="min-h-screen bg-ivory">
      {/* Hero */}
      <section className="relative py-20 bg-dark-plum">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="max-w-2xl">
            <h1 className="font-playfair text-4xl text-white lg:text-5xl">
              Sobre a Simone
            </h1>
            <p className="mt-4 text-lg text-white/80">
              Criando momentos especiais através dejoias únicas há mais de 15 anos
            </p>
          </div>
        </div>
      </section>

      {/* História */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <h2 className="font-playfair text-3xl text-dark-plum">
                Nossa História
              </h2>
              <div className="mt-6 space-y-4 text-muted-mauve">
                <p>
                  A <strong className="text-dark-plum">Simone Semijoias</strong> nasceu em 2010 
                  com a missão de oferecer joias elegantes e acessíveis para mulheres que 
                  valorizam sofisticação e qualidade.
                </p>
                <p>
                  O que começou como uma pequena loja familiar na capital paulistana, 
                  cresceu para se tornar uma referência em semijoias banhadas a ouro 18k 
                  e prata 925, com clientes em todo o Brasil.
                </p>
                <p>
                  Cada peça é cuidadosamente selecionada e inspeccionada para garantir 
                  que nossos clientes recebam produtos com acabamento perfeito e durabilidade 
                  excepcional.
                </p>
              </div>
            </div>
            <div className="relative h-80 lg:h-auto rounded-2xl overflow-hidden bg-champagne">
              <Image
                src="/Hero.png"
                alt="Loja Simone Semijoias"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Valores */}
      <section className="bg-champagne py-16">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <h2 className="text-center font-playfair text-3xl text-dark-plum">
            Nossos Valores
          </h2>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            <Card className="p-8 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-rose-gold/10">
                <span className="text-3xl">✨</span>
              </div>
              <h3 className="font-playfair text-xl text-dark-plum">Qualidade</h3>
              <p className="mt-2 text-sm text-muted-mauve">
                Compromisso com materiais premium e acabamento impecável em cada peça
              </p>
            </Card>
            <Card className="p-8 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-rose-gold/10">
                <span className="text-3xl">❤️</span>
              </div>
              <h3 className="font-playfair text-xl text-dark-plum">Atendimento</h3>
              <p className="mt-2 text-sm text-muted-mauve">
                Experiência personalizada e atendimento humanizado para você
              </p>
            </Card>
            <Card className="p-8 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-rose-gold/10">
                <span className="text-3xl">💎</span>
              </div>
              <h3 className="font-playfair text-xl text-dark-plum">Sofisticação</h3>
              <p className="mt-2 text-sm text-muted-mauve">
                Design exclusivo que valoriza a beleza e elegância feminina
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Diferenciais */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <h2 className="text-center font-playfair text-3xl text-dark-plum">
            Por que escolher a Simone?
          </h2>
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="text-center">
              <div className="text-4xl mb-3">🛡️</div>
              <h3 className="font-medium text-dark-plum">Garantia de 6 meses</h3>
              <p className="text-sm text-muted-mauve">Contra defeitos de fabricação</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">📦</div>
              <h3 className="font-medium text-dark-plum">Frete Grátis</h3>
              <p className="text-sm text-muted-mauve">Para compras acima de R$199</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">🔄</div>
              <h3 className="font-medium text-dark-plum">Troca Fácil</h3>
              <p className="text-sm text-muted-mauve">Política de troca facilitada</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">💳</div>
              <h3 className="font-medium text-dark-plum">Parcelamento</h3>
              <p className="text-sm text-muted-mauve">Até 3x sem juros no cartão</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-rose-gold py-16">
        <div className="mx-auto max-w-2xl text-center px-4">
          <h2 className="font-playfair text-3xl text-white">
            Pronto para descobrir nossas joias?
          </h2>
          <p className="mt-4 text-white/80">
            Explore nossa coleção completa de semijoias exclusivas
          </p>
          <div className="mt-8 flex gap-4 justify-center">
            <Link href="/produtos">
              <Button variant="secondary" className="bg-white text-rose-gold hover:bg-champagne">
                Ver produtos
              </Button>
            </Link>
            <Link href="/contato">
              <Button variant="outline" className="border-white text-white hover:bg-white/10">
                Fale conosco
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
