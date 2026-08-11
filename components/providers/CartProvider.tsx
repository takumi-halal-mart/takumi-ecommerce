'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

export interface CartItem {
  cartItemId: string
  product: {
    id: string
    name: string
    retail_price: number | null
    image_url: string | null
    unit_type?: string | null
    wholesale_moq?: number | null
    wholesale_price?: number | null
    is_wholesale?: boolean
    selected_flavor?: string | null
    flavor_options?: string[] | null
    allowed_payment_method?: 'both' | 'stripe_only' | 'whatsapp_only'
  }
  quantity: number
}

interface CartContextType {
  items: CartItem[]
  addToCart: (product: CartItem['product']) => void
  removeFromCart: (cartItemId: string) => void
  updateQuantity: (cartItemId: string, quantity: number) => void
  updateFlavor: (cartItemId: string, newFlavor: string) => void
  clearCart: () => void
  keepOnlyWhatsAppItems: () => void
  cartCount: number
  isLoaded: boolean
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  // Load from local storage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('takumi_cart')
      if (stored) {
        setItems(JSON.parse(stored))
      }
    } catch (error) {
      console.error('Error parsing cart from local storage', error)
    }
    setIsLoaded(true)
  }, [])

  // Save to local storage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('takumi_cart', JSON.stringify(items))
    }
  }, [items, isLoaded])

  const addToCart = (product: CartItem['product']) => {
    setItems(current => {
      const newCartItemId = `${product.id}-${product.selected_flavor || 'none'}`
      
      // Look for existing item using either the new cartItemId or fallback to legacy id matching
      const existingItem = current.find(item => 
        (item.cartItemId && item.cartItemId === newCartItemId) || 
        (!item.cartItemId && item.product.id === product.id && item.product.selected_flavor === product.selected_flavor)
      )

      if (existingItem) {
        return current.map(item =>
          ((item.cartItemId && item.cartItemId === newCartItemId) || 
           (!item.cartItemId && item.product.id === product.id && item.product.selected_flavor === product.selected_flavor))
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...current, { cartItemId: newCartItemId, product, quantity: 1 }]
    })
  }

  const removeFromCart = (cartItemId: string) => {
    // If they pass an old productId without flavor, it'll still try to match it, or fallback.
    // For backwards compat with old saved carts, check if item.cartItemId matches, OR if item.product.id matches (if cartItemId is missing)
    setItems(current => current.filter(item => {
      if (item.cartItemId) return item.cartItemId !== cartItemId
      return item.product.id !== cartItemId
    }))
  }

  const updateQuantity = (cartItemId: string, quantity: number) => {
    setItems(current => {
      if (quantity <= 0) return current.filter(item => item.cartItemId !== cartItemId)
      return current.map(item => 
        item.cartItemId === cartItemId ? { ...item, quantity } : item
      )
    })
  }

  const updateFlavor = (cartItemId: string, newFlavor: string) => {
    setItems(current => 
      current.map(item => 
        item.cartItemId === cartItemId 
          ? { ...item, product: { ...item.product, selected_flavor: newFlavor } }
          : item
      )
    )
  }

  const clearCart = () => {
    setItems([])
  }

  const keepOnlyWhatsAppItems = () => {
    setItems(current => current.filter(item => item.product.allowed_payment_method === 'whatsapp_only'))
  }

  const cartCount = items.reduce((total, item) => total + item.quantity, 0)

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, updateFlavor, clearCart, keepOnlyWhatsAppItems, cartCount, isLoaded }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
