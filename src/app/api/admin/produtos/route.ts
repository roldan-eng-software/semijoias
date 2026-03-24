import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  const session = await auth()

  const userRole = (session?.user as { role?: string })?.role
  if (!session || userRole !== 'ADMIN') {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const {
      name,
      slug,
      description,
      price,
      compareAtPrice,
      categoryId,
      material,
      stone,
      gender,
      stock,
      sku,
      isActive,
      isFeatured,
      isNew,
    } = body

    if (!name || !price || !categoryId) {
      return NextResponse.json(
        { error: 'Nome, preço e categoria são obrigatórios' },
        { status: 400 }
      )
    }

    const product = await prisma.product.create({
      data: {
        name,
        slug: slug || name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        description,
        price,
        compareAtPrice,
        categoryId,
        material,
        stone,
        gender: gender || 'FEMININO',
        stock: stock || 0,
        sku,
        isActive: isActive ?? true,
        isFeatured: isFeatured ?? false,
        isNew: isNew ?? false,
        images: [],
      },
    })

    return NextResponse.json(product)
  } catch (error) {
    console.error('Erro ao criar produto:', error)
    return NextResponse.json(
      { error: 'Erro ao criar produto' },
      { status: 500 }
    )
  }
}
