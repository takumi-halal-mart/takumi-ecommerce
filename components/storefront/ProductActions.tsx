'use client'

import React, { useState, useEffect } from 'react'
import { ShoppingCart, Plus, Minus, CheckCircle, Package } from 'lucide-react'
import { useCart } from '@/components/providers/CartProvider'
import { StorefrontProduct } from '@/app/actions/storefront'

interface ProductActionsProps {
  product: StorefrontProduct
}

export function ProductActions({ product }: ProductActionsProps) {
  const { addToCart } = useCart()
  const [isWholesaleMode, setIsWholesaleMode] = useState(false)
  
  const defaultQuantity = isWholesaleMode ? (product.wholesale_moq || 1) : 1
  const [quantity, setQuantity] = useState<number | string>(defaultQuantity)
  const [added, setAdded] = useState(false)

  // When switching modes, adjust quantity bounds
  useEffect(() => {
    if (isWholesaleMode) {
      if (typeof quantity === 'string' || quantity < (product.wholesale_moq || 1)) {
        setQuantity(product.wholesale_moq || 1)
      }
    } else {
      setQuantity(1)
    }
  }, [isWholesaleMode, product.wholesale_moq])

  const handleAddToCart = () => {
    const finalQuantity = typeof quantity === 'string' || isNaN(quantity as number) 
      ? (isWholesaleMode ? (product.wholesale_moq || 1) : 1) 
      : Math.max(isWholesaleMode ? (product.wholesale_moq || 1) : 1, quantity as number)

    if (isWholesaleMode) {
      const cartProduct = {
        id: `${product.id}_bulk`,
        name: `${product.name} (Bulk)`,
        retail_price: product.wholesale_price,
        image_url: product.image_url,
        unit_type: product.unit_type,
        wholesale_moq: product.wholesale_moq
      }
      for (let i = 0; i < finalQuantity; i++) addToCart(cartProduct)
    } else {
      for (let i = 0; i < finalQuantity; i++) addToCart(product)
    }
    
    setQuantity(finalQuantity)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const currentPrice = isWholesaleMode ? product.wholesale_price : product.retail_price
  const priceDisplay = currentPrice ? `¥${currentPrice.toLocaleString('ja-JP')}` : 'N/A'

  // Determine actual numeric quantity for button disabled states
  const numericQuantity = typeof quantity === 'number' ? quantity : 0
  const isBelowMoq = isWholesaleMode && numericQuantity < (product.wholesale_moq || 1)

  return (
    <div className="flex flex-col gap-6">
      
      {/* Wholesale Upsell Engine */}
      {product.is_wholesale && product.wholesale_price && (
        <div className={`p-5 rounded-2xl border-2 transition-all duration-300 cursor-pointer ${isWholesaleMode ? 'border-brand-dark bg-brand-dark text-white shadow-xl scale-[1.02]' : 'border-gray-200 bg-white hover:border-gray-300'} `} onClick={() => setIsWholesaleMode(!isWholesaleMode)}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <Package className={`w-6 h-6 ${isWholesaleMode ? 'text-brand-gold' : 'text-gray-400'}`} />
              <span className="font-black uppercase tracking-widest text-sm">Buy in Bulk & Save</span>
            </div>
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${isWholesaleMode ? 'border-brand-gold bg-brand-gold' : 'border-gray-300'}`}>
              {isWholesaleMode && <CheckCircle className="w-4 h-4 text-brand-dark" />}
            </div>
          </div>
          <p className={`text-sm font-medium leading-relaxed ${isWholesaleMode ? 'text-gray-300' : 'text-gray-500'}`}>
            Switch to Commercial Pricing: <span className="font-bold text-brand-gold text-base">¥{product.wholesale_price.toLocaleString('ja-JP')} / {product.unit_type}</span>. (Minimum order: {product.wholesale_moq} units).
          </p>
        </div>
      )}

      {/* Action Strip (Sticky on mobile) */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 p-4 z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] md:relative md:bg-transparent md:border-0 md:p-0 md:shadow-none md:z-auto">
        <div className="max-w-7xl mx-auto flex gap-3">
          {/* Quantity Selector */}
          <div className="flex items-center bg-gray-50 rounded-full border border-gray-200 h-14 px-2 w-[140px] shrink-0 justify-between">
            <button 
              onClick={() => setQuantity(Math.max(isWholesaleMode ? (product.wholesale_moq || 1) : 1, numericQuantity - 1))}
              disabled={isWholesaleMode && numericQuantity <= (product.wholesale_moq || 1)}
              className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors shrink-0 ${isWholesaleMode && numericQuantity <= (product.wholesale_moq || 1) ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:text-black'}`}
            >
              <Minus className="w-4 h-4" />
            </button>
            <input 
              type="number"
              value={quantity}
              onChange={(e) => {
                if (e.target.value === '') {
                  setQuantity('');
                } else {
                  setQuantity(parseInt(e.target.value));
                }
              }}
              onBlur={() => {
                const min = isWholesaleMode ? (product.wholesale_moq || 1) : 1;
                setQuantity(Math.max(min, numericQuantity));
              }}
              className="w-12 text-center text-lg font-bold text-black bg-transparent outline-none m-0 p-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
            <button 
              onClick={() => setQuantity(numericQuantity + 1)}
              className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-black transition-colors rounded-full shrink-0"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Add to Cart Button */}
          <button 
            onClick={handleAddToCart}
            disabled={product.stock_count <= 0 || added || isBelowMoq || quantity === ''}
            className={`flex-1 h-14 rounded-full font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 text-xs sm:text-sm ${
              added 
                ? 'bg-green-500 text-white shadow-lg shadow-green-500/20' 
                : product.stock_count <= 0 || isBelowMoq || quantity === ''
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-black text-brand-gold hover:bg-gray-900 shadow-xl shadow-black/10'
            }`}
          >
            {added ? (
              <>
                <CheckCircle className="w-5 h-5" /> Added
              </>
            ) : product.stock_count <= 0 ? (
              'Out of Stock'
            ) : (
              <>
                <ShoppingCart className="w-5 h-5" /> Add - {priceDisplay}
              </>
            )}
          </button>
        </div>
      </div>
      
    </div>
  )
}
