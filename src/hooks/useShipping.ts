'use client'

import { useState, useCallback } from 'react'

interface AddressFromCep {
  street: string
  complement: string
  district: string
  city: string
  state: string
  ibge: string
}

interface ShippingOption {
  serviceCode: string
  serviceName: string
  price: number
  deliveryDays: number
  freeShipping: boolean
}

interface ShippingResult {
  address: AddressFromCep
  shippingOptions: ShippingOption[]
  freeShipping: boolean
}

export function useShipping() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [address, setAddress] = useState<AddressFromCep | null>(null)
  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([])
  const [selectedOption, setSelectedOption] = useState<ShippingOption | null>(null)
  const [isFreeShipping, setIsFreeShipping] = useState(false)

  const calculateShipping = useCallback(
    async (cep: string, subtotal: number, totalWeight?: number) => {
      const cleanCep = cep.replace(/\D/g, '')
      if (cleanCep.length !== 8) {
        setError('CEP deve ter 8 dígitos')
        return null
      }

      setIsLoading(true)
      setError(null)

      try {
        const response = await fetch('/api/shipping', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ cep: cleanCep, subtotal, totalWeight }),
        })

        const data: ShippingResult | { error: string } = await response.json()

        if (!response.ok || 'error' in data) {
          const errorMsg = 'error' in data ? data.error : 'Erro ao calcular frete'
          setError(errorMsg)
          return null
        }

        setAddress(data.address)
        setShippingOptions(data.shippingOptions)
        setIsFreeShipping(data.freeShipping)

        // Auto-seleciona a opção mais barata
        if (data.shippingOptions.length > 0) {
          setSelectedOption(data.shippingOptions[0])
        }

        return data
      } catch {
        setError('Erro de conexão. Tente novamente.')
        return null
      } finally {
        setIsLoading(false)
      }
    },
    []
  )

  const reset = useCallback(() => {
    setAddress(null)
    setShippingOptions([])
    setSelectedOption(null)
    setError(null)
    setIsFreeShipping(false)
  }, [])

  return {
    isLoading,
    error,
    address,
    shippingOptions,
    selectedOption,
    isFreeShipping,
    setSelectedOption,
    calculateShipping,
    reset,
  }
}
