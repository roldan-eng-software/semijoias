import { prisma } from '@/lib/prisma'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Eye } from 'lucide-react'
import Link from 'next/link'

const statusColors: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  PAID: 'bg-green-100 text-green-700',
  PROCESSING: 'bg-blue-100 text-blue-700',
  SHIPPED: 'bg-purple-100 text-purple-700',
  DELIVERED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-red-100 text-red-700',
  REFUNDED: 'bg-gray-100 text-gray-700',
}

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; page?: string }>
}) {
  const params = await searchParams
  const status = params.status
  const page = parseInt(params.page || '1')
  const perPage = 10

  const where = status ? { status: status as any } : {}

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      include: { user: true, items: { include: { product: true } } },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    prisma.order.count({ where }),
  ])

  const totalPages = Math.ceil(total / perPage)

  const statuses = ['PENDING', 'PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED']

  return (
    <div>
      <h1 className="mb-8 font-playfair text-3xl text-dark-plum">Pedidos</h1>

      {/* Status Filter */}
      <div className="mb-6 flex flex-wrap gap-2">
        <Link
          href="/admin/pedidos"
          className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
            !status ? 'bg-rose-gold text-white' : 'bg-champagne text-dark-plum hover:bg-rose-gold hover:text-white'
          }`}
        >
          Todos
        </Link>
        {statuses.map((s) => (
          <Link
            key={s}
            href={`/admin/pedidos?status=${s}`}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              status === s ? 'bg-rose-gold text-white' : 'bg-champagne text-dark-plum hover:bg-rose-gold hover:text-white'
            }`}
          >
            {s === 'PENDING' ? 'Pendente' :
             s === 'PAID' ? 'Pago' :
             s === 'PROCESSING' ? 'Processando' :
             s === 'SHIPPED' ? 'Enviado' :
             s === 'DELIVERED' ? 'Entregue' :
             'Cancelado'}
          </Link>
        ))}
      </div>

      {/* Orders Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-champagne">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-dark-plum">Pedido</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-dark-plum">Cliente</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-dark-plum">Itens</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-dark-plum">Total</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-dark-plum">Status</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-dark-plum">Data</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-dark-plum">Ações</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b border-champagne/50">
                  <td className="px-4 py-3 text-sm font-medium text-dark-plum">
                    {order.orderNumber}
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-mauve">
                    {order.user.name || order.user.email}
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-mauve">
                    {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-dark-plum">
                    R$ {Number(order.total).toFixed(2).replace('.', ',')}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${statusColors[order.status]}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-mauve">
                    {new Date(order.createdAt).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/pedidos/${order.id}`}
                      className="inline-flex rounded-lg p-2 text-muted-mauve hover:bg-champagne hover:text-dark-plum"
                    >
                      <Eye className="h-4 w-4" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {orders.length === 0 && (
          <div className="p-8 text-center text-muted-mauve">
            Nenhum pedido encontrado
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
                <Link href={`/admin/pedidos?page=${page - 1}${status ? `&status=${status}` : ''}`}>
                  <button className="rounded-lg border border-champagne px-3 py-1 text-sm">Anterior</button>
                </Link>
              )}
              {page < totalPages && (
                <Link href={`/admin/pedidos?page=${page + 1}${status ? `&status=${status}` : ''}`}>
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
