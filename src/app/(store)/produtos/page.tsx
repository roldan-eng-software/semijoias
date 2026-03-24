import Link from "next/link"
import Image from "next/image"
import { prisma } from "@/lib/prisma"
import { Badge } from "@/components/ui/Badge"
import { Card } from "@/components/ui/Card"
import { Input } from "@/components/ui/Input"

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; search?: string }>
}) {
  const params = await searchParams
  const categorySlug = params.category
  const searchQuery = params.search

  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  })

  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      ...(categorySlug && {
        category: { slug: categorySlug },
      }),
      ...(searchQuery && {
        OR: [
          { name: { contains: searchQuery, mode: "insensitive" } },
          { description: { contains: searchQuery, mode: "insensitive" } },
        ],
      }),
    },
    include: { category: true },
    orderBy: { createdAt: "desc" },
  })

  const selectedCategory = categories.find((c) => c.slug === categorySlug)

  return (
    <div className="min-h-screen bg-ivory">
      {/* Header */}
      <div className="bg-dark-plum py-3">
        <div className="mx-auto flex max-w-7xl items-center justify-around px-4">
          <span className="text-xs text-white">Frete grátis acima de R$199</span>
          <span className="text-xs text-white">Garantia de 6 meses</span>
          <span className="text-xs text-white">Parcele em 3x</span>
        </div>
      </div>

      {/* Page Header */}
      <div className="bg-champagne py-12">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <h1 className="font-playfair text-4xl text-dark-plum lg:text-5xl">
            {selectedCategory ? selectedCategory.name : "Nossos produtos"}
          </h1>
          {selectedCategory?.description && (
            <p className="mt-2 font-cormorant text-lg italic text-muted-mauve">
              {selectedCategory.description}
            </p>
          )}
          <div className="mt-4 flex items-center gap-2 text-sm text-muted-mauve">
            <Link href="/" className="hover:text-rose-gold">
              Início
            </Link>
            <span>/</span>
            <span className="text-dark-plum">Produtos</span>
            {selectedCategory && (
              <>
                <span>/</span>
                <span className="text-rose-gold">{selectedCategory.name}</span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Sidebar */}
          <aside className="w-full lg:w-64 shrink-0">
            {/* Search */}
            <form className="mb-6">
              <Input
                type="search"
                name="search"
                placeholder="Buscar produtos..."
                defaultValue={searchQuery}
                className="w-full"
              />
            </form>

            {/* Categories */}
            <div className="mb-8">
              <h3 className="mb-4 font-playfair text-lg text-dark-plum">
                Categorias
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/produtos"
                    className={`block rounded-lg px-3 py-2 text-sm transition-colors ${
                      !categorySlug
                        ? "bg-rose-gold text-white"
                        : "text-muted-mauve hover:bg-champagne hover:text-dark-plum"
                    }`}
                  >
                    Todos os produtos
                  </Link>
                </li>
                {categories.map((category) => (
                  <li key={category.id}>
                    <Link
                      href={`/produtos?category=${category.slug}`}
                      className={`block rounded-lg px-3 py-2 text-sm transition-colors ${
                        categorySlug === category.slug
                          ? "bg-rose-gold text-white"
                          : "text-muted-mauve hover:bg-champagne hover:text-dark-plum"
                      }`}
                    >
                      {category.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Filters Info */}
            <div className="rounded-lg bg-champagne p-4">
              <p className="text-sm text-muted-mauve">
                <span className="font-semibold text-dark-plum">
                  {products.length}
                </span>{" "}
                produto{products.length !== 1 ? "s" : ""} encontrado
                {products.length !== 1 ? "s" : ""}
              </p>
            </div>
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            {products.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="mb-4 text-6xl">🔍</div>
                <h3 className="font-playfair text-xl text-dark-plum">
                  Nenhum produto encontrado
                </h3>
                <p className="mt-2 text-muted-mauve">
                  Tente buscar por outro termo ou categoria
                </p>
                <Link
                  href="/produtos"
                  className="mt-4 text-sm font-medium text-rose-gold hover:underline"
                >
                  Ver todos os produtos
                </Link>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {products.map((product) => (
                  <Link key={product.id} href={`/produtos/${product.slug}`}>
                    <Card className="group h-full overflow-hidden transition-shadow hover:shadow-lg">
                      <div className="relative aspect-[3/4] bg-champagne">
                        {product.images[0] ? (
                          <Image
                            src={product.images[0]}
                            alt={product.name}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-6xl">
                            ✨
                          </div>
                        )}
                        {product.isNew && (
                          <Badge variant="gold" className="absolute left-3 top-3">
                            Novo
                          </Badge>
                        )}
                        {product.compareAtPrice && (
                          <Badge variant="blush" className="absolute left-3 top-3">
                            -{Math.round(
                              ((Number(product.compareAtPrice) -
                                Number(product.price)) /
                                Number(product.compareAtPrice)) *
                                100
                            )}
                            %
                          </Badge>
                        )}
                      </div>
                      <div className="space-y-2 p-4">
                        <span className="text-xs uppercase tracking-wider text-muted-mauve">
                          {product.category.name}
                        </span>
                        <h3 className="font-lato text-sm font-medium text-dark-plum line-clamp-2">
                          {product.name}
                        </h3>
                        <p className="text-xs text-muted-mauve">
                          {product.material}
                        </p>
                        <div className="flex items-center gap-2">
                          <p className="font-lato text-base font-semibold text-rose-gold">
                            R${" "}
                            {Number(product.price)
                              .toFixed(2)
                              .replace(".", ",")}
                          </p>
                          {product.compareAtPrice && (
                            <p className="text-xs text-muted-mauve line-through">
                              R${" "}
                              {Number(product.compareAtPrice)
                                .toFixed(2)
                                .replace(".", ",")}
                            </p>
                          )}
                        </div>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
