'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/store/cartStore'
import { Button } from '@/components/ui/Button'
import { Loader2 } from 'lucide-react'

interface PaymentButtonProps {
  customer: {
    email: string
    name: string
    phone?: string
  }
  shippingAddress?: {
    street: string
    number: string
    complement?: string
    district: string
    city: string
    state: string
    zipCode: string
  }
}

export function PaymentButton({ customer, shippingAddress }: PaymentButtonProps) {
  const router = useRouter()
  const { items, getTotalPrice, clearCart } = useCartStore()
  const [isLoading, setIsLoading] = useState(false)

  const handlePayment = async () => {
    if (items.length === 0) return

    setIsLoading(true)

    try {
      const response = await fetch('/api/payment/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items,
          customer,
          shippingAddress,
        }),
      })

      const data = await response.json()

      if (data.initPoint) {
        clearCart()
        window.location.href = data.initPoint
      } else {
        throw new Error(data.error || 'Erro ao processar pagamento')
      }
    } catch (error) {
      console.error('Payment error:', error)
      alert('Erro ao processar pagamento. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      size="lg"
      className="w-full"
      onClick={handlePayment}
      disabled={isLoading || items.length === 0}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Processando...
        </>
      ) : (
        `Pagar R$ ${(getTotalPrice() + (getTotalPrice() >= 199 ? 0 : 15.9)).toFixed(2).replace('.', ',')}`
      )}
    </Button>
  )
}
