'use client'

import { useState, useRef, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import { User, LogOut, Package, Settings } from 'lucide-react'

export function UserMenu() {
  const { data: session, status } = useSession()
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  if (status === 'loading') {
    return null
  }

  if (!session) {
    return (
      <Link
        href="/auth/signin"
        className="text-dark-plum hover:text-rose-gold"
        aria-label="Entrar"
      >
        <User className="h-5 w-5" />
      </Link>
    )
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-dark-plum hover:text-rose-gold"
        aria-label="Menu do usuário"
      >
        <User className="h-5 w-5" />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full z-50 mt-2 w-48 rounded-lg border border-champagne bg-white py-2 shadow-lg">
          <div className="border-b border-champagne px-4 py-2">
            <p className="text-sm font-medium text-dark-plum">{session.user?.name}</p>
            <p className="text-xs text-muted-mauve">{session.user?.email}</p>
          </div>
          <Link
            href="/conta/pedidos"
            className="flex items-center gap-3 px-4 py-2 text-sm text-dark-plum hover:bg-champagne"
            onClick={() => setIsOpen(false)}
          >
            <Package className="h-4 w-4" />
            Meus pedidos
          </Link>
          <Link
            href="/conta"
            className="flex items-center gap-3 px-4 py-2 text-sm text-dark-plum hover:bg-champagne"
            onClick={() => setIsOpen(false)}
          >
            <Settings className="h-4 w-4" />
            Minha conta
          </Link>
          <button
            onClick={() => {
              setIsOpen(false)
              signOut({ callbackUrl: '/' })
            }}
            className="flex w-full items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
          >
            <LogOut className="h-4 w-4" />
            Sair
          </button>
        </div>
      )}
    </div>
  )
}
