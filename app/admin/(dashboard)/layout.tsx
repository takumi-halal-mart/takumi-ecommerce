import { ReactNode } from 'react'
import Link from 'next/link'
import { LayoutDashboard, ShoppingBag, Users, Settings, LogOut, Package } from 'lucide-react'
import { logout } from './actions'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/admin/login')
  }

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar - Desktop */}
      <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 hidden md:flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-gray-200 dark:border-gray-700">
          <Package className="h-6 w-6 text-blue-600 dark:text-blue-400 mr-2" />
          <span className="text-lg font-bold text-gray-900 dark:text-white">Takumi Admin</span>
        </div>

        <nav className="flex-1 py-4 px-3 space-y-1">
          <Link href="/admin" className="flex items-center px-3 py-2.5 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-lg font-medium">
            <LayoutDashboard className="h-5 w-5 mr-3" />
            Dashboard
          </Link>
          <Link href="/admin/products" className="flex items-center px-3 py-2.5 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 rounded-lg font-medium transition-colors">
            <ShoppingBag className="h-5 w-5 mr-3" />
            Products
          </Link>
          <Link href="/admin/customers" className="flex items-center px-3 py-2.5 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 rounded-lg font-medium transition-colors">
            <Users className="h-5 w-5 mr-3" />
            Customers
          </Link>
          <Link href="/admin/settings" className="flex items-center px-3 py-2.5 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 rounded-lg font-medium transition-colors">
            <Settings className="h-5 w-5 mr-3" />
            Settings
          </Link>
        </nav>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center px-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-sm">
              {user.email?.charAt(0).toUpperCase() || 'A'}
            </div>
            <div className="ml-3 overflow-hidden">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">Admin User</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
            </div>
          </div>
          <form action={logout}>
            <button type="submit" className="flex items-center w-full px-3 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg font-medium transition-colors">
              <LogOut className="h-5 w-5 mr-3" />
              Sign Out
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content Wrapper */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4 md:hidden">
          <div className="flex items-center">
            <Package className="h-6 w-6 text-blue-600 dark:text-blue-400 mr-2" />
            <span className="text-lg font-bold text-gray-900 dark:text-white">Takumi</span>
          </div>
          <form action={logout}>
            <button type="submit" className="p-2 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
              <LogOut className="h-5 w-5" />
            </button>
          </form>
        </header>

        {/* Inner Content */}
        <div className="flex-1 overflow-auto p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
