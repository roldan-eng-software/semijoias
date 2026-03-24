import { NextResponse } from 'next/server'
import { MercadoPagoConfig, Preference } from 'mercadopago'

const client = new MercadoPagoConfig({
  accessToken: process.env.MercadoPago_ACCESS_TOKEN!,
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { items, customer, shippingAddress } = body

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'Itens do carrinho são obrigatórios' },
        { status: 400 }
      )
    }

    const preferenceItems = items.map((item: any) => ({
      id: item.productId,
      title: item.name,
      quantity: item.quantity,
      unit_price: Number(item.price),
      currency_id: 'BRL',
      description: item.material || '',
      category_id: 'beauty',
    }))

    const shippingCost = items.reduce((acc: number, item: any) => acc + item.price * item.quantity, 0) >= 199 ? 0 : 15.9

    const preferenceData = {
      items: preferenceItems,
      payer: {
        name: customer?.name || '',
        email: customer?.email || '',
      },
      shipment: {
        cost: shippingCost,
        mode: 'not_specified',
      },
      back_urls: {
        success: `${process.env.NEXTAUTH_URL}/checkout/success`,
        failure: `${process.env.NEXTAUTH_URL}/checkout/failure`,
        pending: `${process.env.NEXTAUTH_URL}/checkout/pending`,
      },
      auto_return: 'approved',
      payment_methods: {
        excluded_payment_methods: [],
        excluded_payment_types: [],
        installments: 3,
      },
      external_reference: `order_${Date.now()}`,
      notification_url: `${process.env.NEXTAUTH_URL}/api/payment/webhook`,
    }

    const preference = new Preference(client)
    const result = await preference.create({ body: preferenceData })

    return NextResponse.json({
      preferenceId: result.id,
      initPoint: result.init_point,
    })
  } catch (error) {
    console.error('Mercado Pago error:', error)
    return NextResponse.json(
      { error: 'Erro ao criar pagamento' },
      { status: 500 }
    )
  }
}
