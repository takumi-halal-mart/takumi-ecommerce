'use client'

import React, { useEffect } from 'react'
import Link from 'next/link'
import { CheckCircle } from 'lucide-react'
import { useCart } from '@/components/providers/CartProvider'

export default function CheckoutSuccessPage() {
  const { clearCart } = useCart()

  useEffect(() => {
    // Wait slightly to ensure CartProvider has finished its initial local storage load,
    // otherwise the loaded items will overwrite the clearCart action.
    const timer = setTimeout(() => {
      clearCart()
      localStorage.removeItem('takumi_cart')
    }, 100)
    
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="bg-[#F8F9FA] min-h-screen pt-24 pb-24 px-4 flex items-center justify-center">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-500" />
        </div>
        <h1 className="text-3xl font-black text-black mb-4 tracking-tight">Payment Successful!</h1>
        <p className="text-gray-500 mb-8 font-medium leading-relaxed">
          Thank you for your order! We have received your payment securely through Stripe and will begin processing your items right away.
        </p>
        <Link 
          href="/shop" 
          className="inline-flex items-center justify-center w-full bg-[#D4AF37] text-black py-4 rounded-full font-bold uppercase tracking-widest hover:bg-yellow-500 transition-all hover:scale-[1.02] shadow-lg shadow-[#D4AF37]/20"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  )
}
