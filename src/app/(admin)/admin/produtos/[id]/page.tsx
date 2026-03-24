'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { ArrowLeft, Save, Loader2, ImagePlus } from 'lucide-react'

interface Category {
  id: string
  name: string
  slug: string
}

interface FormData {
  name: string
  slug: string
  description: string
  price: string
  compareAtPrice: string
  categoryId: string
  material: string
  stone: string
  gender: string
  stock: string
  sku: string
  isActive: boolean
  isFeatured: boolean
  isNew: boolean
}

interface ProductData extends FormData {
  images: string[]
}

export default function EditarProdutoPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingCategories, setIsLoadingCategories] = useState(true)
  const [isLoadingProduct, setIsLoadingProduct] = useState(true)
  const [message, setMessage] = useState('')
  const [categories, setCategories] = useState<Category[]>([])
  const [imagem, setImagem] = useState<File | null>(null)
  const [imagemPreview, setImagemPreview] = useState<string | null>(null)
  const [productId, setProductId] = useState<string>('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    async function fetchData() {
      const resolvedParams = await params
      setProductId(resolvedParams.id)

      try {
        const [categoriesRes, productRes] = await Promise.all([
          fetch('/api/admin/categorias'),
          fetch(`/api/admin/produtos?id=${resolvedParams.id}`),
        ])

        if (categoriesRes.ok) {
          const cats = await categoriesRes.json()
          setCategories(cats)
        }

        if (productRes.ok) {
          const product: ProductData = await productRes.json()
          setFormData({
            name: product.name || '',
            slug: product.slug || '',
            description: product.description || '',
            price: product.price?.toString() || '',
            compareAtPrice: product.compareAtPrice?.toString() || '',
            categoryId: product.categoryId || '',
            material: product.material || '',
            stone: product.stone || '',
            gender: product.gender || 'FEMININO',
            stock: product.stock?.toString() || '0',
            sku: product.sku || '',
            isActive: product.isActive ?? true,
            isFeatured: product.isFeatured ?? false,
            isNew: product.isNew ?? false,
          })
          if (product.images && product.images.length > 0) {
            setImagemPreview(product.images[0])
          }
        }
      } catch (error) {
        console.error('Erro ao buscar dados:', error)
        setMessage('Erro ao carregar produto')
      } finally {
        setIsLoadingCategories(false)
        setIsLoadingProduct(false)
      }
    }
    fetchData()
  }, [params])

  const handleImageClick = () => {
    fileInputRef.current?.click()
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImagem(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagemPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const [formData, setFormData] = useState<FormData>({
    name: '',
    slug: '',
    description: '',
    price: '',
    compareAtPrice: '',
    categoryId: '',
    material: '',
    stone: '',
    gender: 'FEMININO',
    stock: '0',
    sku: '',
    isActive: true,
    isFeatured: false,
    isNew: true,
  })

  const handleGenerateSlug = (name: string) => {
    const slug = name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
    setFormData((prev) => ({ ...prev, slug }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage('')

    try {
      const imageUrl = imagemPreview || null

      const res = await fetch(`/api/admin/produtos?id=${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          compareAtPrice: formData.compareAtPrice ? parseFloat(formData.compareAtPrice) : null,
          stock: parseInt(formData.stock),
          imageUrl,
        }),
      })

      if (res.ok) {
        setMessage('Produto atualizado com sucesso!')
        setTimeout(() => {
          router.push('/admin/produtos')
        }, 1500)
      } else {
        const data = await res.json()
        setMessage(data.error || 'Erro ao atualizar produto')
      }
    } catch {
      setMessage('Erro ao atualizar produto')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoadingProduct) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-rose-gold" />
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/admin/produtos"
          className="inline-flex items-center gap-2 text-sm text-muted-mauve hover:text-dark-plum"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para produtos
        </Link>
      </div>

      <h1 className="mb-8 font-playfair text-3xl text-dark-plum">Editar Produto</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6">
              <h2 className="mb-4 font-playfair text-lg text-dark-plum">Informações do Produto</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-dark-plum">
                    Nome do produto *
                  </label>
                  <Input
                    value={formData.name}
                    onChange={(e) => {
                      setFormData({ ...formData, name: e.target.value })
                      if (!formData.slug) {
                        handleGenerateSlug(e.target.value)
                      }
                    }}
                    onBlur={(e) => handleGenerateSlug(e.target.value)}
                    placeholder="Nome do produto"
                    required
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-dark-plum">
                    URL amigável (slug)
                  </label>
                  <Input
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="nome-do-produto"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-dark-plum">
                    Descrição
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Descrição do produto..."
                    rows={4}
                    className="w-full rounded-lg border border-champagne bg-white px-4 py-2.5 text-dark-plum placeholder:text-muted-mauve focus:border-rose-gold focus:outline-none focus:ring-1 focus:ring-rose-gold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-dark-plum">
                      Preço *
                    </label>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      placeholder="0,00"
                      required
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-dark-plum">
                      Preço de comparação
                    </label>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.compareAtPrice}
                      onChange={(e) => setFormData({ ...formData, compareAtPrice: e.target.value })}
                      placeholder="0,00"
                    />
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="mb-4 font-playfair text-lg text-dark-plum">Detalhes do Produto</h2>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-dark-plum">
                      Categoria *
                    </label>
                    <select
                      value={formData.categoryId}
                      onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                      className="w-full rounded-lg border border-champagne bg-white px-4 py-2.5 text-dark-plum focus:border-rose-gold focus:outline-none focus:ring-1 focus:ring-rose-gold"
                      required
                      disabled={isLoadingCategories}
                    >
                      <option value="">
                        {isLoadingCategories ? 'Carregando...' : 'Selecione uma categoria'}
                      </option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-dark-plum">
                      Gênero
                    </label>
                    <select
                      value={formData.gender}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                      className="w-full rounded-lg border border-champagne bg-white px-4 py-2.5 text-dark-plum focus:border-rose-gold focus:outline-none focus:ring-1 focus:ring-rose-gold"
                    >
                      <option value="FEMININO">Feminino</option>
                      <option value="MASCULINO">Masculino</option>
                      <option value="UNISSEX">Unissex</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-dark-plum">
                      Material
                    </label>
                    <Input
                      value={formData.material}
                      onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                      placeholder="Ouro 18k, Prata 925, etc."
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-dark-plum">
                      Pedra
                    </label>
                    <Input
                      value={formData.stone}
                      onChange={(e) => setFormData({ ...formData, stone: e.target.value })}
                      placeholder="Zircônia, Pérola, etc."
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-dark-plum">
                      SKU
                    </label>
                    <Input
                      value={formData.sku}
                      onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                      placeholder="SKU-001"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-dark-plum">
                      Estoque
                    </label>
                    <Input
                      type="number"
                      min="0"
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="mb-4 font-playfair text-lg text-dark-plum">Status</h2>
              
              <div className="space-y-3">
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="rounded border-champagne"
                  />
                  <span className="text-sm text-dark-plum">Produto ativo</span>
                </label>
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="rounded border-champagne"
                  />
                  <span className="text-sm text-dark-plum">Produto em destaque</span>
                </label>
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={formData.isNew}
                    onChange={(e) => setFormData({ ...formData, isNew: e.target.checked })}
                    className="rounded border-champagne"
                  />
                  <span className="text-sm text-dark-plum">Novo produto</span>
                </label>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="mb-4 font-playfair text-lg text-dark-plum">Imagem</h2>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              
              {imagemPreview ? (
                <div className="relative">
                  <img
                    src={imagemPreview}
                    alt="Preview"
                    className="h-40 w-full rounded-lg object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImagem(null)
                      setImagemPreview(null)
                      if (fileInputRef.current) {
                        fileInputRef.current.value = ''
                      }
                    }}
                    className="absolute right-2 top-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <div
                  onClick={handleImageClick}
                  className="flex h-40 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-champagne bg-champagne/30 text-muted-mauve hover:border-rose-gold"
                >
                  <ImagePlus className="mb-2 h-8 w-8" />
                  <span className="text-sm">Clique para adicionar imagem</span>
                </div>
              )}
            </Card>

            {message && (
              <div
                className={`rounded-lg p-3 text-sm ${
                  message.includes('sucesso')
                    ? 'bg-green-50 text-green-600'
                    : 'bg-red-50 text-red-600'
                }`}
              >
                {message}
              </div>
            )}

            <div className="flex gap-2">
              <Button type="submit" className="flex-1" disabled={isLoading}>
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
              <Link href="/admin/produtos">
                <Button variant="outline" type="button">
                  Cancelar
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
