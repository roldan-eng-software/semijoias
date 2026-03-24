'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { User, Package, Heart, MapPin, Lock, Loader2, Save, Eye, EyeOff } from 'lucide-react'

export default function ContaSenhaPage() {
  const { data: session } = useSession()
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [showPasswords, setShowPasswords] = useState(false)

  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  if (!session) {
    return (
      <div className="min-h-screen bg-ivory py-12">
        <div className="mx-auto max-w-md px-4 text-center">
          <h1 className="mb-4 font-playfair text-2xl text-dark-plum">Acesso restrito</h1>
          <p className="mb-6 text-muted-mauve">Faça login para acessar sua conta</p>
          <Link href="/auth/signin">
            <Button>Fazer login</Button>
          </Link>
        </div>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage('')

    if (formData.newPassword !== formData.confirmPassword) {
      setMessage('As senhas não conferem')
      setIsLoading(false)
      return
    }

    if (formData.newPassword.length < 6) {
      setMessage('A senha deve ter pelo menos 6 caracteres')
      setIsLoading(false)
      return
    }

    try {
      const res = await fetch('/api/conta/senha', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        }),
      })

      const data = await res.json()

      if (res.ok) {
        setMessage('Senha alterada com sucesso!')
        setFormData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        })
      } else {
        setMessage(data.error || 'Erro ao alterar senha')
      }
    } catch {
      setMessage('Erro ao alterar senha')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-ivory py-12">
      <div className="mx-auto max-w-6xl px-4">
        <h1 className="mb-8 font-playfair text-3xl text-dark-plum">Minha Conta</h1>

        <div className="grid gap-6 lg:grid-cols-4">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="p-4">
              <nav className="space-y-2">
                <Link
                  href="/conta"
                  className="flex items-center gap-3 rounded-lg px-4 py-3 text-dark-plum hover:bg-champagne"
                >
                  <User className="h-5 w-5" />
                  Meus Dados
                </Link>
                <Link
                  href="/conta/pedidos"
                  className="flex items-center gap-3 rounded-lg px-4 py-3 text-dark-plum hover:bg-champagne"
                >
                  <Package className="h-5 w-5" />
                  Meus Pedidos
                </Link>
                <Link
                  href="/conta/enderecos"
                  className="flex items-center gap-3 rounded-lg px-4 py-3 text-dark-plum hover:bg-champagne"
                >
                  <MapPin className="h-5 w-5" />
                  Endereços
                </Link>
                <Link
                  href="/conta/senha"
                  className="flex items-center gap-3 rounded-lg bg-rose-gold px-4 py-3 text-white"
                >
                  <Lock className="h-5 w-5" />
                  Alterar Senha
                </Link>
              </nav>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card className="p-6">
              <h2 className="mb-6 font-playfair text-xl text-dark-plum">Alterar Senha</h2>

              {message && (
                <div
                  className={`mb-4 rounded-lg p-3 text-sm ${
                    message.includes('sucesso')
                      ? 'bg-green-50 text-green-600'
                      : 'bg-red-50 text-red-600'
                  }`}
                >
                  {message}
                </div>
              )}

              <form onSubmit={handleSubmit} className="max-w-md space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-dark-plum">
                    Senha atual
                  </label>
                  <div className="relative">
                    <Input
                      type={showPasswords ? 'text' : 'password'}
                      value={formData.currentPassword}
                      onChange={(e) =>
                        setFormData({ ...formData, currentPassword: e.target.value })
                      }
                      required
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords(!showPasswords)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-mauve"
                    >
                      {showPasswords ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-dark-plum">
                    Nova senha
                  </label>
                  <Input
                    type={showPasswords ? 'text' : 'password'}
                    value={formData.newPassword}
                    onChange={(e) =>
                      setFormData({ ...formData, newPassword: e.target.value })
                    }
                    required
                    minLength={6}
                  />
                  <p className="mt-1 text-xs text-muted-mauve">
                    Mínimo de 6 caracteres
                  </p>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-dark-plum">
                    Confirmar nova senha
                  </label>
                  <Input
                    type={showPasswords ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      setFormData({ ...formData, confirmPassword: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="pt-4">
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Alterando...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Alterar senha
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
