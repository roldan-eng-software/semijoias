import { prisma } from '@/lib/prisma'
import { Card } from '@/components/ui/Card'
import { Package, ShoppingCart, Users, Currency } from 'lucide-react'

export default async function AdminDashboard() {
  const [totalProducts, totalOrders, totalUsers, recentOrders] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.user.count(),
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { user: true },
    }),
  ])

  const totalRevenue = await prisma.order.aggregate({
    where: { status: 'PAID' },
    _sum: { total: true },
  })

  const stats = [
    {
      label: 'Produtos',
      value: totalProducts,
      icon: Package,
      color: 'bg-blue-500',
    },
    {
      label: 'Pedidos',
      value: totalOrders,
      icon: ShoppingCart,
      color: 'bg-green-500',
    },
    {
      label: 'Clientes',
      value: totalUsers,
      icon: Users,
      color: 'bg-purple-500',
    },
    {
      label: 'Receita',
      value: `R$ ${(totalRevenue._sum.total?.toNumber() || 0).toFixed(2).replace('.', ',')}`,
      icon: Currency,
      color: 'bg-rose-gold',
    },
  ]

  return (
    <div>
      <h1 className="mb-8 font-playfair text-3xl text-dark-plum">Dashboard</h1>

      {/* Stats */}
      <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-mauve">{stat.label}</p>
                <p className="mt-1 font-playfair text-2xl font-semibold text-dark-plum">
                  {stat.value}
                </p>
              </div>
              <div className={`flex h-12 w-12 items-center justify-center rounded-full ${stat.color}`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Recent Orders */}
      <Card className="p-6">
        <h2 className="mb-4 font-playfair text-xl text-dark-plum">Pedidos recentes</h2>
        {recentOrders.length === 0 ? (
          <p className="text-muted-mauve">Nenhum pedido ainda</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-champagne text-left">
                  <th className="pb-3 text-sm font-medium text-muted-mauve">Pedido</th>
                  <th className="pb-3 text-sm font-medium text-muted-mauve">Cliente</th>
                  <th className="pb-3 text-sm font-medium text-muted-mauve">Status</th>
                  <th className="pb-3 text-sm font-medium text-muted-mauve">Total</th>
                  <th className="pb-3 text-sm font-medium text-muted-mauve">Data</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-champagne/50">
                    <td className="py-3 text-sm font-medium text-dark-plum">
                      {order.orderNumber}
                    </td>
                    <td className="py-3 text-sm text-muted-mauve">
                      {order.user.name || order.user.email}
                    </td>
                    <td className="py-3">
                      <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                        order.status === 'PAID' ? 'bg-green-100 text-green-700' :
                        order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 text-sm font-medium text-dark-plum">
                      R$ {Number(order.total).toFixed(2).replace('.', ',')}
                    </td>
                    <td className="py-3 text-sm text-muted-mauve">
                      {new Date(order.createdAt).toLocaleDateString('pt-BR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  )
}
