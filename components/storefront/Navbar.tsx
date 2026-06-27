'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search, User, ShoppingBag, Menu, X } from 'lucide-react'

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Hardcoded for now, will map to global cart state later
  const cartItemCount = 3 

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Mobile: Hamburger Left */}
          <div className="flex items-center md:hidden">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-black p-2 -ml-2 hover:bg-gray-50 rounded-lg transition-colors"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Desktop & Mobile: Logo (Left on Desktop, Center on Mobile) */}
          <div className="flex-1 flex justify-center md:justify-start md:flex-none">
            <Link href="/" className="flex items-center" onClick={() => setIsMobileMenuOpen(false)}>
              <span className="text-2xl font-black tracking-[0.25em] text-black uppercase">
                Takumi
              </span>
            </Link>
          </div>

          {/* Desktop: Center Navigation */}
          <div className="hidden md:flex flex-1 justify-center space-x-12">
            <Link href="/" className="text-sm font-bold text-gray-900 uppercase tracking-widest hover:text-brand-gold transition-colors relative group">
              Home
              <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-brand-gold transition-all group-hover:w-full"></span>
            </Link>
            <Link href="/shop" className="text-sm font-bold text-gray-900 uppercase tracking-widest hover:text-brand-gold transition-colors relative group">
              Shop
              <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-brand-gold transition-all group-hover:w-full"></span>
            </Link>
            <Link href="/wholesale" className="text-sm font-bold text-gray-900 uppercase tracking-widest hover:text-brand-gold transition-colors relative group">
              Wholesale
              <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-brand-gold transition-all group-hover:w-full"></span>
            </Link>
          </div>

          {/* Desktop & Mobile: Right Action Icons */}
          <div className="flex items-center space-x-4 md:space-x-6 md:flex-none">
            <button className="hidden md:flex text-black hover:text-brand-gold transition-colors">
              <Search className="h-5 w-5" />
            </button>
            <button className="hidden md:flex text-black hover:text-brand-gold transition-colors">
              <User className="h-5 w-5" />
            </button>
            
            <Link href="/cart" className="relative text-black hover:text-brand-gold transition-colors p-2 -mr-2 md:p-0 md:mr-0">
              <ShoppingBag className="h-6 w-6 md:h-5 md:w-5" />
              {cartItemCount > 0 && (
                <span className="absolute top-1 right-1 md:-top-1.5 md:-right-2 bg-brand-gold text-black text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                  {cartItemCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile: Full Screen Drawer */}
      <div 
        className={`md:hidden absolute top-20 left-0 w-full bg-white border-b border-gray-100 shadow-xl transition-all duration-300 ease-in-out overflow-hidden ${
          isMobileMenuOpen ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0 border-transparent shadow-none'
        }`}
      >
        <div className="px-6 py-8 flex flex-col space-y-6 bg-white">
          <Link 
            href="/" 
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-lg font-black text-black uppercase tracking-widest hover:text-brand-gold transition-colors"
          >
            Home
          </Link>
          <Link 
            href="/shop" 
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-lg font-black text-black uppercase tracking-widest hover:text-brand-gold transition-colors"
          >
            Shop
          </Link>
          <Link 
            href="/wholesale" 
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-lg font-black text-black uppercase tracking-widest hover:text-brand-gold transition-colors"
          >
            Wholesale
          </Link>
          
          <div className="pt-6 mt-2 border-t border-gray-100 flex items-center space-x-6">
            <button className="flex items-center text-sm font-bold text-gray-500 uppercase tracking-widest hover:text-brand-gold transition-colors">
              <User className="h-5 w-5 mr-3" /> Account
            </button>
            <button className="flex items-center text-sm font-bold text-gray-500 uppercase tracking-widest hover:text-brand-gold transition-colors">
              <Search className="h-5 w-5 mr-3" /> Search
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
