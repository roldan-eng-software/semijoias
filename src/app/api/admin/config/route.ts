import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await auth()
  const userRole = (session?.user as { role?: string })?.role

  if (!session || userRole !== 'ADMIN') {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  try {
    const configs = await prisma.siteConfig.findMany()
    
    const configMap: Record<string, string> = {}
    configs.forEach((config) => {
      configMap[config.key] = config.value
    })

    return NextResponse.json({
      storeName: configMap.storeName || '',
      storeDescription: configMap.storeDescription || '',
      storeEmail: configMap.storeEmail || '',
      storePhone: configMap.storePhone || '',
      storeInstagram: configMap.storeInstagram || '',
      storeFacebook: configMap.storeFacebook || '',
      storeAddress: configMap.storeAddress || '',
      freeShippingMin: configMap.freeShippingMin || '199',
      shippingCost: configMap.shippingCost || '15',
      returnPolicy: configMap.returnPolicy || '',
      exchangePolicy: configMap.exchangePolicy || '',
    })
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar configurações' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  const session = await auth()
  const userRole = (session?.user as { role?: string })?.role

  if (!session || userRole !== 'ADMIN') {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  try {
    const body = await request.json()

    const configKeys = [
      'storeName',
      'storeDescription',
      'storeEmail',
      'storePhone',
      'storeInstagram',
      'storeFacebook',
      'storeAddress',
      'freeShippingMin',
      'shippingCost',
      'returnPolicy',
      'exchangePolicy',
    ]

    for (const key of configKeys) {
      if (body[key] !== undefined) {
        await prisma.siteConfig.upsert({
          where: { key },
          update: { value: body[key] },
          create: { key, value: body[key] },
        })
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro ao salvar configurações:', error)
    return NextResponse.json({ error: 'Erro ao salvar configurações' }, { status: 500 })
  }
}
