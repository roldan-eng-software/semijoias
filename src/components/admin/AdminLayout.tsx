import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import Link from 'next/link'
import { LayoutDashboard, Package, ShoppingCart, Users, Settings, LogOut } from 'lucide-react'

const adminNav = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/produtos', label: 'Produtos', icon: Package },
  { href: '/admin/pedidos', label: 'Pedidos', icon: ShoppingCart },
  { href: '/admin/clientes', label: 'Clientes', icon: Users },
]

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  const userRole = (session?.user as { role?: string })?.role
  if (!session || userRole !== 'ADMIN') {
    redirect('/auth/signin?callbackUrl=/admin')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-dark-plum text-white">
        <div className="p-6">
          <h1 className="font-playfair text-2xl">Admin</h1>
          <p className="text-sm text-white/60">Simone Semi-Joias</p>
        </div>
        
        <nav className="mt-6 px-3">
          {adminNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm text-white/80 hover:bg-white/10 hover:text-white"
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 border-t border-white/10 p-3">
          <Link
            href="/admin/configuracoes"
            className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm text-white/80 hover:bg-white/10 hover:text-white"
          >
            <Settings className="h-5 w-5" />
            Configurações
          </Link>
          <form action="/api/auth/signout" method="POST">
            <button
              type="submit"
              className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm text-white/80 hover:bg-white/10 hover:text-white"
            >
              <LogOut className="h-5 w-5" />
              Sair
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 p-8">
        {children}
      </main>
    </div>
  )
}
