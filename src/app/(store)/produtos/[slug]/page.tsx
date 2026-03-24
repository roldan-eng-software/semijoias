import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { ProductActions } from "@/components/product/ProductActions"
import { Shield, Truck, RefreshCw } from "lucide-react"

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  const product = await prisma.product.findUnique({
    where: { slug, isActive: true },
    include: {
      category: true,
    },
  })

  if (!product) {
    notFound()
  }

  const relatedProducts = await prisma.product.findMany({
    where: {
      categoryId: product.categoryId,
      id: { not: product.id },
      isActive: true,
    },
    take: 4,
    include: { category: true },
  })

  return (
    <div className="min-h-screen bg-ivory">
      {/* Trust Bar */}
      <div className="bg-dark-plum py-3">
        <div className="mx-auto flex max-w-7xl items-center justify-center gap-4 px-4 md:justify-around md:gap-0">
          <span className="hidden text-xs text-white md:block">Frete grátis acima de R$199</span>
          <span className="hidden text-xs text-white md:block">Garantia de 6 meses</span>
          <span className="hidden text-xs text-white md:block">Parcele em 3x</span>
          <div className="flex gap-4 md:hidden">
            <span className="text-xs text-white">Frete Grátis ✓</span>
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="mx-auto max-w-7xl px-4 py-3 md:py-4 lg:px-8">
        <div className="flex items-center gap-1 md:gap-2 text-xs md:text-sm text-muted-mauve overflow-x-auto">
          <Link href="/" className="hover:text-rose-gold whitespace-nowrap">
            Início
          </Link>
          <span>/</span>
          <Link href="/produtos" className="hover:text-rose-gold whitespace-nowrap">
            Produtos
          </Link>
          <span>/</span>
          <Link
            href={`/produtos?category=${product.category.slug}`}
            className="hover:text-rose-gold whitespace-nowrap"
          >
            {product.category.name}
          </Link>
          <span>/</span>
          <span className="text-dark-plum whitespace-nowrap">{product.name}</span>
        </div>
      </div>

      {/* Product Details */}
      <div className="mx-auto max-w-7xl px-4 pb-10 md:pb-16 lg:px-8">
        <div className="grid gap-6 md:gap-8 lg:grid-cols-2">
          {/* Gallery */}
          <div className="space-y-3 md:space-y-4">
            <div className="relative aspect-[3/4] overflow-hidden rounded-xl md:rounded-2xl bg-champagne">
              {product.images[0] ? (
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-5xl md:text-8xl">
                  ✨
                </div>
              )}
              {product.isNew && (
                <Badge variant="gold" className="absolute left-3 md:left-4 top-3 md:top-4">
                  Novo
                </Badge>
              )}
              {product.compareAtPrice && (
                <Badge variant="blush" className="absolute left-3 md:left-4 top-3 md:top-4">
                  -{Math.round(
                    ((Number(product.compareAtPrice) - Number(product.price)) /
                      Number(product.compareAtPrice)) *
                      100
                  )}
                  %
                </Badge>
              )}
            </div>
            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex gap-2 md:gap-3 overflow-x-auto">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    className="relative h-16 w-16 md:h-20 md:w-20 shrink-0 overflow-hidden rounded-lg bg-champagne"
                  >
                    <Image
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="space-y-4 md:space-y-6">
            <div>
              <span className="text-xs md:text-sm uppercase tracking-wider text-muted-mauve">
                {product.category.name}
              </span>
              <h1 className="mt-1 font-playfair text-2xl md:text-3xl text-dark-plum lg:text-4xl">
                {product.name}
              </h1>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-2 md:gap-3">
              <span className="font-lato text-2xl md:text-3xl font-semibold text-rose-gold">
                R$ {Number(product.price).toFixed(2).replace(".", ",")}
              </span>
              {product.compareAtPrice && (
                <span className="text-sm md:text-lg text-muted-mauve line-through">
                  R$ {Number(product.compareAtPrice).toFixed(2).replace(".", ",")}
                </span>
              )}
            </div>

            {/* Stock */}
            <div className="flex items-center gap-2">
              {product.stock > 0 ? (
                <>
                  <span className="h-2 w-2 rounded-full bg-green-500" />
                  <span className="text-xs md:text-sm text-green-600">
                    Em estoque ({product.stock} unidades)
                  </span>
                </>
              ) : (
                <>
                  <span className="h-2 w-2 rounded-full bg-red-500" />
                  <span className="text-xs md:text-sm text-red-600">Fora de estoque</span>
                </>
              )}
            </div>

            {/* Details */}
            <Card className="p-3 md:p-4">
              <h3 className="mb-2 md:mb-3 font-lato text-sm font-semibold text-dark-plum">
                Características
              </h3>
              <dl className="space-y-1 md:space-y-2 text-xs md:text-sm">
                {product.material && (
                  <div className="flex justify-between">
                    <dt className="text-muted-mauve">Material</dt>
                    <dd className="font-medium text-dark-plum">{product.material}</dd>
                  </div>
                )}
                {product.stone && (
                  <div className="flex justify-between">
                    <dt className="text-muted-mauve">Pedra</dt>
                    <dd className="font-medium text-dark-plum">{product.stone}</dd>
                  </div>
                )}
                {product.gender && (
                  <div className="flex justify-between">
                    <dt className="text-muted-mauve">Gênero</dt>
                    <dd className="font-medium text-dark-plum">
                      {product.gender === "FEMININO"
                        ? "Feminino"
                        : product.gender === "MASCULINO"
                          ? "Masculino"
                          : "Unissex"}
                    </dd>
                  </div>
                )}
                {product.sku && (
                  <div className="flex justify-between">
                    <dt className="text-muted-mauve">SKU</dt>
                    <dd className="font-medium text-dark-plum">{product.sku}</dd>
                  </div>
                )}
              </dl>
            </Card>

            {/* Actions */}
            <ProductActions
              productId={product.id}
              name={product.name}
              price={Number(product.price)}
              image={product.images[0]}
              material={product.material || undefined}
              stock={product.stock}
            />

            {/* Benefits */}
            <div className="space-y-2 md:space-y-3 rounded-lg bg-champagne p-3 md:p-4">
              <div className="flex items-center gap-2 md:gap-3 text-xs md:text-sm">
                <Truck className="h-4 w-4 md:h-5 md:w-5 text-rose-gold shrink-0" />
                <span className="text-dark-plum">
                  Frete grátis para pedidos acima de R$199
                </span>
              </div>
              <div className="flex items-center gap-2 md:gap-3 text-xs md:text-sm">
                <Shield className="h-4 w-4 md:h-5 md:w-5 text-rose-gold shrink-0" />
                <span className="text-dark-plum">
                  6 meses de garantia contra defeitos
                </span>
              </div>
              <div className="flex items-center gap-2 md:gap-3 text-xs md:text-sm">
                <RefreshCw className="h-4 w-4 md:h-5 md:w-5 text-rose-gold shrink-0" />
                <span className="text-dark-plum">
                  Troca fácil em até 30 dias
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        {product.description && (
          <div className="mt-10 md:mt-16">
            <h2 className="mb-3 md:mb-4 font-playfair text-xl md:text-2xl text-dark-plum">
              Descrição
            </h2>
            <div className="prose prose-stone max-w-none text-sm md:text-base text-muted-mauve">
              <p>{product.description}</p>
            </div>
          </div>
        )}

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-10 md:mt-16">
            <h2 className="mb-4 md:mb-6 font-playfair text-xl md:text-2xl text-dark-plum">
              Você também pode gostar
            </h2>
            <div className="grid gap-4 md:gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {relatedProducts.map((related) => (
                <Link key={related.id} href={`/produtos/${related.slug}`}>
                  <Card className="group overflow-hidden transition-shadow hover:shadow-lg">
                    <div className="relative aspect-[3/4] bg-champagne">
                      {related.images[0] ? (
                        <Image
                          src={related.images[0]}
                          alt={related.name}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-4xl">
                          ✨
                        </div>
                      )}
                      {related.isNew && (
                        <Badge variant="gold" className="absolute left-2 top-2">
                          Novo
                        </Badge>
                      )}
                    </div>
                    <div className="space-y-1 p-3">
                      <h3 className="font-lato text-xs md:text-sm font-medium text-dark-plum line-clamp-1">
                        {related.name}
                      </h3>
                      <p className="font-lato text-sm font-semibold text-rose-gold">
                        R$ {Number(related.price).toFixed(2).replace(".", ",")}
                      </p>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
