'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ShoppingCart, ShoppingBag } from 'lucide-react'
import { useCart } from '@/components/providers/CartProvider'

export interface MarketplaceCardProps {
  product: {
    id: string
    name: string
    retail_price: number | null
    wholesale_price: number | null
    stock_count: number
    image_url: string | null
    unit_type?: string | null
  }
}

export function MarketplaceCard({ product }: MarketplaceCardProps) {
  const { addToCart } = useCart()
  const currentPrice = product.retail_price || 0
  
  // Visual mockup for marketplace "sale" urgency (+20%)
  const oldPrice = Math.round(currentPrice * 1.2)
  
  // Calculate a visual stock width (assuming ~50 is "full" for the progress bar visual)
  const stockPercentage = Math.min(Math.max((product.stock_count / 50) * 100, 5), 100)

  return (
    <div className="group bg-white rounded-xl border border-gray-100 p-3 hover:shadow-md transition-shadow duration-300 flex flex-col cursor-pointer">
      
      {/* Image Area */}
      <div className="relative">
        <Link href={`/product/${product.id}`} className="aspect-square bg-gray-100 rounded-lg relative overflow-hidden mb-3 block">
          {product.image_url ? (
            <Image 
              src={product.image_url} 
              alt={product.name} 
              fill 
              unoptimized
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-gray-300">
              <ShoppingBag className="w-10 h-10 opacity-40" />
            </div>
          )}
        </Link>
        
        {/* Cart Icon */}
        <button 
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            addToCart(product)
          }}
          className="absolute top-2 right-2 w-7 h-7 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm hover:text-black hover:scale-110 transition-all z-10 text-gray-400"
          aria-label="Add to cart"
        >
          <ShoppingCart className="w-4 h-4" />
        </button>
      </div>

      {/* Text & Content Area */}
      <div className="flex flex-col flex-grow">
        
        {/* Product Name (Forced to 2 lines max) */}
        <Link href={`/product/${product.id}`} className="block">
          <h3 className="text-sm text-gray-800 leading-snug line-clamp-2 mb-3 min-h-[2.5rem] hover:text-blue-600 transition-colors" title={product.name}>
            {product.name}
          </h3>
        </Link>

        {/* Pricing */}
        <div className="mt-auto mb-3 flex flex-wrap items-baseline gap-x-2">
          <div className="flex items-baseline">
            <span className="text-lg font-bold text-black tracking-tight">
              ¥{currentPrice.toLocaleString()}
            </span>
            <span className="text-xs font-normal text-gray-400 ml-1">
              / {product.unit_type || 'piece'}
            </span>
          </div>
          <span className="text-xs text-red-400 line-through">
            ¥{oldPrice.toLocaleString()}
          </span>
        </div>

        {/* Stock Progress Bar */}
        <div className="flex items-center space-x-2">
          <div className="flex-1 bg-gray-200 h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-black h-1.5 rounded-full transition-all duration-1000 ease-out" 
              style={{ width: `${stockPercentage}%` }}
            ></div>
          </div>
          <span className="text-[10px] text-gray-500 font-medium whitespace-nowrap">
            Only {product.stock_count} {product.unit_type === 'piece' || product.unit_type === 'bottle' ? 'units' : 'packs'} left!
          </span>
        </div>
        
      </div>
      
    </div>
  )
}
