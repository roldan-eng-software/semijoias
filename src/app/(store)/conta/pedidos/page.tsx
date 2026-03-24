'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { User, Package, Heart, MapPin, Lock, Eye, Loader2 } from 'lucide-react'

const statusColors: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  PAID: 'bg-green-100 text-green-700',
  PROCESSING: 'bg-blue-100 text-blue-700',
  SHIPPED: 'bg-purple-100 text-purple-700',
  DELIVERED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-red-100 text-red-700',
  REFUNDED: 'bg-gray-100 text-gray-700',
}

const statusLabels: Record<string, string> = {
  PENDING: 'Pendente',
  PAID: 'Pago',
  PROCESSING: 'Processando',
  SHIPPED: 'Enviado',
  DELIVERED: 'Entregue',
  CANCELLED: 'Cancelado',
  REFUNDED: 'Reembolsado',
}

interface Order {
  id: string
  orderNumber: string
  status: string
  total: number
  createdAt: string
  items: { id: string; product: { name: string }; quantity: number; price: number }[]
}

export default function ContaPedidosPage() {
  const { data: session } = useSession()
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (session?.user?.id) {
      fetchOrders()
    }
  }, [session])

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/conta/pedidos')
      if (res.ok) {
        const data = await res.json()
        setOrders(data)
      }
    } catch (error) {
      console.error('Erro ao buscar pedidos', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-ivory py-12">
        <div className="mx-auto max-w-md px-4 text-center">
          <h1 className="mb-4 font-playfair text-2xl text-dark-plum">Acesso restrito</h1>
          <p className="mb-6 text-muted-mauve">Faça login para acessar sua conta</p>
          <Link href="/auth/signin">
            <Button>Fazer login</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-ivory py-12">
      <div className="mx-auto max-w-6xl px-4">
        <h1 className="mb-8 font-playfair text-3xl text-dark-plum">Minha Conta</h1>

        <div className="grid gap-6 lg:grid-cols-4">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="p-4">
              <nav className="space-y-2">
                <Link
                  href="/conta"
                  className="flex items-center gap-3 rounded-lg px-4 py-3 text-dark-plum hover:bg-champagne"
                >
                  <User className="h-5 w-5" />
                  Meus Dados
                </Link>
                <Link
                  href="/conta/pedidos"
                  className="flex items-center gap-3 rounded-lg bg-rose-gold px-4 py-3 text-white"
                >
                  <Package className="h-5 w-5" />
                  Meus Pedidos
                </Link>
                <Link
                  href="/conta/enderecos"
                  className="flex items-center gap-3 rounded-lg px-4 py-3 text-dark-plum hover:bg-champagne"
                >
                  <MapPin className="h-5 w-5" />
                  Endereços
                </Link>
                <Link
                  href="/conta/senha"
                  className="flex items-center gap-3 rounded-lg px-4 py-3 text-dark-plum hover:bg-champagne"
                >
                  <Lock className="h-5 w-5" />
                  Alterar Senha
                </Link>
              </nav>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card className="p-6">
              <h2 className="mb-6 font-playfair text-xl text-dark-plum">Meus Pedidos</h2>

              {isLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-rose-gold" />
                </div>
              ) : orders.length === 0 ? (
                <div className="py-8 text-center">
                  <Package className="mx-auto mb-4 h-12 w-12 text-muted-mauve" />
                  <p className="text-muted-mauve">Você ainda não fez nenhum pedido</p>
                  <Link href="/produtos" className="mt-4 inline-block">
                    <Button>Ver produtos</Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="rounded-lg border border-champagne p-4"
                    >
                      <div className="mb-3 flex items-center justify-between">
                        <div>
                          <p className="font-medium text-dark-plum">
                            Pedido #{order.orderNumber}
                          </p>
                          <p className="text-sm text-muted-mauve">
                            {new Date(order.createdAt).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${statusColors[order.status]}`}
                        >
                          {statusLabels[order.status]}
                        </span>
                      </div>
                      <div className="mb-3 flex items-center justify-between">
                        <p className="font-medium text-dark-plum">
                          R$ {Number(order.total).toFixed(2).replace('.', ',')}
                        </p>
                        <p className="text-sm text-muted-mauve">
                          {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                        </p>
                      </div>
                      <div className="flex justify-end">
                        <Link href={`/checkout/success?order=${order.id}`}>
                          <Button variant="outline" size="sm">
                            <Eye className="mr-2 h-4 w-4" />
                            Ver detalhes
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
