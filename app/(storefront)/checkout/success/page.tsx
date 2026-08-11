'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { CheckCircle, AlertCircle, ArrowRight } from 'lucide-react'
import { useCart } from '@/components/providers/CartProvider'

export default function CheckoutSuccessPage() {
  const { items, clearCart, keepOnlyWhatsAppItems, isLoaded } = useCart()
  const [hasRemainingWhatsAppItems, setHasRemainingWhatsAppItems] = useState(false)
  const [hasProcessed, setHasProcessed] = useState(false)

  useEffect(() => {
    if (!isLoaded || hasProcessed) return;

    // Check if there are WhatsApp items left to be checked out
    const whatsappItems = items.filter(item => item.product.allowed_payment_method === 'whatsapp_only')
    
    if (whatsappItems.length > 0) {
      setHasRemainingWhatsAppItems(true)
      keepOnlyWhatsAppItems() // Only removes the stripe ones
      sessionStorage.setItem('takumi_paid_delivery_fee', 'true')
    } else {
      clearCart()
      localStorage.removeItem('takumi_cart')
      sessionStorage.removeItem('takumi_paid_delivery_fee')
      sessionStorage.removeItem('takumi_checkout_form')
    }
    
    setHasProcessed(true)
  }, [isLoaded, items, hasProcessed, keepOnlyWhatsAppItems, clearCart])

  return (
    <div className="bg-[#F8F9FA] min-h-screen pt-24 pb-24 px-4 flex items-center justify-center">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-500" />
        </div>
        <h1 className="text-3xl font-black text-black mb-4 tracking-tight">Payment Successful!</h1>
        
        {hasRemainingWhatsAppItems ? (
          <>
            <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200 mb-8 text-left">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-5 h-5 text-yellow-600" />
                <h3 className="font-bold text-yellow-800">You're not done yet!</h3>
              </div>
              <p className="text-sm text-yellow-700">
                Your card payment was successful, but you still have items in your cart that require a manual WhatsApp order.
              </p>
            </div>
            <Link 
              href="/cart" 
              className="inline-flex items-center justify-center w-full bg-[#D4AF37] text-black py-4 rounded-full font-bold uppercase tracking-widest hover:bg-yellow-500 transition-all hover:scale-[1.02] shadow-lg shadow-[#D4AF37]/20"
            >
              Complete WhatsApp Order <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </>
        ) : (
          <>
            <p className="text-gray-500 mb-8 font-medium leading-relaxed">
              Thank you for your order! We have received your payment securely through Stripe and will begin processing your items right away.
            </p>
            <Link 
              href="/shop" 
              className="inline-flex items-center justify-center w-full bg-[#D4AF37] text-black py-4 rounded-full font-bold uppercase tracking-widest hover:bg-yellow-500 transition-all hover:scale-[1.02] shadow-lg shadow-[#D4AF37]/20"
            >
              Continue Shopping
            </Link>
          </>
        )}
      </div>
    </div>
  )
}
