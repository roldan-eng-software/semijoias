import { NextResponse } from 'next/server'
import { fetchAddressByCep } from '@/services/viacep'
import { calculateShipping, isFreeShipping } from '@/services/correios'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { cep, subtotal, totalWeight } = body

    if (!cep) {
      return NextResponse.json(
        { error: 'CEP é obrigatório' },
        { status: 400 }
      )
    }

    const cleanCep = cep.replace(/\D/g, '')
    if (cleanCep.length !== 8) {
      return NextResponse.json(
        { error: 'CEP inválido' },
        { status: 400 }
      )
    }

    // Busca endereço via ViaCEP
    const address = await fetchAddressByCep(cleanCep)

    if (!address) {
      return NextResponse.json(
        { error: 'CEP não encontrado' },
        { status: 404 }
      )
    }

    // Verifica frete grátis
    const freeShipping = isFreeShipping(subtotal || 0)

    // Calcula opções de frete
    const shippingOptions = await calculateShipping(
      cleanCep,
      totalWeight,
      subtotal
    )

    // Se frete grátis, zera o preço da opção mais barata
    const options = freeShipping
      ? shippingOptions.map((opt, index) => ({
          ...opt,
          price: index === 0 ? 0 : opt.price,
          freeShipping: index === 0,
        }))
      : shippingOptions.map((opt) => ({ ...opt, freeShipping: false }))

    return NextResponse.json({
      address,
      shippingOptions: options,
      freeShipping,
    })
  } catch (error) {
    console.error('[API Shipping] Erro:', error)
    return NextResponse.json(
      { error: 'Erro ao calcular frete' },
      { status: 500 }
    )
  }
}
