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
        <div className="mx-auto flex max-w-7xl items-center justify-around px-4">
          <span className="text-xs text-white">Frete grátis acima de R$199</span>
          <span className="text-xs text-white">Garantia de 6 meses</span>
          <span className="text-xs text-white">Parcele em 3x</span>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="mx-auto max-w-7xl px-4 py-4 lg:px-8">
        <div className="flex items-center gap-2 text-sm text-muted-mauve">
          <Link href="/" className="hover:text-rose-gold">
            Início
          </Link>
          <span>/</span>
          <Link href="/produtos" className="hover:text-rose-gold">
            Produtos
          </Link>
          <span>/</span>
          <Link
            href={`/produtos?category=${product.category.slug}`}
            className="hover:text-rose-gold"
          >
            {product.category.name}
          </Link>
          <span>/</span>
          <span className="text-dark-plum">{product.name}</span>
        </div>
      </div>

      {/* Product Details */}
      <div className="mx-auto max-w-7xl px-4 pb-16 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-champagne">
              {product.images[0] ? (
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-8xl">
                  ✨
                </div>
              )}
              {product.isNew && (
                <Badge variant="gold" className="absolute left-4 top-4">
                  Novo
                </Badge>
              )}
              {product.compareAtPrice && (
                <Badge variant="blush" className="absolute left-4 top-4">
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
              <div className="flex gap-3">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    className="relative h-20 w-20 overflow-hidden rounded-lg bg-champagne"
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
          <div className="space-y-6">
            <div>
              <span className="text-sm uppercase tracking-wider text-muted-mauve">
                {product.category.name}
              </span>
              <h1 className="mt-1 font-playfair text-3xl text-dark-plum lg:text-4xl">
                {product.name}
              </h1>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="font-lato text-3xl font-semibold text-rose-gold">
                R$ {Number(product.price).toFixed(2).replace(".", ",")}
              </span>
              {product.compareAtPrice && (
                <span className="text-lg text-muted-mauve line-through">
                  R$ {Number(product.compareAtPrice).toFixed(2).replace(".", ",")}
                </span>
              )}
            </div>

            {/* Stock */}
            <div className="flex items-center gap-2">
              {product.stock > 0 ? (
                <>
                  <span className="h-2 w-2 rounded-full bg-green-500" />
                  <span className="text-sm text-green-600">
                    Em estoque ({product.stock} unidades)
                  </span>
                </>
              ) : (
                <>
                  <span className="h-2 w-2 rounded-full bg-red-500" />
                  <span className="text-sm text-red-600">Fora de estoque</span>
                </>
              )}
            </div>

            {/* Details */}
            <Card className="p-4">
              <h3 className="mb-3 font-lato text-sm font-semibold text-dark-plum">
                Características
              </h3>
              <dl className="space-y-2 text-sm">
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
            <div className="space-y-3 rounded-lg bg-champagne p-4">
              <div className="flex items-center gap-3 text-sm">
                <Truck className="h-5 w-5 text-rose-gold" />
                <span className="text-dark-plum">
                  Frete grátis para pedidos acima de R$199
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Shield className="h-5 w-5 text-rose-gold" />
                <span className="text-dark-plum">
                  6 meses de garantia contra defeitos
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <RefreshCw className="h-5 w-5 text-rose-gold" />
                <span className="text-dark-plum">
                  Troca fácil em até 30 dias
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        {product.description && (
          <div className="mt-16">
            <h2 className="mb-4 font-playfair text-2xl text-dark-plum">
              Descrição
            </h2>
            <div className="prose prose-stone max-w-none text-muted-mauve">
              <p>{product.description}</p>
            </div>
          </div>
        )}

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="mb-6 font-playfair text-2xl text-dark-plum">
              Você também pode gostar
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
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
                      <h3 className="font-lato text-sm font-medium text-dark-plum line-clamp-1">
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
