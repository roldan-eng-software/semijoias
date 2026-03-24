'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { signIn } from 'next-auth/react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
import { ArrowLeft, Loader2, Lock, Mail, User, Phone } from 'lucide-react'

export default function SignUpPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    cpf: '',
    password: '',
    confirmPassword: '',
  })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem')
      return
    }

    if (formData.password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres')
      return
    }

    setIsLoading(true)

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          cpf: formData.cpf,
          password: formData.password,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Erro ao criar conta')
      }

      await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      })

      router.push('/')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar conta')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-ivory py-12">
      <div className="mx-auto max-w-md px-4">
        <Link
          href="/produtos"
          className="mb-6 inline-flex items-center gap-2 text-sm text-muted-mauve hover:text-rose-gold"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para loja
        </Link>

        <Card className="p-8">
          <div className="mb-6 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-champagne">
              <Lock className="h-6 w-6 text-rose-gold" />
            </div>
            <h1 className="font-playfair text-2xl text-dark-plum">
              Criar conta
            </h1>
            <p className="mt-2 text-sm text-muted-mauve">
              Cadastre-se para fazer compras
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <div className="relative">
              <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-mauve" />
              <Input
                name="name"
                placeholder="Seu nome completo"
                value={formData.name}
                onChange={handleChange}
                className="pl-10"
                required
              />
            </div>

            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-mauve" />
              <Input
                type="email"
                name="email"
                placeholder="Seu e-mail"
                value={formData.email}
                onChange={handleChange}
                className="pl-10"
                required
              />
            </div>

            <div className="relative">
              <Phone className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-mauve" />
              <Input
                type="tel"
                name="phone"
                placeholder="Seu telefone"
                value={formData.phone}
                onChange={handleChange}
                className="pl-10"
              />
            </div>

            <Input
              type="text"
              name="cpf"
              placeholder="Seu CPF"
              value={formData.cpf}
              onChange={handleChange}
            />

            <Input
              type="password"
              name="password"
              placeholder="Crie uma senha"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <Input
              type="password"
              name="confirmPassword"
              placeholder="Confirme a senha"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Criando conta...
                </>
              ) : (
                'Criar conta'
              )}
            </Button>
          </form>

          <p className="mt-4 text-center text-xs text-muted-mauve">
            Ao criar conta, você concorda com nossos{' '}
            <Link href="/termos" className="text-rose-gold hover:underline">
              Termos de uso
            </Link>{' '}
            e{' '}
            <Link href="/privacidade" className="text-rose-gold hover:underline">
              Política de privacidade
            </Link>
          </p>

          <div className="mt-6 text-center text-sm text-muted-mauve">
            Já tem conta?{' '}
            <Link href="/auth/signin" className="text-rose-gold hover:underline">
              Entrar
            </Link>
          </div>
        </Card>
      </div>
    </div>
  )
}
