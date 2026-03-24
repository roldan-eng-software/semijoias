'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { User, Package, Heart, MapPin, Lock, Loader2, Save } from 'lucide-react'

export default function ContaPage() {
  const router = useRouter()
  const { data: session, update } = useSession()
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  
  const [formData, setFormData] = useState({
    name: session?.user?.name || '',
    phone: '',
    cpf: '',
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

    try {
      const res = await fetch('/api/conta', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        setMessage('Dados atualizados com sucesso!')
        await update({ name: formData.name })
      } else {
        setMessage('Erro ao atualizar dados')
      }
    } catch {
      setMessage('Erro ao atualizar dados')
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
                  className="flex items-center gap-3 rounded-lg bg-rose-gold px-4 py-3 text-white"
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
                  className="flex items-center gap-3 rounded-lg px-4 py-3 text-dark-plum hover:bg-champagne"
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
              <h2 className="mb-6 font-playfair text-xl text-dark-plum">Dados Pessoais</h2>

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

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-dark-plum">
                    Nome completo
                  </label>
                  <Input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Seu nome"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-dark-plum">
                    E-mail
                  </label>
                  <Input
                    type="email"
                    value={session.user?.email || ''}
                    disabled
                    className="bg-gray-100"
                  />
                  <p className="mt-1 text-xs text-muted-mauve">
                    O e-mail não pode ser alterado
                  </p>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-dark-plum">
                    Telefone
                  </label>
                  <Input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="(11) 99999-9999"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-dark-plum">
                    CPF
                  </label>
                  <Input
                    type="text"
                    value={formData.cpf}
                    onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
                    placeholder="000.000.000-00"
                  />
                </div>

                <div className="pt-4">
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Salvando...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Salvar alterações
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
