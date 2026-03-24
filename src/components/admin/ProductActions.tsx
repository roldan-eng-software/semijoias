'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Edit, Trash2, Loader2 } from 'lucide-react'

interface ProductActionsProps {
  productId: string
  onDelete?: () => void
}

export function ProductActions({ productId }: ProductActionsProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!confirm('Tem certeza que deseja excluir este produto?')) {
      return
    }

    setIsDeleting(true)
    try {
      const res = await fetch(`/api/admin/produtos?id=${productId}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        window.location.reload()
      } else {
        alert('Erro ao excluir produto')
      }
    } catch {
      alert('Erro ao excluir produto')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="flex items-center justify-end gap-2">
      <Link
        href={`/admin/produtos/${productId}`}
        className="rounded-lg p-2 text-muted-mauve hover:bg-champagne hover:text-dark-plum"
      >
        <Edit className="h-4 w-4" />
      </Link>
      <button
        onClick={handleDelete}
        disabled={isDeleting}
        className="rounded-lg p-2 text-muted-mauve hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
      >
        {isDeleting ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Trash2 className="h-4 w-4" />
        )}
      </button>
    </div>
  )
}
