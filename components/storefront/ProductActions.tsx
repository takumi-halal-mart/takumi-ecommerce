'use client'

import React, { useState } from 'react'
import { ShoppingCart, Plus, Minus, CheckCircle } from 'lucide-react'
import { useCart } from '@/components/providers/CartProvider'
import { StorefrontProduct } from '@/app/actions/storefront'

interface ProductActionsProps {
  product: StorefrontProduct
}

export function ProductActions({ product }: ProductActionsProps) {
  const { addToCart } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)

  const handleAddToCart = () => {
    // Add multiple quantities by calling addToCart 'quantity' times, 
    // or better, if cart supported quantity directly. Since our cart 
    // addToCart adds 1 or increments if exists, we can loop it or we can
    // add a new addManyToCart function. Let's just call it multiple times for now,
    // or just add 1 at a time as typical for simple carts, but since we have a quantity selector:
    for (let i = 0; i < quantity; i++) {
      addToCart(product)
    }
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4 mt-8">
      {/* Quantity Selector */}
      <div className="flex items-center bg-gray-50 rounded-full border border-gray-200 h-14 px-2 w-full sm:w-auto shrink-0">
        <button 
          onClick={() => setQuantity(Math.max(1, quantity - 1))}
          className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-black transition-colors rounded-full"
          aria-label="Decrease quantity"
        >
          <Minus className="w-4 h-4" />
        </button>
        <span className="w-12 text-center text-lg font-bold text-black">{quantity}</span>
        <button 
          onClick={() => setQuantity(quantity + 1)}
          className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-black transition-colors rounded-full"
          aria-label="Increase quantity"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Add to Cart Button */}
      <button 
        onClick={handleAddToCart}
        disabled={product.stock_count <= 0 || added}
        className={`flex-1 h-14 rounded-full font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
          added 
            ? 'bg-green-500 text-white shadow-lg shadow-green-500/20' 
            : product.stock_count <= 0
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-[#D4AF37] text-black hover:bg-yellow-500 hover:scale-[1.02] shadow-lg shadow-[#D4AF37]/20'
        }`}
      >
        {added ? (
          <>
            <CheckCircle className="w-5 h-5" /> Added to Cart
          </>
        ) : product.stock_count <= 0 ? (
          'Out of Stock'
        ) : (
          <>
            <ShoppingCart className="w-5 h-5" /> Add to Cart
          </>
        )}
      </button>
    </div>
  )
}
