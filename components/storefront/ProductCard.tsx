import Image from 'next/image'
import { ShoppingCart, ShoppingBag } from 'lucide-react'

export interface ProductCardProps {
  product: {
    id: string
    name: string
    retail_price: number | null
    unit_type: string | null
    image_url: string | null
    category: string
  }
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="group flex flex-col bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
      
      {/* STRICT Square Image Container */}
      <div className="relative w-full aspect-square bg-gray-50 overflow-hidden">
        {product.image_url ? (
          <Image 
            src={product.image_url} 
            alt={product.name} 
            fill 
            unoptimized
            className="object-cover group-hover:scale-105 transition-transform duration-700"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-300">
            <ShoppingBag className="w-16 h-16 opacity-30" />
          </div>
        )}
        
        {/* Top Left Category Badge */}
        {product.category && (
          <div className="absolute top-3 left-3 px-3 py-1 bg-white/95 backdrop-blur-sm text-black text-[10px] font-bold uppercase tracking-widest rounded-full shadow-sm z-10 border border-gray-100/50">
            {product.category}
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="p-5 flex flex-col flex-grow bg-white">
        
        <div className="mb-4 flex-grow">
          {/* Truncated Name */}
          <h3 className="font-bold text-gray-900 leading-snug truncate group-hover:text-brand-gold transition-colors" title={product.name}>
            {product.name}
          </h3>
          {/* Unit Type */}
          <p className="text-gray-400 text-sm mt-1 uppercase tracking-wider font-medium">
            {product.unit_type || 'Unit'}
          </p>
        </div>
        
        {/* Footer Area: Price & Action */}
        <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-50">
          <p className="text-xl font-black text-black tracking-tight">
            ¥{product.retail_price?.toLocaleString() || 0}
          </p>
          
          {/* Add to Cart Button */}
          <button 
            type="button"
            className="w-10 h-10 flex items-center justify-center rounded-full bg-black text-white hover:bg-brand-gold hover:text-black hover:scale-110 transition-all shadow-md shrink-0"
            aria-label="Add to cart"
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  )
}
