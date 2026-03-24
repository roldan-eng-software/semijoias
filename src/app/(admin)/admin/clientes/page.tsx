import { prisma } from '@/lib/prisma'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Search, Mail, Phone } from 'lucide-react'
import Link from 'next/link'

export default async function AdminClientesPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; page?: string }>
}) {
  const params = await searchParams
  const search = params.search
  const page = parseInt(params.page || '1')
  const perPage = 10

  const where = search
    ? {
        OR: [
          { name: { contains: search, mode: 'insensitive' as const } },
          { email: { contains: search, mode: 'insensitive' as const } },
          { cpf: { contains: search } },
        ],
      }
    : {}

  const [clientes, total] = await Promise.all([
    prisma.user.findMany({
      where,
      include: {
        orders: {
          select: { id: true },
        },
        _count: {
          select: { orders: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    prisma.user.count({ where }),
  ])

  const totalPages = Math.ceil(total / perPage)

  return (
    <div>
      <h1 className="mb-8 font-playfair text-3xl text-dark-plum">Clientes</h1>

      {/* Search */}
      <form className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-mauve" />
          <input
            type="text"
            name="search"
            defaultValue={search || ''}
            placeholder="Buscar por nome, e-mail ou CPF..."
            className="w-full rounded-lg border border-champagne bg-white py-2.5 pl-10 pr-4 text-dark-plum placeholder:text-muted-mauve focus:border-rose-gold focus:outline-none focus:ring-1 focus:ring-rose-gold"
          />
        </div>
      </form>

      {/* Clientes Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-champagne">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-dark-plum">Cliente</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-dark-plum">CPF</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-dark-plum">Telefone</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-dark-plum">Pedidos</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-dark-plum">Status</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-dark-plum">Cadastro</th>
              </tr>
            </thead>
            <tbody>
              {clientes.map((cliente) => (
                <tr key={cliente.id} className="border-b border-champagne/50">
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-dark-plum">
                        {cliente.name || 'Sem nome'}
                      </p>
                      <p className="text-sm text-muted-mauve">{cliente.email}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-mauve">
                    {cliente.cpf || '-'}
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-mauve">
                    {cliente.phone || '-'}
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-dark-plum">
                    {cliente._count.orders}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                        cliente.role === 'ADMIN'
                          ? 'bg-purple-100 text-purple-700'
                          : 'bg-green-100 text-green-700'
                      }`}
                    >
                      {cliente.role === 'ADMIN' ? 'Admin' : 'Cliente'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-mauve">
                    {new Date(cliente.createdAt).toLocaleDateString('pt-BR')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {clientes.length === 0 && (
          <div className="p-8 text-center text-muted-mauve">
            Nenhum cliente encontrado
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-champagne px-4 py-3">
            <p className="text-sm text-muted-mauve">
              Mostrando {(page - 1) * perPage + 1} - {Math.min(page * perPage, total)} de {total}
            </p>
            <div className="flex gap-2">
              {page > 1 && (
                <Link href={`/admin/clientes?page=${page - 1}${search ? `&search=${search}` : ''}`}>
                  <button className="rounded-lg border border-champagne px-3 py-1 text-sm">Anterior</button>
                </Link>
              )}
              {page < totalPages && (
                <Link href={`/admin/clientes?page=${page + 1}${search ? `&search=${search}` : ''}`}>
                  <button className="rounded-lg border border-champagne px-3 py-1 text-sm">Próximo</button>
                </Link>
              )}
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}
