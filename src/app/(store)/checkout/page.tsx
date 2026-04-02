'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useCartStore } from '@/store/cartStore'
import { useShipping } from '@/hooks/useShipping'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { PaymentButton } from '@/components/checkout/PaymentButton'
import {
  ShoppingBag,
  Truck,
  CreditCard,
  Check,
  Minus,
  Plus,
  ArrowLeft,
  Lock,
  Loader2,
  MapPin,
  Package,
} from 'lucide-react'

type Step = 'cart' | 'info' | 'shipping' | 'payment'

const steps = [
  { id: 'cart', label: 'Carrinho', icon: ShoppingBag },
  { id: 'info', label: 'Dados', icon: Check },
  { id: 'shipping', label: 'Entrega', icon: Truck },
  { id: 'payment', label: 'Pagamento', icon: CreditCard },
]

interface FormErrors {
  [key: string]: string
}

function formatCep(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 8)
  if (digits.length > 5) {
    return `${digits.slice(0, 5)}-${digits.slice(5)}`
  }
  return digits
}

function formatCpf(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11)
  if (digits.length > 9) {
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`
  }
  if (digits.length > 6) {
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`
  }
  if (digits.length > 3) {
    return `${digits.slice(0, 3)}.${digits.slice(3)}`
  }
  return digits
}

function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11)
  if (digits.length > 6) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
  }
  if (digits.length > 2) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
  }
  return digits
}

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function validateCpf(cpf: string): boolean {
  const digits = cpf.replace(/\D/g, '')
  return digits.length === 11
}

