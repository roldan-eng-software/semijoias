'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { X, Minus, Plus, ShoppingBag } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { Button } from '@/components/ui/Button'

export function CartDrawer() {
  const router = useRouter()
  const { items, isOpen, closeCart, removeItem, updateQuantity, getTotalPrice } =
    useCartStore()

  const handleCheckout = () => {
    closeCart()
    router.push('/checkout')
  }

  const total = getTotalPrice()

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={closeCart}
      />

      {/* Drawer */}
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-ivory shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-champagne p-4">
          <h2 className="font-playfair text-xl text-dark-plum">
            Meu Carrinho ({items.length})
          </h2>
          <button
            onClick={closeCart}
            className="rounded-full p-2 text-muted-mauve hover:bg-champagne hover:text-dark-plum"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Items */}
        <div className="flex h-[calc(100%-180px)] flex-col overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center text-center">
              <ShoppingBag className="mb-4 h-16 w-16 text-champagne" />
              <h3 className="font-playfair text-lg text-dark-plum">
                Seu carrinho está vazio
              </h3>
              <p className="mt-1 text-sm text-muted-mauve">
                Adicione produtos para continuar
              </p>
              <Button onClick={closeCart} className="mt-4">
                Continuar comprando
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 rounded-lg bg-champagne p-3"
                >
                  <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-lg bg-white">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-2xl">
                        ✨
                      </div>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <h3 className="font-lato text-sm font-medium text-dark-plum line-clamp-2">
                        {item.name}
                      </h3>
                      {item.material && (
                        <p className="text-xs text-muted-mauve">{item.material}</p>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            updateQuantity(item.productId, item.quantity - 1)
                          }
                          className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-dark-plum hover:bg-rose-gold hover:text-white"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-6 text-center text-sm font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.productId, item.quantity + 1)
                          }
                          className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-dark-plum hover:bg-rose-gold hover:text-white"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <p className="font-lato text-sm font-semibold text-rose-gold">
                        R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeItem(item.productId)}
                    className="self-start p-1 text-muted-mauve hover:text-red-500"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="absolute bottom-0 left-0 right-0 border-t border-champagne bg-ivory p-4">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-muted-mauve">Total</span>
              <span className="font-lato text-xl font-semibold text-dark-plum">
                R$ {total.toFixed(2).replace('.', ',')}
              </span>
            </div>
            <div className="space-y-2">
              <Button className="w-full" size="lg" onClick={handleCheckout}>
                Finalizar compra
              </Button>
              <Button
                onClick={closeCart}
                variant="outline"
                className="w-full"
              >
                Continuar comprando
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
