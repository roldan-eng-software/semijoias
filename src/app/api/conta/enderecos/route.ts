import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  try {
    const addresses = await prisma.address.findMany({
      where: { userId: session.user.id },
      orderBy: { isDefault: 'desc' },
    })

    return NextResponse.json(addresses)
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao buscar endereços' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { label, firstName, lastName, street, number, complement, district, city, state, zipCode, isDefault } = body

    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId: session.user.id },
        data: { isDefault: false },
      })
    }

    const address = await prisma.address.create({
      data: {
        userId: session.user.id,
        label,
        firstName,
        lastName,
        street,
        number,
        complement,
        district,
        city,
        state,
        zipCode,
        isDefault: isDefault || false,
      },
    })

    return NextResponse.json(address)
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao criar endereço' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'ID não fornecido' }, { status: 400 })
    }

    const body = await request.json()
    const { label, firstName, lastName, street, number, complement, district, city, state, zipCode, isDefault } = body

    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId: session.user.id },
        data: { isDefault: false },
      })
    }

    const address = await prisma.address.update({
      where: { id, userId: session.user.id },
      data: {
        label,
        firstName,
        lastName,
        street,
        number,
        complement,
        district,
        city,
        state,
        zipCode,
        isDefault: isDefault || false,
      },
    })

    return NextResponse.json(address)
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao atualizar endereço' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'ID não fornecido' }, { status: 400 })
    }

    await prisma.address.delete({
      where: { id, userId: session.user.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao excluir endereço' },
      { status: 500 }
    )
  }
}
