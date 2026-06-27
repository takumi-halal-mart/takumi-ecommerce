'use client'

import { useState } from 'react'
import { StorefrontProduct } from '@/app/actions/storefront'
import { WholesaleCard } from './WholesaleCard'
import { Search, Building2, Truck, Snowflake } from 'lucide-react'

export interface WholesaleClientProps {
  products: StorefrontProduct[]
}

export function WholesaleClient({ products }: WholesaleClientProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [isFormSubmitted, setIsFormSubmitted] = useState(false)

  const filteredProducts = products.filter(p => {
    if (searchQuery.trim() === '') return true
    return p.name.toLowerCase().includes(searchQuery.toLowerCase())
  })

  return (
    <div className="bg-[#F8F9FA] min-h-screen pb-24">
      {/* 1. B2B Portal Hero */}
      <div className="bg-brand-dark pt-20 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-black text-white tracking-widest uppercase mb-4">
            Takumi B2B Portal
          </h1>
          <p className="text-brand-gold text-sm md:text-base font-medium tracking-widest uppercase mb-8">
            Direct imports, unmatched volume pricing, and custom sourcing.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={() => document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' })}
              className="w-full sm:w-auto px-8 py-3 bg-white text-black font-black uppercase tracking-widest text-sm rounded-full hover:bg-gray-100 transition-colors"
            >
              Browse Catalog
            </button>
            <button 
              onClick={() => document.getElementById('inquiry')?.scrollIntoView({ behavior: 'smooth' })}
              className="w-full sm:w-auto px-8 py-3 border-2 border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-black font-black uppercase tracking-widest text-sm rounded-full transition-colors"
            >
              Request Quote
            </button>
          </div>
        </div>
      </div>

      {/* 2. Trust Banner */}
      <div className="bg-brand-gold/10 border-b border-brand-gold/20 py-4 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center gap-6 md:gap-16 text-xs md:text-sm font-bold uppercase tracking-widest text-brand-dark">
          <div className="flex items-center gap-2"><Snowflake className="w-5 h-5" /> Cold-Chain Logistics</div>
          <div className="flex items-center gap-2"><Truck className="w-5 h-5" /> Next-Day Tokyo Delivery</div>
          <div className="flex items-center gap-2"><Building2 className="w-5 h-5" /> Dedicated Support</div>
        </div>
      </div>

      {/* 3. Catalog Section */}
      <div id="catalog" className="max-w-5xl mx-auto px-4 mt-16 scroll-mt-24">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <h2 className="text-2xl font-black text-black tracking-widest uppercase text-center md:text-left">Wholesale Catalog</h2>
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search SKUs..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black font-medium text-sm text-black"
            />
          </div>
        </div>

        <div className="space-y-4">
          {filteredProducts.length > 0 ? (
            filteredProducts.map(product => (
              <WholesaleCard key={product.id} product={product} />
            ))
          ) : (
            <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
              <p className="text-gray-500 font-medium">No wholesale products found matching your search.</p>
            </div>
          )}
        </div>
      </div>

      {/* 4. Inquiry Engine */}
      <div id="inquiry" className="max-w-3xl mx-auto px-4 mt-24 scroll-mt-24">
        <div className="bg-brand-dark rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden border border-brand-border">
          {/* Decorative element */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-gold/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
          
          <div className="relative z-10">
            <h2 className="text-2xl md:text-3xl font-black text-white tracking-widest uppercase mb-2">Partner With Us</h2>
            <p className="text-gray-400 text-sm mb-8">Require custom sourcing or extremely high volumes? Request a specialized quote below.</p>

            {isFormSubmitted ? (
              <div className="bg-brand-gold/10 border border-brand-gold/30 rounded-xl p-8 text-center animate-in fade-in zoom-in duration-500">
                <div className="w-16 h-16 bg-brand-gold rounded-full flex items-center justify-center mx-auto mb-4 text-black text-2xl">✓</div>
                <h3 className="text-xl font-bold text-brand-gold uppercase tracking-widest mb-2">Quote Requested</h3>
                <p className="text-gray-300 text-sm">Your dedicated account manager will contact you within 24 hours.</p>
              </div>
            ) : (
              <form 
                onSubmit={(e) => {
                  e.preventDefault()
                  setIsFormSubmitted(true)
                }} 
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-brand-gold mb-2">Business Name</label>
                    <input required type="text" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-gold transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-brand-gold mb-2">Contact Person</label>
                    <input required type="text" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-gold transition-colors" />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-brand-gold mb-2">WhatsApp / Phone</label>
                    <input required type="text" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-gold transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-brand-gold mb-2">Est. Monthly Volume</label>
                    <select className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-gold transition-colors appearance-none">
                      <option className="text-black bg-white">Less than ¥100,000</option>
                      <option className="text-black bg-white">¥100,000 - ¥500,000</option>
                      <option className="text-black bg-white">¥500,000 - ¥2,000,000</option>
                      <option className="text-black bg-white">¥2,000,000+</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-brand-gold mb-2">Sourcing Requests (Optional)</label>
                  <textarea rows={4} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-gold transition-colors resize-none" placeholder="What ingredients do you need?"></textarea>
                </div>

                <button type="submit" className="w-full py-4 bg-brand-gold hover:bg-yellow-500 text-black font-black uppercase tracking-widest text-sm rounded-xl transition-colors">
                  Submit Inquiry
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
