'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ShoppingCart, Package } from 'lucide-react'
import { useCart } from '@/components/providers/CartProvider'

export interface WholesaleCardProps {
  product: {
    id: string
    name: string
    wholesale_price: number | null
    wholesale_moq: number | null
    stock_count: number
    image_url: string | null
    unit_type?: string | null
  }
}

export function WholesaleCard({ product }: WholesaleCardProps) {
  const { addToCart } = useCart()
  const moq = product.wholesale_moq || 1
  const [quantity, setQuantity] = useState(moq)
  
  const currentPrice = product.wholesale_price || 0

  const handleAddToCart = () => {
    // Basic simulation for prototype: calling addToCart N times.
    const cartProduct = {
      id: `${product.id}_bulk`,
      name: `${product.name} (Bulk)`,
      retail_price: product.wholesale_price,
      image_url: product.image_url,
      unit_type: product.unit_type,
      wholesale_moq: product.wholesale_moq
    }
    
    for (let i = 0; i < quantity; i++) {
      addToCart(cartProduct)
    }
    alert(`Added ${quantity} units to bulk order!`)
  }

  return (
    <div className="flex flex-col sm:flex-row items-center bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow duration-300 p-4 gap-6">
      
      {/* Image Area */}
      <Link href={`/product/${product.id}`} className="w-full aspect-square sm:w-32 sm:h-32 sm:aspect-auto bg-gray-100 rounded-lg relative overflow-hidden flex-shrink-0 block hover:opacity-90 transition-opacity">
        {product.image_url ? (
          <Image 
            src={product.image_url} 
            alt={product.name} 
            fill 
            unoptimized
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-300">
            <Package className="w-8 h-8 opacity-40" />
          </div>
        )}
      </Link>

      {/* Product Details */}
      <div className="flex-1 w-full">
        <Link href={`/product/${product.id}`} className="block w-fit">
          <h3 className="text-lg font-black text-black uppercase tracking-wider mb-1 line-clamp-1 hover:text-brand-gold transition-colors">
            {product.name}
          </h3>
        </Link>
        
        <div className="flex flex-wrap items-center gap-4 mt-2">
          <div className="flex items-baseline">
            <span className="text-2xl font-bold text-brand-gold tracking-tight">
              ¥{currentPrice.toLocaleString()}
            </span>
            <span className="text-sm font-bold text-gray-400 ml-1 uppercase">
              / {product.unit_type || 'piece'}
            </span>
          </div>
          
          <div className="px-3 py-1 bg-black text-white text-xs font-bold uppercase tracking-widest rounded-md">
            MOQ: {moq} {product.unit_type || 'units'}
          </div>
        </div>

        <div className="mt-2 text-xs text-gray-500 font-medium">
          Current Stock: {product.stock_count} units available
        </div>
      </div>

      {/* Action Area */}
      <div className="w-full sm:w-auto flex flex-col items-center gap-3 border-t sm:border-t-0 sm:border-l border-gray-100 pt-4 sm:pt-0 sm:pl-6">
        <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden h-10 w-full sm:w-32">
          <button 
            onClick={() => setQuantity(Math.max(moq, quantity - 1))}
            className="px-3 h-full bg-gray-50 hover:bg-gray-100 text-gray-600 font-bold transition-colors"
          >-</button>
          <input 
            type="number" 
            value={quantity}
            onChange={(e) => {
              const val = parseInt(e.target.value) || moq;
              setQuantity(Math.max(moq, val));
            }}
            className="w-full h-full text-center font-bold text-sm outline-none bg-transparent"
          />
          <button 
            onClick={() => setQuantity(quantity + 1)}
            className="px-3 h-full bg-gray-50 hover:bg-gray-100 text-gray-600 font-bold transition-colors"
          >+</button>
        </div>
        
        <button 
          onClick={handleAddToCart}
          className="w-full h-10 bg-brand-gold hover:bg-yellow-500 text-black font-black uppercase tracking-widest text-xs rounded-lg flex items-center justify-center gap-2 transition-colors px-4"
        >
          <ShoppingCart className="w-4 h-4" /> Bulk Add
        </button>
      </div>

    </div>
  )
}
