'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { ShoppingCart, Menu, X } from 'lucide-react'
import { useCart } from '@/components/providers/CartProvider'

export function MarketplaceNavbar() {
  const pathname = usePathname()
  const { cartCount } = useCart()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Store', href: '/shop' },
    { name: 'Categories', href: '/categories' },
    { name: 'Wholesale', href: '/wholesale' }
  ]

  return (
    <>

      {/* 2. Main Sticky Navbar */}
      <nav className="bg-white/90 backdrop-blur-md py-5 border-b border-gray-100 sticky top-0 z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4 md:gap-8">
            
            {/* Left: Brand Logo */}
            <div className="flex-shrink-0">
              <Link href="/" className="flex items-center gap-2 sm:gap-3 text-2xl font-black text-black tracking-widest uppercase hover:opacity-80 transition-opacity">
                <Image src="/takumi.webp" alt="Takumi Logo" width={40} height={40} className="object-contain" />
                <span className="hidden sm:block">TAKUMI</span>
              </Link>
            </div>

            {/* Center: Navigation Links (Hidden on Mobile) */}
            <div className="hidden md:flex flex-1 justify-center space-x-12">
              {navLinks.map((link) => {
                // Determine if link is active (exact match for Home/hash links, or prefix match for others)
                const isActive = link.href === '/' 
                  ? pathname === '/' 
                  : pathname.startsWith(link.href)

                return (
                  <Link 
                    key={link.name} 
                    href={link.href} 
                    className={`text-sm font-bold uppercase tracking-widest transition-colors relative group ${isActive ? 'text-[#D4AF37]' : 'text-gray-900 hover:text-[#D4AF37]'}`}
                  >
                    {link.name}
                    <span className={`absolute -bottom-2 left-0 h-0.5 bg-[#D4AF37] transition-all group-hover:w-full ${isActive ? 'w-full' : 'w-0'}`}></span>
                  </Link>
                )
              })}
            </div>

            {/* Right: Icons */}
            <div className="flex items-center space-x-4 md:space-x-6 text-gray-600 flex-shrink-0">
              
              <Link href="/cart" className="relative hover:text-black transition-colors p-1 group" aria-label="Shopping Cart">
                <ShoppingCart className="w-6 h-6 group-hover:scale-110 transition-transform" />
                {/* Marketplace style cart count badge */}
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white shadow-sm leading-none min-w-[20px] text-center">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* Mobile Menu Toggle */}
              <button 
                className="md:hidden p-1 hover:text-black transition-colors"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle Mobile Menu"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
            
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute w-full left-0 top-full bg-white border-b border-gray-100 shadow-lg z-40">
            <div className="px-4 py-4 space-y-4 flex flex-col">
              {navLinks.map((link) => {
                const isActive = link.href === '/' 
                  ? pathname === '/' 
                  : pathname.startsWith(link.href)

                return (
                  <Link 
                    key={link.name} 
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block text-base font-bold uppercase tracking-widest py-2 ${isActive ? 'text-[#D4AF37]' : 'text-gray-900 hover:text-[#D4AF37]'}`}
                  >
                    {link.name}
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </nav>
    </>
  )
}
