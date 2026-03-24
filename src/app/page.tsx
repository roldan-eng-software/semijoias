import Link from "next/link"
import Image from "next/image"
import { Shield, Truck, RefreshCw, CreditCard, Sparkles, Gift } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import { Card } from "@/components/ui/Card"
import heroImage from "@/../public/Hero.png"

export const dynamic = 'force-dynamic'

const categories = [
  { name: "Brincos", slug: "brincos", image: "/Brincos.png" },
  { name: "Colares", slug: "colares", image: "/Colares.png" },
  { name: "Anéis", slug: "aneis", image: "/Aneis.png" },
  { name: "Pulseiras", slug: "pulseiras", image: "/Pulseiras.png" },
  { name: "Tornozeleiras", slug: "tornozeleiras", image: "/Tornozeleiras.png" },
  { name: "Kits", slug: "kits", image: "/Kits.png" },
]

async function getFeaturedProducts() {
  const { prisma } = await import('@/lib/prisma')
  const products = await prisma.product.findMany({
    where: { isFeatured: true, isActive: true },
    take: 4,
    orderBy: { createdAt: "desc" },
  })
  return products
}

const testimonials = [
  {
    name: "Maria Santos",
    city: "São Paulo",
    text: "Peças lindíssimas! A qualidade é incrível e o acabamento perfeito.",
  },
  {
    name: "Ana Paula",
    city: "Rio de Janeiro",
    text: "Adorei o atendimento e a embalagem é um luxo. Recomendo!",
  },
  {
    name: "Carla Oliveira",
    city: "Belo Horizonte",
    text: "Minha terceira compra aqui. Sempre super satisfeita com tudo!",
  },
]

const trustItems = [
  { icon: Truck, text: "Frete grátis acima de R$199" },
  { icon: Shield, text: "Garantia 6 meses" },
  { icon: RefreshCw, text: "Troca fácil" },
  { icon: CreditCard, text: "Parcele em 3x" },
]

const features = [
  {
    icon: Sparkles,
    title: "Semi-joias banhadas",
    description: "Todas as peças são banhadas a ouro 18k ou prata 925, com acabamento premium",
  },
  {
    icon: Shield,
    title: "Garantia real",
    description: "6 meses de garantia contra defeitos de fabricação",
  },
  {
    icon: Gift,
    title: "Embalagem especial",
    description: "Cada peça acompanha estojo luxury perfeito para presente",
  },
]

