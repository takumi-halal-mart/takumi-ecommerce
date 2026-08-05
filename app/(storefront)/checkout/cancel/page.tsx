'use client'

import React from 'react'
import Link from 'next/link'
import { XCircle } from 'lucide-react'

export default function CheckoutCancelPage() {
  return (
    <div className="bg-[#F8F9FA] min-h-screen pt-24 pb-24 px-4 flex items-center justify-center">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <XCircle className="w-10 h-10 text-red-500" />
        </div>
        <h1 className="text-3xl font-black text-black mb-4 tracking-tight">Payment Cancelled</h1>
        <p className="text-gray-500 mb-8 font-medium leading-relaxed">
          Your payment was cancelled or could not be completed. Don't worry, your cart items are still safely saved!
        </p>
        <div className="space-y-4">
          <Link 
            href="/cart" 
            className="inline-flex items-center justify-center w-full bg-black text-white py-4 rounded-full font-bold uppercase tracking-widest hover:bg-gray-900 transition-all hover:scale-[1.02] shadow-lg"
          >
            Return to Cart
          </Link>
          <Link 
            href="/contact" 
            className="inline-flex items-center justify-center w-full bg-transparent text-gray-500 py-4 rounded-full font-bold uppercase tracking-widest hover:text-black transition-colors"
          >
            Need Help?
          </Link>
        </div>
      </div>
    </div>
  )
}
