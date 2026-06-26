'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, ShoppingBag, ShoppingCart, Users, Settings, LogOut, Menu, X, Megaphone, Tag } from 'lucide-react'
import { logout } from '@/app/admin/(dashboard)/actions'

interface SidebarProps {
  userEmail: string
}

export function Sidebar({ userEmail }: SidebarProps) {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const navItems = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
    { name: 'Products', href: '/admin/products', icon: ShoppingBag },
    { name: 'Marketing', href: '/admin/promotions/banners', icon: Megaphone },
    { name: 'Coupons', href: '/admin/promotions/coupons', icon: Tag },
    { name: 'Customers', href: '/admin/customers', icon: Users },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ]

  return (
    <>
      {/* Mobile Header (visible only on mobile) */}
      <header className="h-16 shrink-0 bg-brand-dark border-b border-brand-border flex items-center justify-between px-4 md:hidden shadow-md relative z-20">
        <div className="flex items-center">
          <div className="relative w-10 h-10 mr-2 shrink-0">
            <Image src="/takumi.webp" alt="Takumi Logo" fill className="object-contain drop-shadow-md" />
          </div>
          <span className="text-lg font-bold tracking-[0.2em] text-white uppercase mt-1">Takumi</span>
        </div>
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className="p-2 text-gray-400 hover:text-brand-gold rounded-lg hover:bg-brand-gray transition-colors"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </header>

      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar (Desktop fixed in flex, Mobile fixed off-canvas) */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-40
        w-64 bg-brand-dark border-r border-brand-border flex flex-col
        transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Mobile close header inside drawer */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-brand-border md:hidden shrink-0">
          <span className="text-lg font-bold tracking-[0.2em] text-white uppercase">Menu</span>
          <button onClick={() => setIsOpen(false)} className="p-2 text-gray-400 hover:text-brand-gold rounded-lg">
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Desktop Logo Header */}
        <div className="h-20 items-center px-6 border-b border-brand-border shrink-0 hidden md:flex">
          <div className="relative w-12 h-12 mr-3 shrink-0">
            <Image src="/takumi.webp" alt="Takumi Logo" fill className="object-contain drop-shadow-md" />
          </div>
          <span className="text-xl font-bold tracking-[0.2em] text-white uppercase mt-1">Takumi</span>
        </div>

        <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href))
            
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)} // Close mobile menu on click
                className={`flex items-center px-4 py-3 rounded-lg font-medium transition-all ${
                  isActive
                    ? 'bg-brand-gold/10 text-brand-gold border border-brand-gold/20 shadow-[0_0_15px_rgba(212,175,55,0.05)]'
                    : 'text-gray-400 hover:bg-brand-gray hover:text-white border border-transparent'
                }`}
              >
                <item.icon className="h-5 w-5 mr-3" />
                {item.name}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-brand-border bg-brand-dark shrink-0">
          <div className="flex items-center px-4 mb-5">
            <div className="w-9 h-9 rounded-full bg-brand-gold/20 border border-brand-gold/50 text-brand-gold flex items-center justify-center font-bold text-sm shadow-[0_0_10px_rgba(212,175,55,0.2)]">
              {userEmail.charAt(0).toUpperCase()}
            </div>
            <div className="ml-3 overflow-hidden">
              <p className="text-sm font-semibold text-white truncate tracking-wide">Admin User</p>
              <p className="text-xs text-gray-500 truncate">{userEmail}</p>
            </div>
          </div>
          <form action={logout}>
            <button type="submit" className="flex items-center w-full px-4 py-2.5 text-red-400 hover:bg-red-950/30 hover:text-red-300 rounded-lg font-medium transition-colors border border-transparent hover:border-red-900/50">
              <LogOut className="h-5 w-5 mr-3" />
              Sign Out
            </button>
          </form>
        </div>
      </aside>
    </>
  )
}
