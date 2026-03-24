import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { sendVerificationEmail } from '@/lib/email'
import crypto from 'crypto'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, phone, cpf, password } = body

    if (!email || !password) {
      return NextResponse.json(
        { error: 'E-mail e senha são obrigatórios' },
        { status: 400 }
      )
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'E-mail já está em uso' },
        { status: 400 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    const user = await prisma.user.create({
      data: {
        name,
        email,
        phone,
        cpf,
        password: hashedPassword,
        emailVerified: null,
      },
    })

    const verificationToken = await prisma.verificationToken.create({
      data: {
        identifier: email,
        token: crypto.randomBytes(32).toString('hex'),
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
    })

    await sendVerificationEmail(email, name || '', verificationToken.token)

    return NextResponse.json({
      needsVerification: true,
      message: 'Conta criada! Verifique seu e-mail para ativar a conta.',
    })
  } catch (error) {
    console.error('Register error:', error)
    return NextResponse.json(
      { error: 'Erro ao criar conta' },
      { status: 500 }
    )
  }
}
