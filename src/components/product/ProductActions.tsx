'use client'

import { Heart, Share2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { AddToCartButton } from './AddToCartButton'

interface ProductActionsProps {
  productId: string
  name: string
  price: number
  image?: string
  material?: string
  stock: number
}

export function ProductActions({
  productId,
  name,
  price,
  image,
  material,
  stock,
}: ProductActionsProps) {
  return (
    <div className="space-y-4">
      <div className="flex gap-3">
        <AddToCartButton
          productId={productId}
          name={name}
          price={price}
          image={image}
          material={material}
          stock={stock}
        />
        <Button size="lg" variant="outline" className="px-4">
          <Heart className="h-5 w-5" />
        </Button>
        <Button size="lg" variant="ghost" className="px-4">
          <Share2 className="h-5 w-5" />
        </Button>
      </div>
    </div>
  )
}
