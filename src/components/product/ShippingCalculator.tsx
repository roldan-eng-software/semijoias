'use client'

import { useState } from 'react'
import { Truck, Loader2, MapPin, Package } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'

interface ShippingOption {
  serviceCode: string
  serviceName: string
  price: number
  deliveryDays: number
  freeShipping: boolean
}

interface ShippingResult {
  address: {
    city: string
    state: string
  }
  shippingOptions: ShippingOption[]
  freeShipping: boolean
}

interface ShippingCalculatorProps {
  productPrice: number
}

export function ShippingCalculator({ productPrice }: ShippingCalculatorProps) {
  const [cep, setCep] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<ShippingResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const formatCep = (value: string): string => {
    const digits = value.replace(/\D/g, '').slice(0, 8)
    if (digits.length > 5) {
      return `${digits.slice(0, 5)}-${digits.slice(5)}`
    }
    return digits
  }

  const handleCalculate = async () => {
    const cleanCep = cep.replace(/\D/g, '')
    if (cleanCep.length !== 8) {
      setError('CEP deve ter 8 dígitos')
      return
    }

    setIsLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch('/api/shipping', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cep: cleanCep, subtotal: productPrice }),
      })

      const data = await response.json()

      if (!response.ok || data.error) {
        setError(data.error || 'CEP não encontrado')
        return
      }

      setResult(data)
    } catch {
      setError('Erro de conexão. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleCalculate()
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm font-medium text-dark-plum">
        <Truck className="h-4 w-4 text-rose-gold" />
        Calcular frete
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          placeholder="00000-000"
          value={cep}
          onChange={(e) => {
            setCep(formatCep(e.target.value))
            setError(null)
          }}
          onKeyDown={handleKeyDown}
          className="flex h-10 flex-1 rounded-lg border border-champagne bg-white px-3 text-sm text-dark-plum placeholder:text-muted-mauve focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-gold"
          maxLength={9}
        />
        <Button
          onClick={handleCalculate}
          disabled={isLoading || cep.replace(/\D/g, '').length < 8}
          className="shrink-0 px-4"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            'Calcular'
          )}
        </Button>
      </div>

      {error && (
        <p className="text-xs text-error">{error}</p>
      )}

      {result && (
        <div className="space-y-2 rounded-lg bg-champagne/50 p-3">
          <div className="flex items-center gap-2">
            <MapPin className="h-3.5 w-3.5 text-rose-gold" />
            <span className="text-xs font-medium text-dark-plum">
              {result.address.city}/{result.address.state}
            </span>
          </div>

          <div className="space-y-2">
            {result.shippingOptions.map((option) => (
              <div
                key={option.serviceCode}
                className="flex items-center justify-between rounded-md bg-white p-2.5"
              >
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-muted-mauve" />
                  <div>
                    <p className="text-xs font-medium text-dark-plum">
                      {option.serviceName}
                    </p>
                    <p className="text-[10px] text-muted-mauve">
                      até {option.deliveryDays} dias úteis
                    </p>
                  </div>
                </div>
                {option.freeShipping || option.price === 0 ? (
                  <Badge variant="gold">Grátis</Badge>
                ) : (
                  <span className="text-sm font-semibold text-dark-plum">
                    R$ {option.price.toFixed(2).replace('.', ',')}
                  </span>
                )}
              </div>
            ))}
          </div>

          {!result.freeShipping && productPrice < 199 && (
            <p className="text-[10px] text-muted-mauve">
              Frete grátis acima de R$ 199,00
            </p>
          )}
        </div>
      )}

      <a
        href="https://buscacepinter.correios.com.br/app/endereco/index.php"
        target="_blank"
        rel="noopener noreferrer"
        className="text-[10px] text-muted-mauve underline hover:text-rose-gold"
      >
        Não sei meu CEP
      </a>
    </div>
  )
}
