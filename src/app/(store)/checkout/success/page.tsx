import Link from 'next/link'
import { Check, Package } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-screen bg-ivory py-12">
      <div className="mx-auto max-w-2xl px-4 text-center">
        <Card className="p-12">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
            <Check className="h-10 w-10 text-green-600" />
          </div>

          <h1 className="mb-4 font-playfair text-3xl text-dark-plum">
            Pedido confirmado!
          </h1>

          <p className="mb-8 text-muted-mauve">
            Obrigado pela sua compra! Recebemos o seu pedido e estamos
            processando agora.
          </p>

          <div className="mb-8 rounded-lg bg-champagne p-6 text-left">
            <div className="flex items-center gap-4">
              <Package className="h-8 w-8 text-rose-gold" />
              <div>
                <p className="font-medium text-dark-plum">
                  O que acontece agora?
                </p>
                <p className="text-sm text-muted-mauve">
                  Você receberá um e-mail com os detalhes do pedido em breve.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/produtos" className="flex-1">
              <Button className="w-full">Continuar comprando</Button>
            </Link>
            <Link href="/conta/pedidos" className="flex-1">
              <Button variant="outline" className="w-full">
                Ver meus pedidos
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  )
}
