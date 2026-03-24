'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Loader2, Save, Plus, Trash2, Edit2, Image as ImageIcon } from 'lucide-react'

interface SiteConfig {
  storeName: string
  storeDescription: string
  storeEmail: string
  storePhone: string
  storeInstagram: string
  storeFacebook: string
  storeAddress: string
  freeShippingMin: string
  shippingCost: string
  returnPolicy: string
  exchangePolicy: string
}

interface Category {
  id: string
  name: string
  slug: string
  description: string | null
}

export default function ConfiguracoesPage() {
  const [activeTab, setActiveTab] = useState('loja')
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState('')
  
  const [config, setConfig] = useState<SiteConfig>({
    storeName: '',
    storeDescription: '',
    storeEmail: '',
    storePhone: '',
    storeInstagram: '',
    storeFacebook: '',
    storeAddress: '',
    freeShippingMin: '199',
    shippingCost: '15',
    returnPolicy: '',
    exchangePolicy: '',
  })

  const [categories, setCategories] = useState<Category[]>([])
  const [newCategory, setNewCategory] = useState({ name: '', description: '' })
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)

  useEffect(() => {
    loadConfig()
    loadCategories()
  }, [])

  const loadConfig = async () => {
    try {
      const res = await fetch('/api/admin/config')
      if (res.ok) {
        const data = await res.json()
        if (data) {
          setConfig(data)
        }
      }
    } catch (error) {
      console.error('Erro ao carregar config', error)
    } finally {
      setIsLoading(false)
    }
  }

  const loadCategories = async () => {
    try {
      const res = await fetch('/api/admin/categorias')
      if (res.ok) {
        const data = await res.json()
        setCategories(data)
      }
    } catch (error) {
      console.error('Erro ao carregar categorias', error)
    }
  }

  const handleSaveConfig = async () => {
    setIsSaving(true)
    setMessage('')
    try {
      const res = await fetch('/api/admin/config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      })
      if (res.ok) {
        setMessage('Configurações salvas com sucesso!')
      } else {
        setMessage('Erro ao salvar configurações')
      }
    } catch {
      setMessage('Erro ao salvar configurações')
    } finally {
      setIsSaving(false)
    }
  }

  const handleSaveCategory = async (isEdit: boolean) => {
    try {
      const url = isEdit && editingCategory 
        ? `/api/admin/categorias?id=${editingCategory.id}` 
        : '/api/admin/categorias'
      const method = isEdit && editingCategory ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newCategory.name,
          description: newCategory.description,
          slug: newCategory.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-'),
        }),
      })

      if (res.ok) {
        setNewCategory({ name: '', description: '' })
        setEditingCategory(null)
        loadCategories()
      }
    } catch (error) {
      console.error('Erro ao salvar categoria', error)
    }
  }

  const handleDeleteCategory = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta categoria?')) return
    try {
      const res = await fetch(`/api/admin/categorias?id=${id}`, { method: 'DELETE' })
      if (res.ok) {
        loadCategories()
      }
    } catch (error) {
      console.error('Erro ao excluir categoria', error)
    }
  }

  const tabs = [
    { id: 'loja', label: 'Loja' },
    { id: 'frete', label: 'Frete' },
    { id: 'politicas', label: 'Políticas' },
    { id: 'categorias', label: 'Categorias' },
  ]

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-rose-gold" />
      </div>
    )
  }

  return (
    <div>
      <h1 className="mb-8 font-playfair text-3xl text-dark-plum">Configurações</h1>

      {/* Tabs */}
      <div className="mb-6 flex gap-2 border-b border-champagne">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'border-b-2 border-rose-gold text-rose-gold'
                : 'text-muted-mauve hover:text-dark-plum'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab: Loja */}
      {activeTab === 'loja' && (
        <Card className="p-6">
          <h2 className="mb-4 font-playfair text-lg text-dark-plum">Informações da Loja</h2>
          
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-dark-plum">
                  Nome da loja
                </label>
                <Input
                  value={config.storeName}
                  onChange={(e) => setConfig({ ...config, storeName: e.target.value })}
                  placeholder="Simone Semi Joias"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-dark-plum">
                  E-mail de contato
                </label>
                <Input
                  type="email"
                  value={config.storeEmail}
                  onChange={(e) => setConfig({ ...config, storeEmail: e.target.value })}
                  placeholder="contato@simone.com.br"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-dark-plum">
                Descrição da loja
              </label>
              <textarea
                value={config.storeDescription}
                onChange={(e) => setConfig({ ...config, storeDescription: e.target.value })}
                placeholder="Descrição que aparece nos motores de busca..."
                rows={3}
                className="w-full rounded-lg border border-champagne bg-white px-4 py-2.5 text-dark-plum placeholder:text-muted-mauve focus:border-rose-gold focus:outline-none focus:ring-1 focus:ring-rose-gold"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-dark-plum">
                  Telefone
                </label>
                <Input
                  value={config.storePhone}
                  onChange={(e) => setConfig({ ...config, storePhone: e.target.value })}
                  placeholder="(11) 99999-9999"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-dark-plum">
                  Endereço
                </label>
                <Input
                  value={config.storeAddress}
                  onChange={(e) => setConfig({ ...config, storeAddress: e.target.value })}
                  placeholder="Rua exemplo, 123 - São Paulo, SP"
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-dark-plum">
                  Instagram
                </label>
                <Input
                  value={config.storeInstagram}
                  onChange={(e) => setConfig({ ...config, storeInstagram: e.target.value })}
                  placeholder="@simonesemijoias"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-dark-plum">
                  Facebook
                </label>
                <Input
                  value={config.storeFacebook}
                  onChange={(e) => setConfig({ ...config, storeFacebook: e.target.value })}
                  placeholder="https://facebook.com/simonesemijoias"
                />
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Tab: Frete */}
      {activeTab === 'frete' && (
        <Card className="p-6">
          <h2 className="mb-4 font-playfair text-lg text-dark-plum">Configurações de Frete</h2>
          
          <div className="space-y-4 max-w-md">
            <div>
              <label className="mb-1 block text-sm font-medium text-dark-plum">
                Valor mínimo para frete grátis (R$)
              </label>
              <Input
                type="number"
                value={config.freeShippingMin}
                onChange={(e) => setConfig({ ...config, freeShippingMin: e.target.value })}
                placeholder="199"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-dark-plum">
                Custo do frete (R$)
              </label>
              <Input
                type="number"
                value={config.shippingCost}
                onChange={(e) => setConfig({ ...config, shippingCost: e.target.value })}
                placeholder="15"
              />
            </div>
          </div>
        </Card>
      )}

      {/* Tab: Políticas */}
      {activeTab === 'politicas' && (
        <Card className="p-6">
          <h2 className="mb-4 font-playfair text-lg text-dark-plum">Políticas da Loja</h2>
          
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-dark-plum">
                Política de devolução
              </label>
              <textarea
                value={config.returnPolicy}
                onChange={(e) => setConfig({ ...config, returnPolicy: e.target.value })}
                placeholder="Descreva a política de devolução..."
                rows={4}
                className="w-full rounded-lg border border-champagne bg-white px-4 py-2.5 text-dark-plum placeholder:text-muted-mauve focus:border-rose-gold focus:outline-none focus:ring-1 focus:ring-rose-gold"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-dark-plum">
                Política de troca
              </label>
              <textarea
                value={config.exchangePolicy}
                onChange={(e) => setConfig({ ...config, exchangePolicy: e.target.value })}
                placeholder="Descreva a política de troca..."
                rows={4}
                className="w-full rounded-lg border border-champagne bg-white px-4 py-2.5 text-dark-plum placeholder:text-muted-mauve focus:border-rose-gold focus:outline-none focus:ring-1 focus:ring-rose-gold"
              />
            </div>
          </div>
        </Card>
      )}

      {/* Tab: Categorias */}
      {activeTab === 'categorias' && (
        <Card className="p-6">
          <h2 className="mb-4 font-playfair text-lg text-dark-plum">Gerenciar Categorias</h2>
          
          {/* Add/Edit Category Form */}
          <div className="mb-6 rounded-lg border border-champagne p-4">
            <h3 className="mb-3 text-sm font-medium text-dark-plum">
              {editingCategory ? 'Editar Categoria' : 'Nova Categoria'}
            </h3>
            <div className="flex gap-2">
              <Input
                value={editingCategory ? editingCategory.name : newCategory.name}
                onChange={(e) => {
                  if (editingCategory) {
                    setEditingCategory({ ...editingCategory, name: e.target.value })
                  } else {
                    setNewCategory({ ...newCategory, name: e.target.value })
                  }
                }}
                placeholder="Nome da categoria"
                className="flex-1"
              />
              <Input
                value={editingCategory ? editingCategory.description || '' : newCategory.description}
                onChange={(e) => {
                  if (editingCategory) {
                    setEditingCategory({ ...editingCategory, description: e.target.value })
                  } else {
                    setNewCategory({ ...newCategory, description: e.target.value })
                  }
                }}
                placeholder="Descrição (opcional)"
                className="flex-1"
              />
              <Button
                onClick={() => handleSaveCategory(!!editingCategory)}
              >
                {editingCategory ? 'Salvar' : <Plus className="h-4 w-4" />}
              </Button>
              {editingCategory && (
                <Button
                  variant="outline"
                  onClick={() => setEditingCategory(null)}
                >
                  Cancelar
                </Button>
              )}
            </div>
          </div>

          {/* Categories List */}
          <div className="space-y-2">
            {categories.map((category) => (
              <div
                key={category.id}
                className="flex items-center justify-between rounded-lg border border-champagne p-3"
              >
                <div>
                  <p className="font-medium text-dark-plum">{category.name}</p>
                  <p className="text-sm text-muted-mauve">
                    {category.slug} {category.description && `- ${category.description}`}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingCategory(category)}
                    className="rounded-lg p-2 text-muted-mauve hover:bg-champagne"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(category.id)}
                    className="rounded-lg p-2 text-muted-mauve hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
            {categories.length === 0 && (
              <p className="text-center text-muted-mauve">Nenhuma categoria cadastrada</p>
            )}
          </div>
        </Card>
      )}

      {/* Save Button */}
      {activeTab !== 'categorias' && (
        <div className="mt-6">
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
          <Button onClick={handleSaveConfig} disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Salvar configurações
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  )
}
