'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

export interface CartItem {
  product: {
    id: string
    name: string
    retail_price: number | null
    image_url: string | null
    unit_type?: string | null
    wholesale_moq?: number | null
  }
  quantity: number
}

interface CartContextType {
  items: CartItem[]
  addToCart: (product: CartItem['product']) => void
  removeFromCart: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  cartCount: number
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
      const existingItem = current.find(item => item.product.id === product.id)
      if (existingItem) {
        return current.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...current, { product, quantity: 1 }]
    })
  }

  const removeFromCart = (productId: string) => {
    setItems(current => current.filter(item => item.product.id !== productId))
  }

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }
    setItems(current =>
      current.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    )
  }

  const clearCart = () => {
    setItems([])
  }

  const cartCount = items.reduce((total, item) => total + item.quantity, 0)

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, cartCount }}>
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
