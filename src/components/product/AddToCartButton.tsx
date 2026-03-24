'use client'

import { useState } from 'react'
import { useCartStore } from '@/store/cartStore'
import { Button } from '@/components/ui/Button'
import { Loader2 } from 'lucide-react'

interface AddToCartButtonProps {
  productId: string
  name: string
  price: number
  image?: string
  material?: string
  stock: number
}

export function AddToCartButton({
  productId,
  name,
  price,
  image,
  material,
  stock,
}: AddToCartButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const addItem = useCartStore((state) => state.addItem)

  const handleAddToCart = async () => {
    if (stock <= 0) return

    setIsLoading(true)

    await new Promise((resolve) => setTimeout(resolve, 300))

    addItem({
      productId,
      name,
      price,
      image: image || '',
      quantity: 1,
      material,
    })

    setIsLoading(false)
  }

  if (stock <= 0) {
    return (
      <Button size="lg" className="flex-1" disabled>
        Fora de estoque
      </Button>
    )
  }

  return (
    <Button size="lg" className="flex-1" onClick={handleAddToCart} disabled={isLoading}>
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Adicionando...
        </>
      ) : (
        'Adicionar ao carrinho'
      )}
    </Button>
  )
}
