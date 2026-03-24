import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import crypto from 'crypto'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email } = body

    if (!email) {
      return NextResponse.json(
        { error: 'E-mail é obrigatório' },
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'E-mail não encontrado' },
        { status: 404 }
      )
    }

    if (user.emailVerified) {
      return NextResponse.json(
        { error: 'E-mail já verificado. Faça login.' },
        { status: 400 }
      )
    }

    await prisma.verificationToken.deleteMany({
      where: { identifier: email },
    })

    const verificationToken = await prisma.verificationToken.create({
      data: {
        identifier: email,
        token: crypto.randomBytes(32).toString('hex'),
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
    })

    const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/auth/verificar?token=${verificationToken.token}`

    console.log('=== REENVIO DE VERIFICAÇÃO ===')
    console.log('E-mail:', email)
    console.log('Link de verificação:', verificationUrl)
    console.log('==============================')

    return NextResponse.json({
      success: true,
      message: 'E-mail de verificação reenviado!',
    })
  } catch (error) {
    console.error('Resend verification error:', error)
    return NextResponse.json(
      { error: 'Erro ao reenviar e-mail' },
      { status: 500 }
    )
  }
}
