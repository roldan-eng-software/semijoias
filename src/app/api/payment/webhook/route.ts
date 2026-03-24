import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { MercadoPagoConfig, Payment } from 'mercadopago'

const client = new MercadoPagoConfig({
  accessToken: process.env.MercadoPago_ACCESS_TOKEN!,
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { type, data } = body

    console.log('🔔 Webhook recebido:', { type, data })

    if (type !== 'payment') {
      return NextResponse.json({ status: 'ok' })
    }

    const paymentId = data.id

    const payment = new Payment(client)
    const paymentData = await payment.get({ id: paymentId })

    const externalReference = paymentData.external_reference
    const status = paymentData.status

    console.log('📊 Payment status:', { externalReference, status })

    if (externalReference && externalReference.startsWith('order_')) {
      const orderNumber = externalReference.replace('order_', '')

      let orderStatus: string
      switch (status) {
        case 'approved':
          orderStatus = 'PAID'
          break
        case 'pending':
          orderStatus = 'PENDING'
          break
        case 'rejected':
        case 'cancelled':
          orderStatus = 'CANCELLED'
          break
        case 'refunded':
          orderStatus = 'REFUNDED'
          break
        default:
          orderStatus = 'PROCESSING'
      }

      const updated = await prisma.order.updateMany({
        where: {
          orderNumber: {
            contains: orderNumber.slice(-8),
          },
        },
        data: {
          status: orderStatus as any,
          paymentId: String(paymentId),
        },
      })

      console.log('✅ Pedido atualizado:', { count: updated.count, orderStatus })
    }

    return NextResponse.json({ status: 'ok' })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Erro ao processar webhook' },
      { status: 500 }
    )
  }
}
