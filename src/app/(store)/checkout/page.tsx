'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useCartStore } from '@/store/cartStore'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import {
  ShoppingBag,
  Truck,
  CreditCard,
  Check,
  Minus,
  Plus,
  ArrowLeft,
  Lock,
} from 'lucide-react'

type Step = 'cart' | 'info' | 'shipping' | 'payment'

const steps = [
  { id: 'cart', label: 'Carrinho', icon: ShoppingBag },
  { id: 'info', label: 'Dados', icon: Check },
  { id: 'shipping', label: 'Entrega', icon: Truck },
  { id: 'payment', label: 'Pagamento', icon: CreditCard },
]

export default function CheckoutPage() {
  const [currentStep, setCurrentStep] = useState<Step>('cart')
  const { items, updateQuantity, removeItem, getTotalPrice } = useCartStore()
  const total = getTotalPrice()
  const shipping = total >= 199 ? 0 : 15.9
  const finalTotal = total + shipping

  const [formData, setFormData] = useState({
    email: '',
    name: '',
    phone: '',
    cpf: '',
    zipCode: '',
    street: '',
    number: '',
    complement: '',
    district: '',
    city: '',
    state: '',
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const nextStep = () => {
    const stepOrder: Step[] = ['cart', 'info', 'shipping', 'payment']
    const currentIndex = stepOrder.indexOf(currentStep)
    if (currentIndex < stepOrder.length - 1) {
      setCurrentStep(stepOrder[currentIndex + 1])
    }
  }

  const prevStep = () => {
    const stepOrder: Step[] = ['cart', 'info', 'shipping', 'payment']
    const currentIndex = stepOrder.indexOf(currentStep)
    if (currentIndex > 0) {
      setCurrentStep(stepOrder[currentIndex - 1])
    }
  }

  const currentStepIndex = steps.findIndex((s) => s.id === currentStep)

  if (items.length === 0 && currentStep !== 'payment') {
    return (
      <div className="min-h-screen bg-ivory py-12">
        <div className="mx-auto max-w-2xl px-4 text-center">
          <ShoppingBag className="mx-auto mb-4 h-16 w-16 text-champagne" />
          <h1 className="font-playfair text-2xl text-dark-plum">
            Seu carrinho está vazio
          </h1>
          <p className="mt-2 text-muted-mauve">
            Adicione produtos para continuar
          </p>
          <Link href="/produtos">
            <Button className="mt-6">Ver produtos</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-ivory py-8">
      <div className="mx-auto max-w-6xl px-4 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/produtos"
            className="mb-4 inline-flex items-center gap-2 text-sm text-muted-mauve hover:text-rose-gold"
          >
            <ArrowLeft className="h-4 w-4" />
            Continuar comprando
          </Link>
          <h1 className="font-playfair text-3xl text-dark-plum">Finalizar compra</h1>
        </div>

        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                    index <= currentStepIndex
                      ? 'border-rose-gold bg-rose-gold text-white'
                      : 'border-champagne bg-white text-muted-mauve'
                  }`}
                >
                  {index < currentStepIndex ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <step.icon className="h-5 w-5" />
                  )}
                </div>
                <span
                  className={`ml-2 hidden text-sm font-medium sm:block ${
                    index <= currentStepIndex
                      ? 'text-dark-plum'
                      : 'text-muted-mauve'
                  }`}
                >
                  {step.label}
                </span>
                {index < steps.length - 1 && (
                  <div
                    className={`mx-4 h-0.5 w-8 sm:w-16 ${
                      index < currentStepIndex
                        ? 'bg-rose-gold'
                        : 'bg-champagne'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Step 1: Cart */}
            {currentStep === 'cart' && (
              <div className="space-y-4">
                <h2 className="font-playfair text-xl text-dark-plum">
                  Revisar carrinho
                </h2>
                <div className="space-y-4">
                  {items.map((item) => (
                    <Card key={item.id} className="p-4">
                      <div className="flex gap-4">
                        <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-lg bg-champagne">
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
                            <h3 className="font-lato text-sm font-medium text-dark-plum">
                              {item.name}
                            </h3>
                            {item.material && (
                              <p className="text-xs text-muted-mauve">
                                {item.material}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() =>
                                  updateQuantity(item.productId, item.quantity - 1)
                                }
                                className="flex h-7 w-7 items-center justify-center rounded-full bg-champagne text-dark-plum hover:bg-rose-gold hover:text-white"
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
                                className="flex h-7 w-7 items-center justify-center rounded-full bg-champagne text-dark-plum hover:bg-rose-gold hover:text-white"
                              >
                                <Plus className="h-3 w-3" />
                              </button>
                            </div>
                            <p className="font-lato text-sm font-semibold text-rose-gold">
                              R${' '}
                              {(item.price * item.quantity)
                                .toFixed(2)
                                .replace('.', ',')}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => removeItem(item.productId)}
                          className="self-start text-muted-mauve hover:text-red-500"
                        >
                          ×
                        </button>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Info */}
            {currentStep === 'info' && (
              <div className="space-y-6">
                <h2 className="font-playfair text-xl text-dark-plum">
                  Dados pessoais
                </h2>
                <Card className="p-6">
                  <div className="space-y-4">
                    <Input
                      label="E-mail"
                      name="email"
                      type="email"
                      placeholder="seu@email.com"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                    <Input
                      label="Nome completo"
                      name="name"
                      placeholder="Seu nome"
                      value={formData.name}
                      onChange={handleInputChange}
                    />
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Input
                        label="Telefone"
                        name="phone"
                        placeholder="(11) 99999-9999"
                        value={formData.phone}
                        onChange={handleInputChange}
                      />
                      <Input
                        label="CPF"
                        name="cpf"
                        placeholder="000.000.000-00"
                        value={formData.cpf}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {/* Step 3: Shipping */}
            {currentStep === 'shipping' && (
              <div className="space-y-6">
                <h2 className="font-playfair text-xl text-dark-plum">
                  Endereço de entrega
                </h2>
                <Card className="p-6">
                  <div className="space-y-4">
                    <Input
                      label="CEP"
                      name="zipCode"
                      placeholder="00000-000"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                    />
                    <Input
                      label="Rua"
                      name="street"
                      placeholder="Rua exemplo"
                      value={formData.street}
                      onChange={handleInputChange}
                    />
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Input
                        label="Número"
                        name="number"
                        placeholder="123"
                        value={formData.number}
                        onChange={handleInputChange}
                      />
                      <Input
                        label="Complemento"
                        name="complement"
                        placeholder="Apto, sala, etc"
                        value={formData.complement}
                        onChange={handleInputChange}
                      />
                    </div>
                    <Input
                      label="Bairro"
                      name="district"
                      placeholder="Bairro"
                      value={formData.district}
                      onChange={handleInputChange}
                    />
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Input
                        label="Cidade"
                        name="city"
                        placeholder="Cidade"
                        value={formData.city}
                        onChange={handleInputChange}
                      />
                      <Input
                        label="Estado"
                        name="state"
                        placeholder="UF"
                        value={formData.state}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {/* Step 4: Payment */}
            {currentStep === 'payment' && (
              <div className="space-y-6">
                <h2 className="font-playfair text-xl text-dark-plum">
                  Forma de pagamento
                </h2>
                <Card className="p-6">
                  <div className="space-y-4">
                    <label className="flex cursor-pointer items-center gap-4 rounded-lg border border-champagne p-4 hover:border-rose-gold">
                      <input
                        type="radio"
                        name="payment"
                        value="pix"
                        className="h-5 w-5 text-rose-gold"
                        defaultChecked
                      />
                      <div className="flex-1">
                        <p className="font-medium text-dark-plum">PIX</p>
                        <p className="text-sm text-muted-mauve">
                          Aprovação imediata
                        </p>
                      </div>
                      <Badge variant="gold">5% OFF</Badge>
                    </label>
                    <label className="flex cursor-pointer items-center gap-4 rounded-lg border border-champagne p-4 hover:border-rose-gold">
                      <input
                        type="radio"
                        name="payment"
                        value="credit"
                        className="h-5 w-5 text-rose-gold"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-dark-plum">
                          Cartão de crédito
                        </p>
                        <p className="text-sm text-muted-mauve">
                          Até 3x sem juros
                        </p>
                      </div>
                    </label>
                    <label className="flex cursor-pointer items-center gap-4 rounded-lg border border-champagne p-4 hover:border-rose-gold">
                      <input
                        type="radio"
                        name="payment"
                        value="boleto"
                        className="h-5 w-5 text-rose-gold"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-dark-plum">Boleto</p>
                        <p className="text-sm text-muted-mauve">
                          Vencimento em 3 dias
                        </p>
                      </div>
                    </label>
                  </div>
                </Card>
              </div>
            )}

            {/* Navigation */}
            <div className="mt-8 flex gap-4">
              {currentStep !== 'cart' && (
                <Button variant="outline" onClick={prevStep}>
                  Voltar
                </Button>
              )}
              <Button className="flex-1" onClick={nextStep}>
                {currentStep === 'payment' ? 'Finalizar pedido' : 'Continuar'}
              </Button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:sticky lg:top-24 lg:h-fit">
            <Card className="p-6">
              <h3 className="mb-4 font-playfair text-lg text-dark-plum">
                Resumo do pedido
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-mauve">
                    Produtos ({items.reduce((a, i) => a + i.quantity, 0)})
                  </span>
                  <span className="font-medium text-dark-plum">
                    R$ {total.toFixed(2).replace('.', ',')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-mauve">Frete</span>
                  <span className="font-medium text-dark-plum">
                    {shipping === 0 ? (
                      'Grátis'
                    ) : (
                      `R$ ${shipping.toFixed(2).replace('.', ',')}`
                    )}
                  </span>
                </div>
                {shipping > 0 && (
                  <p className="text-xs text-muted-mauve">
                    Frete grátis acima de R$199
                  </p>
                )}
                <div className="border-t border-champagne pt-3">
                  <div className="flex justify-between">
                    <span className="font-semibold text-dark-plum">Total</span>
                    <span className="font-lato text-xl font-semibold text-rose-gold">
                      R$ {finalTotal.toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2 text-xs text-muted-mauve">
                <Lock className="h-4 w-4" />
                <span>Compra segura com criptografia SSL</span>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
