import Link from 'next/link'
import Image from 'next/image'
import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { ProductActions } from '@/components/admin/ProductActions'
import { Plus, Search, Edit, Trash2 } from 'lucide-react'

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; page?: string }>
}) {
  const params = await searchParams
  const search = params.search || ''
  const page = parseInt(params.page || '1')
  const perPage = 10

  const where: Prisma.ProductWhereInput = search ? {
    OR: [
      { name: { contains: search, mode: 'insensitive' } },
      { sku: { contains: search, mode: 'insensitive' } },
    ],
  } : {}

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: { category: true },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    prisma.product.count({ where }),
  ])

  const totalPages = Math.ceil(total / perPage)

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-playfair text-3xl text-dark-plum">Produtos</h1>
        <Link href="/admin/produtos/novo">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Novo produto
          </Button>
        </Link>
      </div>

      {/* Search */}
      <Card className="mb-6 p-4">
        <form className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-mauve" />
            <input
              type="search"
              name="search"
              placeholder="Buscar produtos..."
              defaultValue={search}
              className="w-full rounded-lg border border-champagne pl-10 pr-4 py-2 text-sm"
            />
          </div>
          <Button type="submit" variant="outline">
            Buscar
          </Button>
        </form>
      </Card>

      {/* Products Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-champagne">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-dark-plum">Produto</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-dark-plum">Categoria</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-dark-plum">Preço</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-dark-plum">Estoque</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-dark-plum">Status</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-dark-plum">Ações</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b border-champagne/50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-champagne">
                        {product.images[0] ? (
                          <Image
                            src={product.images[0]}
                            alt={product.name}
                            width={48}
                            height={48}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-xl">
                            ✨
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-dark-plum">{product.name}</p>
                        <p className="text-xs text-muted-mauve">{product.sku}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-mauve">
                    {product.category.name}
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-dark-plum">
                    R$ {Number(product.price).toFixed(2).replace('.', ',')}
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-mauve">
                    {product.stock}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                      product.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {product.isActive ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <ProductActions productId={product.id} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-champagne px-4 py-3">
            <p className="text-sm text-muted-mauve">
              Mostrando {(page - 1) * perPage + 1} - {Math.min(page * perPage, total)} de {total}
            </p>
            <div className="flex gap-2">
              {page > 1 && (
                <Link href={`/admin/produtos?page=${page - 1}${search ? `&search=${search}` : ''}`}>
                  <Button variant="outline" size="sm">Anterior</Button>
                </Link>
              )}
              {page < totalPages && (
                <Link href={`/admin/produtos?page=${page + 1}${search ? `&search=${search}` : ''}`}>
                  <Button variant="outline" size="sm">Próximo</Button>
                </Link>
              )}
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}