export default function CheckoutPage() {
  const [currentStep, setCurrentStep] = useState<Step>('cart')
  const { items, updateQuantity, removeItem, getTotalPrice } = useCartStore()
  const shipping = useShipping()
  const total = getTotalPrice()
  const shippingCost = shipping.selectedOption?.price ?? 0
  const finalTotal = total + shippingCost

  const [formErrors, setFormErrors] = useState<FormErrors>({})

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
    let formattedValue = value

    // Auto-format
    if (name === 'zipCode') formattedValue = formatCep(value)
    if (name === 'cpf') formattedValue = formatCpf(value)
    if (name === 'phone') formattedValue = formatPhone(value)

    setFormData((prev) => ({ ...prev, [name]: formattedValue }))

    // Limpa erro do campo editado
    if (formErrors[name]) {
      setFormErrors((prev) => {
        const next = { ...prev }
        delete next[name]
        return next
      })
    }
  }

  // Busca CEP automático
  const handleCepBlur = async () => {
    const cleanCep = formData.zipCode.replace(/\D/g, '')
    if (cleanCep.length === 8) {
      const result = await shipping.calculateShipping(cleanCep, total)
      if (result?.address) {
        setFormData((prev) => ({
          ...prev,
          street: result.address.street || prev.street,
          district: result.address.district || prev.district,
          city: result.address.city || prev.city,
          state: result.address.state || prev.state,
          complement: result.address.complement || prev.complement,
        }))
      }
    }
  }

  // Validação por step
  const validateStep = (step: Step): boolean => {
    const errors: FormErrors = {}

    if (step === 'info') {
      if (!formData.email) errors.email = 'E-mail obrigatório'
      else if (!validateEmail(formData.email)) errors.email = 'E-mail inválido'
      if (!formData.name || formData.name.trim().length < 3) errors.name = 'Nome completo obrigatório'
      if (!formData.phone || formData.phone.replace(/\D/g, '').length < 10) errors.phone = 'Telefone inválido'
      if (!formData.cpf || !validateCpf(formData.cpf)) errors.cpf = 'CPF inválido'
    }

    if (step === 'shipping') {
      if (!formData.zipCode || formData.zipCode.replace(/\D/g, '').length !== 8) errors.zipCode = 'CEP obrigatório'
      if (!formData.street) errors.street = 'Rua obrigatória'
      if (!formData.number) errors.number = 'Número obrigatório'
      if (!formData.district) errors.district = 'Bairro obrigatório'
      if (!formData.city) errors.city = 'Cidade obrigatória'
      if (!formData.state) errors.state = 'Estado obrigatório'
      if (!shipping.selectedOption) errors.shipping = 'Selecione uma opção de frete'
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const nextStep = () => {
    if (!validateStep(currentStep)) return

    const stepOrder: Step[] = ['cart', 'info', 'shipping', 'payment']
    const currentIndex = stepOrder.indexOf(currentStep)
    if (currentIndex < stepOrder.length - 1) {
      setCurrentStep(stepOrder[currentIndex + 1])
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const prevStep = () => {
    const stepOrder: Step[] = ['cart', 'info', 'shipping', 'payment']
    const currentIndex = stepOrder.indexOf(currentStep)
    if (currentIndex > 0) {
      setCurrentStep(stepOrder[currentIndex - 1])
      window.scrollTo({ top: 0, behavior: 'smooth' })
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
    <div className="min-h-screen bg-ivory py-6 md:py-8">
      <div className="mx-auto max-w-6xl px-4 lg:px-8">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <Link
            href="/produtos"
            className="mb-3 md:mb-4 inline-flex items-center gap-2 text-sm text-muted-mauve hover:text-rose-gold transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Continuar comprando
          </Link>
          <h1 className="font-playfair text-2xl md:text-3xl text-dark-plum">Finalizar compra</h1>
        </div>

        {/* Progress Steps */}
        <div className="mb-8 md:mb-12">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={`flex h-9 w-9 md:h-10 md:w-10 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                    index <= currentStepIndex
                      ? 'border-rose-gold bg-rose-gold text-white shadow-md shadow-rose-gold/20'
                      : 'border-champagne bg-white text-muted-mauve'
                  }`}
                >
                  {index < currentStepIndex ? (
                    <Check className="h-4 w-4 md:h-5 md:w-5" />
                  ) : (
                    <step.icon className="h-4 w-4 md:h-5 md:w-5" />
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
                    className={`mx-2 md:mx-4 h-0.5 w-6 sm:w-12 md:w-16 transition-colors duration-300 ${
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

        <div className="grid gap-6 md:gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Step 1: Cart */}
            {currentStep === 'cart' && (
              <div className="space-y-4">
                <h2 className="font-playfair text-xl text-dark-plum">
                  Revisar carrinho
                </h2>
                <div className="space-y-3 md:space-y-4">
                  {items.map((item) => (
                    <Card key={item.id} className="p-3 md:p-4">
                      <div className="flex gap-3 md:gap-4">
                        <div className="relative h-20 w-16 md:h-24 md:w-20 shrink-0 overflow-hidden rounded-lg bg-champagne">
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
                                className="flex h-7 w-7 items-center justify-center rounded-full bg-champagne text-dark-plum hover:bg-rose-gold hover:text-white transition-colors"
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
                                className="flex h-7 w-7 items-center justify-center rounded-full bg-champagne text-dark-plum hover:bg-rose-gold hover:text-white transition-colors"
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
                          className="self-start p-1 text-muted-mauve hover:text-red-500 transition-colors"
                          aria-label={`Remover ${item.name}`}
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
                <Card className="p-4 md:p-6">
                  <div className="space-y-4">
                    <div>
                      <Input
                        label="E-mail"
                        name="email"
                        type="email"
                        placeholder="seu@email.com"
                        value={formData.email}
                        onChange={handleInputChange}
                      />
                      {formErrors.email && (
                        <p className="mt-1 text-xs text-error">{formErrors.email}</p>
                      )}
                    </div>
                    <div>
                      <Input
                        label="Nome completo"
                        name="name"
                        placeholder="Seu nome completo"
                        value={formData.name}
                        onChange={handleInputChange}
                      />
                      {formErrors.name && (
                        <p className="mt-1 text-xs text-error">{formErrors.name}</p>
                      )}
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <Input
                          label="Telefone"
                          name="phone"
                          placeholder="(11) 99999-9999"
                          value={formData.phone}
                          onChange={handleInputChange}
                        />
                        {formErrors.phone && (
                          <p className="mt-1 text-xs text-error">{formErrors.phone}</p>
                        )}
                      </div>
                      <div>
                        <Input
                          label="CPF"
                          name="cpf"
                          placeholder="000.000.000-00"
                          value={formData.cpf}
                          onChange={handleInputChange}
                        />
                        {formErrors.cpf && (
                          <p className="mt-1 text-xs text-error">{formErrors.cpf}</p>
                        )}
                      </div>
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
                <Card className="p-4 md:p-6">
                  <div className="space-y-4">
                    {/* CEP com busca automática */}
                    <div>
                      <div className="relative">
                        <Input
                          label="CEP"
                          name="zipCode"
                          placeholder="00000-000"
                          value={formData.zipCode}
                          onChange={handleInputChange}
                          onBlur={handleCepBlur}
                        />
                        {shipping.isLoading && (
                          <div className="absolute right-3 top-9">
                            <Loader2 className="h-4 w-4 animate-spin text-rose-gold" />
                          </div>
                        )}
                      </div>
                      {formErrors.zipCode && (
                        <p className="mt-1 text-xs text-error">{formErrors.zipCode}</p>
                      )}
                      {shipping.error && (
                        <p className="mt-1 text-xs text-error">{shipping.error}</p>
                      )}
                      {shipping.address && (
                        <div className="mt-2 flex items-center gap-2 rounded-lg bg-green-50 p-2">
                          <MapPin className="h-4 w-4 text-green-600 shrink-0" />
                          <span className="text-xs text-green-700">
                            {shipping.address.city} — {shipping.address.state}
                          </span>
                        </div>
                      )}
                    </div>

                    <div>
                      <Input
                        label="Rua"
                        name="street"
                        placeholder="Rua exemplo"
                        value={formData.street}
                        onChange={handleInputChange}
                      />
                      {formErrors.street && (
                        <p className="mt-1 text-xs text-error">{formErrors.street}</p>
                      )}
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <Input
                          label="Número"
                          name="number"
                          placeholder="123"
                          value={formData.number}
                          onChange={handleInputChange}
                        />
                        {formErrors.number && (
                          <p className="mt-1 text-xs text-error">{formErrors.number}</p>
                        )}
                      </div>
                      <Input
                        label="Complemento"
                        name="complement"
                        placeholder="Apto, sala, etc"
                        value={formData.complement}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div>
                      <Input
                        label="Bairro"
                        name="district"
                        placeholder="Bairro"
                        value={formData.district}
                        onChange={handleInputChange}
                      />
                      {formErrors.district && (
                        <p className="mt-1 text-xs text-error">{formErrors.district}</p>
                      )}
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <Input
                          label="Cidade"
                          name="city"
                          placeholder="Cidade"
                          value={formData.city}
                          onChange={handleInputChange}
                        />
                        {formErrors.city && (
                          <p className="mt-1 text-xs text-error">{formErrors.city}</p>
                        )}
                      </div>
                      <div>
                        <Input
                          label="Estado"
                          name="state"
                          placeholder="UF"
                          value={formData.state}
                          onChange={handleInputChange}
                        />
                        {formErrors.state && (
                          <p className="mt-1 text-xs text-error">{formErrors.state}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Opções de Frete */}
                {shipping.shippingOptions.length > 0 && (
                  <Card className="p-4 md:p-6">
                    <h3 className="mb-4 flex items-center gap-2 font-lato text-sm font-semibold text-dark-plum">
                      <Package className="h-4 w-4 text-rose-gold" />
                      Opções de envio
                    </h3>
                    <div className="space-y-3">
                      {shipping.shippingOptions.map((option) => (
                        <label
                          key={option.serviceCode}
                          className={`flex cursor-pointer items-center gap-3 md:gap-4 rounded-lg border p-3 md:p-4 transition-all ${
                            shipping.selectedOption?.serviceCode === option.serviceCode
                              ? 'border-rose-gold bg-rose-gold/5 shadow-sm'
                              : 'border-champagne hover:border-rose-gold-light'
                          }`}
                        >
                          <input
                            type="radio"
                            name="shippingOption"
                            value={option.serviceCode}
                            checked={shipping.selectedOption?.serviceCode === option.serviceCode}
                            onChange={() => shipping.setSelectedOption(option)}
                            className="h-4 w-4 accent-rose-gold"
                          />
                          <Truck className="h-4 w-4 md:h-5 md:w-5 text-muted-mauve shrink-0" />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-dark-plum">
                              {option.serviceName}
                            </p>
                            <p className="text-xs text-muted-mauve">
                              Entrega em até {option.deliveryDays} dias úteis
                            </p>
                          </div>
                          <div className="text-right">
                            {option.freeShipping || option.price === 0 ? (
                              <Badge variant="gold">Grátis</Badge>
                            ) : (
                              <span className="font-lato text-sm font-semibold text-dark-plum">
                                R$ {option.price.toFixed(2).replace('.', ',')}
                              </span>
                            )}
                          </div>
                        </label>
                      ))}
                    </div>
                    {formErrors.shipping && (
                      <p className="mt-2 text-xs text-error">{formErrors.shipping}</p>
                    )}
                  </Card>
                )}
              </div>
            )}

            {/* Step 4: Payment */}
            {currentStep === 'payment' && (
              <div className="space-y-6">
                <h2 className="font-playfair text-xl text-dark-plum">
                  Forma de pagamento
                </h2>

                {/* Resumo de entrega */}
                <Card className="p-4 bg-champagne/30">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-rose-gold shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium text-dark-plum">Entregar em:</p>
                      <p className="text-muted-mauve">
                        {formData.street}, {formData.number}
                        {formData.complement && ` — ${formData.complement}`}
                      </p>
                      <p className="text-muted-mauve">
                        {formData.district} · {formData.city}/{formData.state} · {formData.zipCode}
                      </p>
                      {shipping.selectedOption && (
                        <p className="mt-1 font-medium text-rose-gold">
                          {shipping.selectedOption.serviceName} — {shipping.selectedOption.deliveryDays} dias úteis
                        </p>
                      )}
                    </div>
                  </div>
                </Card>

                <Card className="p-4 md:p-6">
                  <div className="space-y-3">
                    <label className="flex cursor-pointer items-center gap-4 rounded-lg border border-champagne p-3 md:p-4 hover:border-rose-gold transition-colors">
                      <input
                        type="radio"
                        name="payment"
                        value="pix"
                        className="h-5 w-5 accent-rose-gold"
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
                    <label className="flex cursor-pointer items-center gap-4 rounded-lg border border-champagne p-3 md:p-4 hover:border-rose-gold transition-colors">
                      <input
                        type="radio"
                        name="payment"
                        value="credit"
                        className="h-5 w-5 accent-rose-gold"
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
                    <label className="flex cursor-pointer items-center gap-4 rounded-lg border border-champagne p-3 md:p-4 hover:border-rose-gold transition-colors">
                      <input
                        type="radio"
                        name="payment"
                        value="boleto"
                        className="h-5 w-5 accent-rose-gold"
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
            <div className="mt-6 md:mt-8 flex gap-3 md:gap-4">
              {currentStep !== 'cart' && (
                <Button variant="outline" onClick={prevStep}>
                  Voltar
                </Button>
              )}
              {currentStep === 'payment' ? (
                <PaymentButton
                  customer={{
                    email: formData.email,
                    name: formData.name,
                    phone: formData.phone,
                  }}
                  shippingAddress={{
                    street: formData.street,
                    number: formData.number,
                    complement: formData.complement,
                    district: formData.district,
                    city: formData.city,
                    state: formData.state,
                    zipCode: formData.zipCode,
                  }}
                />
              ) : (
                <Button className="flex-1" onClick={nextStep}>
                  Continuar
                </Button>
              )}
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:sticky lg:top-24 lg:h-fit">
            <Card className="p-4 md:p-6">
              <h3 className="mb-4 font-playfair text-lg text-dark-plum">
                Resumo do pedido
              </h3>
              <div className="space-y-3 text-sm">
                {/* Items list (collapsed) */}
                <div className="max-h-48 space-y-2 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between text-xs">
                      <span className="text-muted-mauve line-clamp-1 flex-1 mr-2">
                        {item.quantity}x {item.name}
                      </span>
                      <span className="font-medium text-dark-plum whitespace-nowrap">
                        R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-champagne pt-3 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-mauve">
                      Subtotal ({items.reduce((a, i) => a + i.quantity, 0)} itens)
                    </span>
                    <span className="font-medium text-dark-plum">
                      R$ {total.toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-mauve">Frete</span>
                    <span className="font-medium text-dark-plum">
                      {shipping.selectedOption ? (
                        shipping.selectedOption.price === 0 ? (
                          <span className="text-green-600">Grátis</span>
                        ) : (
                          `R$ ${shipping.selectedOption.price.toFixed(2).replace('.', ',')}`
                        )
                      ) : (
                        <span className="text-xs text-muted-mauve">Calcular na etapa de entrega</span>
                      )}
                    </span>
                  </div>
                </div>

                {shipping.isFreeShipping && (
                  <div className="flex items-center gap-2 rounded-lg bg-green-50 p-2">
                    <Truck className="h-4 w-4 text-green-600" />
                    <span className="text-xs font-medium text-green-700">
                      Frete grátis aplicado! 🎉
                    </span>
                  </div>
                )}

                {!shipping.isFreeShipping && total > 0 && total < 199 && (
                  <div className="rounded-lg bg-champagne/50 p-2">
                    <p className="text-xs text-muted-mauve">
                      Faltam <span className="font-semibold text-rose-gold">R$ {(199 - total).toFixed(2).replace('.', ',')}</span> para frete grátis
                    </p>
                    <div className="mt-1.5 h-1.5 w-full rounded-full bg-champagne-dark">
                      <div
                        className="h-1.5 rounded-full bg-rose-gold transition-all"
                        style={{ width: `${Math.min((total / 199) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
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
