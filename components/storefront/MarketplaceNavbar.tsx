'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ShoppingCart } from 'lucide-react'
import { useCart } from '@/components/providers/CartProvider'

export function MarketplaceNavbar() {
  const pathname = usePathname()
  const { cartCount } = useCart()

  return (
    <>

      {/* 2. Main Sticky Navbar */}
      <nav className="bg-white/90 backdrop-blur-md py-5 border-b border-gray-100 sticky top-0 z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4 md:gap-8">
            
            {/* Left: Brand Logo */}
            <div className="flex-shrink-0">
              <Link href="/" className="text-2xl font-black text-black tracking-widest uppercase hover:opacity-80 transition-opacity">
                TAKUMI
              </Link>
            </div>

            {/* Center: Navigation Links (Hidden on Mobile) */}
            <div className="hidden md:flex flex-1 justify-center space-x-12">
              {[
                { name: 'Home', href: '/' },
                { name: 'Store', href: '/shop' },
                { name: 'Categories', href: '/#categories' },
                { name: 'Wholesale', href: '/wholesale' }
              ].map((link) => {
                // Determine if link is active (exact match for Home/hash links, or prefix match for others)
                const isActive = link.href.includes('#') 
                  ? false 
                  : link.href === '/' 
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
            <div className="flex items-center space-x-6 text-gray-600 flex-shrink-0">



              
              <Link href="/cart" className="relative hover:text-black transition-colors p-1 group" aria-label="Shopping Cart">
                <ShoppingCart className="w-6 h-6 group-hover:scale-110 transition-transform" />
                {/* Marketplace style cart count badge */}
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white shadow-sm leading-none min-w-[20px] text-center">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>
            
          </div>
        </div>
      </nav>
    </>
  )
}
