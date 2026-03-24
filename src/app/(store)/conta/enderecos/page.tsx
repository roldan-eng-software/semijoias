'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { User, Package, Heart, MapPin, Lock, Loader2, Plus, Trash2, Edit2 } from 'lucide-react'

interface Address {
  id: string
  label: string | null
  firstName: string
  lastName: string
  street: string
  number: string
  complement: string | null
  district: string
  city: string
  state: string
  zipCode: string
  isDefault: boolean
}

export default function ContaEnderecosPage() {
  const { data: session } = useSession()
  const [addresses, setAddresses] = useState<Address[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState('')

  const [formData, setFormData] = useState({
    label: '',
    firstName: '',
    lastName: '',
    street: '',
    number: '',
    complement: '',
    district: '',
    city: '',
    state: '',
    zipCode: '',
    isDefault: false,
  })

  useEffect(() => {
    if (session?.user?.id) {
      fetchAddresses()
    }
  }, [session])

  const fetchAddresses = async () => {
    try {
      const res = await fetch('/api/conta/enderecos')
      if (res.ok) {
        const data = await res.json()
        setAddresses(data)
      }
    } catch (error) {
      console.error('Erro ao buscar endereços', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setMessage('')

    try {
      const url = editingId ? `/api/conta/enderecos?id=${editingId}` : '/api/conta/enderecos'
      const method = editingId ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        setMessage('Endereço salvo com sucesso!')
        setShowForm(false)
        setEditingId(null)
        resetForm()
        fetchAddresses()
      } else {
        setMessage('Erro ao salvar endereço')
      }
    } catch {
      setMessage('Erro ao salvar endereço')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este endereço?')) return

    try {
      const res = await fetch(`/api/conta/enderecos?id=${id}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        fetchAddresses()
      }
    } catch {
      console.error('Erro ao excluir endereço')
    }
  }

  const handleEdit = (address: Address) => {
    setFormData({
      label: address.label || '',
      firstName: address.firstName,
      lastName: address.lastName,
      street: address.street,
      number: address.number,
      complement: address.complement || '',
      district: address.district,
      city: address.city,
      state: address.state,
      zipCode: address.zipCode,
      isDefault: address.isDefault,
    })
    setEditingId(address.id)
    setShowForm(true)
  }

  const resetForm = () => {
    setFormData({
      label: '',
      firstName: '',
      lastName: '',
      street: '',
      number: '',
      complement: '',
      district: '',
      city: '',
      state: '',
      zipCode: '',
      isDefault: false,
    })
  }

  const buscarCep = async (cep: string) => {
    const cepLimpo = cep.replace(/\D/g, '')
    if (cepLimpo.length !== 8) return

    try {
      const res = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`)
      const data = await res.json()

      if (!data.erro) {
        setFormData((prev) => ({
          ...prev,
          street: data.logradouro || '',
          complement: data.complemento || '',
          district: data.bairro || '',
          city: data.localidade || '',
          state: data.uf || '',
        }))
      }
    } catch (error) {
      console.error('Erro ao buscar CEP', error)
    }
  }

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
                  className="flex items-center gap-3 rounded-lg bg-rose-gold px-4 py-3 text-white"
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
              <div className="mb-6 flex items-center justify-between">
                <h2 className="font-playfair text-xl text-dark-plum">Meus Endereços</h2>
                {!showForm && (
                  <Button onClick={() => setShowForm(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Novo Endereço
                  </Button>
                )}
              </div>

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

              {showForm && (
                <form onSubmit={handleSubmit} className="mb-6 rounded-lg border border-champagne p-4">
                  <h3 className="mb-4 font-medium text-dark-plum">
                    {editingId ? 'Editar Endereço' : 'Novo Endereço'}
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-dark-plum">
                        Apelido
                      </label>
                      <Input
                        value={formData.label}
                        onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                        placeholder="Ex: Casa, Trabalho"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="mb-1 block text-sm font-medium text-dark-plum">
                          Nome
                        </label>
                        <Input
                          value={formData.firstName}
                          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-sm font-medium text-dark-plum">
                          Sobrenome
                        </label>
                        <Input
                          value={formData.lastName}
                          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    {/* CEP em destaque */}
                    <div className="rounded-lg bg-champagne/50 p-4">
                      <label className="mb-1 block text-sm font-medium text-dark-plum">
                        CEP
                      </label>
                      <div className="flex gap-2">
                        <Input
                          value={formData.zipCode}
                          onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                          onBlur={(e) => buscarCep(e.target.value)}
                          placeholder="00000-000"
                          className="flex-1"
                          required
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => buscarCep(formData.zipCode)}
                        >
                          Buscar
                        </Button>
                      </div>
                      <p className="mt-1 text-xs text-muted-mauve">
                        Digite o CEP para buscar automaticamente o endereço
                      </p>
                    </div>

                    <div>
                      <label className="mb-1 block text-sm font-medium text-dark-plum">
                        Rua
                      </label>
                      <Input
                        value={formData.street}
                        onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="mb-1 block text-sm font-medium text-dark-plum">
                          Número
                        </label>
                        <Input
                          value={formData.number}
                          onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-sm font-medium text-dark-plum">
                          Complemento
                        </label>
                        <Input
                          value={formData.complement}
                          onChange={(e) => setFormData({ ...formData, complement: e.target.value })}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="mb-1 block text-sm font-medium text-dark-plum">
                        Bairro
                      </label>
                      <Input
                        value={formData.district}
                        onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="mb-1 block text-sm font-medium text-dark-plum">
                          Cidade
                        </label>
                        <Input
                          value={formData.city}
                          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-sm font-medium text-dark-plum">
                          Estado
                        </label>
                        <Input
                          value={formData.state}
                          onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="isDefault"
                        checked={formData.isDefault}
                        onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                        className="rounded border-champagne"
                      />
                      <label htmlFor="isDefault" className="text-sm text-dark-plum">
                        Endereço principal
                      </label>
                    </div>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <Button type="submit" disabled={isSaving}>
                      {isSaving ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Salvando...
                        </>
                      ) : (
                        'Salvar'
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setShowForm(false)
                        setEditingId(null)
                        resetForm()
                      }}
                    >
                      Cancelar
                    </Button>
                  </div>
                </form>
              )}

              {isLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-rose-gold" />
                </div>
              ) : addresses.length === 0 && !showForm ? (
                <div className="py-8 text-center">
                  <MapPin className="mx-auto mb-4 h-12 w-12 text-muted-mauve" />
                  <p className="text-muted-mauve">Você não tem endereços cadastrados</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {addresses.map((address) => (
                    <div
                      key={address.id}
                      className="rounded-lg border border-champagne p-4"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium text-dark-plum">
                            {address.label || 'Endereço'}
                            {address.isDefault && (
                              <span className="ml-2 rounded-full bg-rose-gold px-2 py-0.5 text-xs text-white">
                                Principal
                              </span>
                            )}
                          </p>
                          <p className="mt-1 text-sm text-muted-mauve">
                            {address.firstName} {address.lastName}
                          </p>
                          <p className="text-sm text-muted-mauve">
                            {address.street}, {address.number}
                            {address.complement && `, ${address.complement}`}
                          </p>
                          <p className="text-sm text-muted-mauve">
                            {address.district} - {address.city}/{address.state}
                          </p>
                          <p className="text-sm text-muted-mauve">CEP: {address.zipCode}</p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(address)}
                            className="rounded-lg p-2 text-muted-mauve hover:bg-champagne"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(address.id)}
                            className="rounded-lg p-2 text-muted-mauve hover:bg-champagne hover:text-red-500"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
