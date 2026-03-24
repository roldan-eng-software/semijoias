"use client"

import Link from "next/link"
import { useState } from "react"
import { Search, Heart, ShoppingBag, Menu, X } from "lucide-react"
import { useCartStore } from "@/store/cartStore"
import { UserMenu } from "@/components/auth/UserMenu"

const navLinks = [
  { href: "/produtos", label: "Coleções" },
  { href: "/produtos?filter=novidades", label: "Novidades" },
  { href: "/produtos?filter=promocoes", label: "Promoções" },
  { href: "/sobre", label: "Sobre" },
]

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { openCart, getTotalItems } = useCartStore()
  const totalItems = getTotalItems()

  return (
    <header className="fixed left-0 right-0 top-0 z-50 border-b border-champagne/50 bg-ivory/95 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 lg:px-8">
        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-dark-plum transition-colors hover:text-rose-gold"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? (
            <X className="h-6 w-6 text-dark-plum" />
          ) : (
            <Menu className="h-6 w-6 text-dark-plum" />
          )}
        </button>

        {/* Logo */}
        <Link
          href="/"
          className="font-playfair text-2xl font-semibold text-dark-plum"
        >
          Simone Semi Joias
        </Link>

        {/* Icons */}
        <div className="flex items-center gap-4">
          <button aria-label="Search" className="text-dark-plum hover:text-rose-gold">
            <Search className="h-5 w-5" />
          </button>
          <UserMenu />
          <button
            onClick={openCart}
            aria-label="Cart"
            className="relative text-dark-plum hover:text-rose-gold"
          >
            <ShoppingBag className="h-5 w-5" />
            {totalItems > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-gold text-[10px] font-bold text-white">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="border-t border-champagne bg-ivory lg:hidden">
          <nav className="flex flex-col gap-4 px-4 py-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-base font-medium text-dark-plum"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}
