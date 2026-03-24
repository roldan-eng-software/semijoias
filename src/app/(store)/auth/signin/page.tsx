'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { signIn } from 'next-auth/react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
import { ArrowLeft, Loader2, Lock, Mail } from 'lucide-react'

export default function SignInPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError('E-mail ou senha incorretos')
      } else {
        router.push('/')
        router.refresh()
      }
    } catch {
      setError('Erro ao fazer login')
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
              Entrar na conta
            </h1>
            <p className="mt-2 text-sm text-muted-mauve">
              Acesse com seu e-mail e senha
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-mauve" />
              <Input
                type="email"
                placeholder="Seu e-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                required
              />
            </div>

            <Input
              type="password"
              placeholder="Sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-muted-mauve">
                <input type="checkbox" className="rounded border-champagne" />
                Lembrar-me
              </label>
              <Link
                href="/auth/forgot-password"
                className="text-rose-gold hover:underline"
              >
                Esqueci a senha
              </Link>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Entrando...
                </>
              ) : (
                'Entrar'
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-mauve">
            Não tem conta?{' '}
            <Link href="/auth/signup" className="text-rose-gold hover:underline">
              Criar conta
            </Link>
          </div>
        </Card>
      </div>
    </div>
  )
}
