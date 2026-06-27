'use client'

import { useState, useMemo } from 'react'
import { StorefrontProduct, StorefrontCategory } from '@/app/actions/storefront'
import { MarketplaceCard } from './MarketplaceCard'
import { Filter, Check, Search } from 'lucide-react'

export interface ShopClientProps {
  initialProducts: StorefrontProduct[]
  categories: StorefrontCategory[]
  initialCategory: string
}

export function ShopClient({ initialProducts, categories, initialCategory }: ShopClientProps) {
  const [activeCategory, setActiveCategory] = useState(initialCategory)
  const [sortMethod, setSortMethod] = useState('newest')
  const [isWholesaleOnly, setIsWholesaleOnly] = useState(false)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [visibleCount, setVisibleCount] = useState(12)
  const [searchQuery, setSearchQuery] = useState('')

  // Filtering Logic
  const filteredProducts = useMemo(() => {
    let result = initialProducts

    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase()
      result = result.filter(p => p.name.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q))
    }

    if (activeCategory !== 'All') {
      result = result.filter(p => p.category === activeCategory)
    }

    if (isWholesaleOnly) {
      result = result.filter(p => p.is_wholesale)
    }

    // Sorting
    result.sort((a, b) => {
      if (sortMethod === 'price_low') return (a.retail_price || 0) - (b.retail_price || 0)
      if (sortMethod === 'price_high') return (b.retail_price || 0) - (a.retail_price || 0)
      // default: newest
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    })

    return result
  }, [initialProducts, activeCategory, sortMethod, isWholesaleOnly, searchQuery])

  const visibleProducts = filteredProducts.slice(0, visibleCount)
  const hasMore = visibleCount < filteredProducts.length

  const allCategories = [{ id: 'all', name: 'All', created_at: '' }, ...categories]

  return (
    <>
      {/* 1. Hero Header */}
      <div className="bg-brand-dark pt-12 pb-8 px-4 border-b border-brand-border">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-black text-white tracking-widest uppercase mb-6">
            The Collection
          </h1>
          
          {/* Quick Category Pills */}
          <div className="flex flex-wrap justify-center gap-2 md:gap-3 pb-2 md:pb-4">
            {allCategories.map(cat => (
              <button
                key={cat.name}
                onClick={() => { setActiveCategory(cat.name); setVisibleCount(12); }}
                className={`flex-shrink-0 px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all border ${
                  activeCategory === cat.name 
                    ? 'bg-brand-gold text-black border-brand-gold' 
                    : 'bg-transparent text-gray-300 border-gray-600 hover:border-brand-gold hover:text-brand-gold'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* 2. Desktop Sidebar / Mobile Filter Trigger */}
          <div className="w-full md:w-1/4 flex-shrink-0">
            {/* Mobile Filter Button */}
            <button 
              onClick={() => setIsFilterOpen(true)}
              className="w-full md:hidden flex items-center justify-center gap-2 bg-white border border-gray-200 py-3 rounded-lg font-bold uppercase tracking-widest text-sm text-black mb-6"
            >
              <Filter className="w-4 h-4" /> Filter & Sort
            </button>

            {/* Desktop Sidebar (Hidden on Mobile, or shown in Drawer) */}
            <div className={`
              fixed inset-0 z-50 bg-black/50 backdrop-blur-sm md:static md:bg-transparent md:block
              ${isFilterOpen ? 'block' : 'hidden'}
            `}>
              <div className={`
                absolute bottom-0 left-0 right-0 bg-white p-6 rounded-t-3xl h-[80vh] overflow-y-auto
                md:static md:p-0 md:h-auto md:bg-transparent md:rounded-none md:overflow-visible
              `}>
                <div className="flex justify-between items-center md:hidden mb-6">
                  <h3 className="font-bold uppercase tracking-widest text-lg">Filters</h3>
                  <button onClick={() => setIsFilterOpen(false)} className="text-gray-500 font-bold">Done</button>
                </div>

                <div className="space-y-8">
                  {/* Search Bar */}
                  <div>
                    <h4 className="font-bold uppercase tracking-widest text-sm mb-4 border-b border-gray-200 pb-2">Search</h4>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input 
                        type="text" 
                        placeholder="Search products..." 
                        value={searchQuery}
                        onChange={(e) => { setSearchQuery(e.target.value); setVisibleCount(12); }}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-gold focus:border-brand-gold text-sm text-black"
                      />
                    </div>
                  </div>

                  {/* Category Filter List */}
                  <div>
                    <h4 className="font-bold uppercase tracking-widest text-sm mb-4 border-b border-gray-200 pb-2">Categories</h4>
                    <div className="space-y-2">
                      {allCategories.map(cat => (
                        <label key={cat.name} className="flex items-center gap-3 cursor-pointer group">
                          <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${activeCategory === cat.name ? 'bg-black border-black' : 'border-gray-300 group-hover:border-black'}`}>
                            {activeCategory === cat.name && <Check className="w-3 h-3 text-white" />}
                          </div>
                          <input 
                            type="radio" 
                            name="category" 
                            className="hidden" 
                            checked={activeCategory === cat.name}
                            onChange={() => { setActiveCategory(cat.name); setVisibleCount(12); }} 
                          />
                          <span className={`text-sm font-medium ${activeCategory === cat.name ? 'text-black font-bold' : 'text-gray-600 group-hover:text-black'}`}>
                            {cat.name}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Wholesale Toggle */}
                  <div>
                     <h4 className="font-bold uppercase tracking-widest text-sm mb-4 border-b border-gray-200 pb-2">Availability</h4>
                     <label className="flex items-center justify-between cursor-pointer">
                        <span className="text-sm font-medium text-gray-700">Wholesale Available</span>
                        <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                            <input type="checkbox" name="toggle" id="toggle" checked={isWholesaleOnly} onChange={(e) => {setIsWholesaleOnly(e.target.checked); setVisibleCount(12);}} className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer border-gray-300 checked:right-0 checked:border-brand-gold checked:bg-brand-gold transition-all duration-300" style={{ right: isWholesaleOnly ? '0' : '20px' }}/>
                            <label htmlFor="toggle" className={`toggle-label block overflow-hidden h-5 rounded-full bg-gray-300 cursor-pointer ${isWholesaleOnly ? 'bg-brand-gold/30' : ''}`}></label>
                        </div>
                     </label>
                  </div>
                  
                  {/* Sorting (Mobile Only, Desktop uses top right) */}
                  <div className="md:hidden">
                    <h4 className="font-bold uppercase tracking-widest text-sm mb-4 border-b border-gray-200 pb-2">Sort By</h4>
                    <select 
                      value={sortMethod}
                      onChange={(e) => setSortMethod(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-black focus:border-black block p-2.5 outline-none"
                    >
                      <option value="newest">Newest Arrivals</option>
                      <option value="price_low">Price: Low to High</option>
                      <option value="price_high">Price: High to Low</option>
                    </select>
                  </div>

                </div>
              </div>
            </div>
          </div>

          {/* 3. Product Grid */}
          <div className="w-full md:w-3/4">
            
            {/* Desktop Sorting Header */}
            <div className="hidden md:flex justify-between items-center mb-6">
              <span className="text-sm text-gray-500 font-medium">Showing {filteredProducts.length} results</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold uppercase tracking-widest text-gray-400">Sort:</span>
                <select 
                  value={sortMethod}
                  onChange={(e) => setSortMethod(e.target.value)}
                  className="bg-transparent border-none text-black font-bold uppercase tracking-widest text-sm focus:ring-0 cursor-pointer outline-none"
                >
                  <option value="newest">Newest Arrivals</option>
                  <option value="price_low">Price: Low to High</option>
                  <option value="price_high">Price: High to Low</option>
                </select>
              </div>
            </div>

            {/* Grid */}
            {visibleProducts.length > 0 ? (
              <>
                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                  {visibleProducts.map(product => (
                    <MarketplaceCard key={product.id} product={product} />
                  ))}
                </div>

                {/* Load More */}
                {hasMore && (
                  <div className="mt-12 text-center">
                    <button 
                      onClick={() => setVisibleCount(prev => prev + 12)}
                      className="inline-flex items-center justify-center px-8 py-3 border-2 border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-black font-bold uppercase tracking-widest text-sm rounded-full transition-colors"
                    >
                      Load More Products
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-24 bg-white rounded-2xl border border-gray-100">
                <h3 className="text-xl font-bold uppercase tracking-widest text-black mb-2">No Products Found</h3>
                <p className="text-gray-500 mb-6">We couldn't find any products matching your current filters.</p>
                <button 
                  onClick={() => { setActiveCategory('All'); setIsWholesaleOnly(false); setSearchQuery(''); }}
                  className="px-6 py-2 bg-black text-white font-bold uppercase tracking-widest text-sm rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </>
  )
}
