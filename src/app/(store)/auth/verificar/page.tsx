'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Loader2, CheckCircle, XCircle, Mail } from 'lucide-react'

function VerificarContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (token) {
      verifyEmail()
    }
  }, [token])

  const verifyEmail = async () => {
    try {
      const res = await fetch('/api/auth/verificar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      })

      const data = await res.json()

      if (res.ok) {
        setStatus('success')
        setMessage('E-mail verificado com sucesso! Agora você pode fazer login.')
      } else {
        setStatus('error')
        setMessage(data.error || 'Erro ao verificar e-mail')
      }
    } catch {
      setStatus('error')
      setMessage('Erro ao verificar e-mail')
    }
  }

  if (status === 'loading') {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-rose-gold" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-ivory py-12">
      <div className="mx-auto max-w-md px-4">
        <Card className="p-8">
          <div className="text-center">
            {status === 'success' ? (
              <>
                <CheckCircle className="mx-auto mb-4 h-16 w-16 text-green-500" />
                <h1 className="mb-2 font-playfair text-2xl text-dark-plum">
                  E-mail verificado!
                </h1>
              </>
            ) : (
              <>
                <XCircle className="mx-auto mb-4 h-16 w-16 text-red-500" />
                <h1 className="mb-2 font-playfair text-2xl text-dark-plum">
                  Erro na verificação
                </h1>
              </>
            )}
            
            <p className="mb-6 text-muted-mauve">{message}</p>

            <Link href="/auth/signin">
              <Button>
                Fazer login
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default function VerificarPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-ivory flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-rose-gold" />
      </div>
    }>
      <VerificarContent />
    </Suspense>
  )
}
