'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { ArrowLeft, Loader2, Mail } from 'lucide-react'

export default function ReenviarVerificacaoPage() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage('')

    try {
      const res = await fetch('/api/auth/reenviar-verificacao', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await res.json()

      if (res.ok) {
        setMessage('E-mail de verificação reenviado!')
      } else {
        setMessage(data.error || 'Erro ao reenviar e-mail')
      }
    } catch {
      setMessage('Erro ao reenviar e-mail')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-ivory py-12">
      <div className="mx-auto max-w-md px-4">
        <Link
          href="/auth/signin"
          className="mb-6 inline-flex items-center gap-2 text-sm text-muted-mauve hover:text-rose-gold"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para login
        </Link>

        <Card className="p-8">
          <div className="mb-6 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-champagne">
              <Mail className="h-6 w-6 text-rose-gold" />
            </div>
            <h1 className="font-playfair text-2xl text-dark-plum">
              Reenviar verificação
            </h1>
            <p className="mt-2 text-sm text-muted-mauve">
              Informe seu e-mail para receber o link de verificação
            </p>
          </div>

          {message && (
            <div
              className={`mb-4 rounded-lg p-3 text-sm ${
                message.includes('reenviado')
                  ? 'bg-green-50 text-green-600'
                  : 'bg-red-50 text-red-600'
              }`}
            >
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Seu e-mail"
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                'Reenviar e-mail'
              )}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  )
}