export default async function HomePage() {
  const products = await getFeaturedProducts()
  return (
    <div className="flex flex-col">
      {/* Trust Bar */}
      <div className="bg-dark-plum py-3">
        <div className="mx-auto flex max-w-7xl items-center justify-center gap-4 px-4 md:justify-around md:gap-0">
          {trustItems.map((item, index) => (
            <div key={index} className="hidden items-center gap-2 md:flex">
              <item.icon className="h-4 w-4 text-white" />
              <span className="text-xs text-white">{item.text}</span>
            </div>
          ))}
          <div className="flex items-center gap-4 md:hidden">
            <span className="text-xs text-white">Frete Grátis ✓</span>
            <span className="text-xs text-white">Garantia 6 meses ✓</span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative flex min-h-[60vh] md:min-h-[70vh] lg:min-h-[85vh]">
        <Image
          src={heroImage}
          alt="Hero"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative z-10 mx-auto flex w-full max-w-7xl items-center px-4 py-12 md:py-20 lg:px-8">
          <div className="max-w-xl space-y-4 md:space-y-6">
            <div className="h-0.5 w-14 bg-rose-gold" />
            <h1 className="font-playfair text-3xl font-medium leading-tight text-white md:text-4xl lg:text-6xl">
              Brilhe com elegância
            </h1>
            <p className="font-cormorant text-base italic text-white/90 md:text-xl">
              Coleção Primavera · Semi-joias banhadas a ouro
            </p>
            <div className="flex flex-col gap-3 pt-2 sm:flex-row">
              <Link href="/produtos">
                <Button size="lg" className="w-full sm:w-auto">Ver coleção</Button>
              </Link>
              <Link href="/sobre">
                <Button variant="outline" size="lg" className="w-full border-white text-white hover:bg-white hover:text-dark-plum sm:w-auto">
                 了解 a história
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="bg-champagne py-10 md:py-16">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <h2 className="mb-6 md:mb-10 text-center font-playfair text-2xl md:text-3xl text-dark-plum">
            Nossas coleções
          </h2>
          <div className="flex justify-center gap-4 overflow-x-auto pb-4 md:gap-8">
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={`/produtos?category=${category.slug}`}
                className="group flex flex-col items-center gap-2 md:gap-3"
              >
                <div className="relative h-20 w-20 overflow-hidden rounded-full bg-champagne-dark transition-transform group-hover:scale-105 md:h-28 md:w-28">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <span className="text-xs md:text-sm font-medium text-dark-plum">
                  {category.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="bg-ivory py-10 md:py-16">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="mb-6 md:mb-10 text-center">
            <h2 className="font-playfair text-2xl md:text-3xl text-dark-plum">
              Mais desejadas
            </h2>
            <p className="mt-1 md:mt-2 font-cormorant text-base md:text-lg italic text-muted-mauve">
              Peças exclusivas que você vai amar
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <Link key={product.id} href={`/produtos/${product.slug}`}>
                <Card className="group overflow-hidden transition-shadow hover:shadow-lg">
                  <div className="relative aspect-[3/4] bg-champagne">
                    {product.images && product.images.length > 0 ? (
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-4xl md:text-6xl">
                        ✨
                      </div>
                    )}
                    {product.isNew && (
                      <Badge
                        variant="gold"
                        className="absolute left-2 md:left-3 top-2 md:top-3"
                      >
                        Novo
                      </Badge>
                    )}
                    {product.compareAtPrice && product.compareAtPrice > product.price && (
                      <Badge variant="blush" className="absolute left-2 md:left-3 top-2 md:top-3">
                        Oferta
                      </Badge>
                    )}
                  </div>
                  <div className="space-y-1 md:space-y-2 p-3 md:p-4">
                    <h3 className="font-lato text-xs md:text-sm font-medium text-dark-plum line-clamp-1">
                      {product.name}
                    </h3>
                    <p className="text-xs text-muted-mauve">{product.material || 'Semi-joia'}</p>
                    <p className="font-lato text-sm md:text-base font-semibold text-rose-gold">
                      R$ {Number(product.price).toFixed(2).replace(".", ",")}
                    </p>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Editorial Banner */}
      <section className="bg-rose-gold py-12 md:py-20">
        <div className="mx-auto flex max-w-7xl items-center px-4 lg:px-8">
          <div className="max-w-lg space-y-4 md:space-y-6">
            <h2 className="font-playfair text-2xl md:text-4xl font-medium text-white">
              Nova coleção · Outono 2026
            </h2>
            <p className="text-sm md:text-base text-white/90">
              Peças exclusivas pensadas para mulheres que amam se sentir
              únicas.
            </p>
            <Link href="/produtos?collection=outono">
              <Button
                variant="secondary"
                className="bg-white text-rose-gold hover:bg-champagne"
              >
                Descobrir agora
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-ivory py-10 md:py-16">
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 px-4 md:grid-cols-3 md:gap-16">
          {features.map((feature, index) => (
            <div key={index} className="flex max-w-xs flex-col items-center text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-champagne">
                <feature.icon className="h-6 w-6 text-rose-gold" />
              </div>
              <h3 className="mb-2 font-playfair text-lg text-dark-plum">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-mauve">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-champagne py-10 md:py-16">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <h2 className="mb-6 md:mb-10 text-center font-playfair text-2xl md:text-3xl text-dark-plum">
            O que dizem nossas clientes
          </h2>
          <div className="grid gap-4 md:grid-cols-3 md:gap-6">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-4 md:p-6">
                <div className="mb-2 md:mb-3 text-gold-light">{"★★★★★"}</div>
                <p className="mb-3 md:mb-4 font-cormorant text-sm md:text-base italic text-dark-plum">
                  "{testimonial.text}"
                </p>
                <p className="text-xs md:text-sm font-semibold text-rose-gold">
                  {testimonial.name} · {testimonial.city}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-dark-plum py-10 md:py-16">
        <div className="mx-auto max-w-xl px-4 text-center">
          <h2 className="mb-2 md:mb-3 font-playfair text-xl md:text-2xl text-white">
            Ganhe 10% de desconto na primeira compra
          </h2>
          <p className="mb-4 md:mb-6 text-sm md:text-base text-white/70">
            Assine nossa newsletter e receba exclusivas e ofertas especiais
          </p>
          <form className="flex flex-col gap-3 sm:flex-row">
            <input
              type="email"
              placeholder="Seu melhor e-mail"
              className="flex-1 rounded-full border-0 bg-white px-4 py-3 text-dark-plum placeholder:text-muted-mauve focus:outline-none focus:ring-2 focus:ring-rose-gold"
            />
            <Button type="submit" className="w-full sm:w-auto">Assinar</Button>
          </form>
        </div>
      </section>
    </div>
  )
}
