'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Trash2, Plus, Minus, ArrowLeft, ShoppingBag, CheckCircle, Truck, Tag, X, CreditCard, MessageCircle } from 'lucide-react'
import { useCart } from '@/components/providers/CartProvider'
import { getStoreSettings, StoreSettings, validateCouponCode } from '@/app/actions/storefront'
import { placeOrder } from '@/app/actions/orders'

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, clearCart, cartCount } = useCart()
  const router = useRouter()
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [settings, setSettings] = useState<StoreSettings | null>(null)
  const [paymentMethod, setPaymentMethod] = useState<'WhatsApp' | 'Stripe'>('WhatsApp')

  // Coupon State
  const [couponCode, setCouponCode] = useState('')
  const [validatingCoupon, setValidatingCoupon] = useState(false)
  const [appliedCoupon, setAppliedCoupon] = useState<{
    id: string
    code: string
    discount_type: string
    discount_value: number
  } | null>(null)
  const [couponError, setCouponError] = useState<string | null>(null)

  React.useEffect(() => {
    async function fetchSettings() {
      const res = await getStoreSettings()
      if (res.success && res.data) {
        setSettings(res.data)
      }
    }
    fetchSettings()
  }, [])

  const subtotal = items.reduce((total, item) => {
    return total + ((item.product.retail_price || 0) * item.quantity)
  }, 0)

  let discountAmount = 0
  if (appliedCoupon) {
    if (appliedCoupon.discount_type === 'percentage') {
      discountAmount = Math.floor(subtotal * (appliedCoupon.discount_value / 100))
    } else {
      discountAmount = appliedCoupon.discount_value
    }
  }

  const subtotalAfterDiscount = Math.max(0, subtotal - discountAmount)

  const deliveryFee = settings 
    ? (subtotalAfterDiscount >= settings.free_shipping_threshold ? 0 : settings.delivery_fee)
    : 0 // Default to 0 while loading or on error
  
  const finalTotal = subtotalAfterDiscount + deliveryFee

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return
    setValidatingCoupon(true)
    setCouponError(null)

    const result = await validateCouponCode(couponCode, subtotal)
    
    if (result.success && result.coupon) {
      setAppliedCoupon(result.coupon)
      setCouponCode('')
    } else {
      setCouponError(result.error || 'Invalid coupon')
    }
    
    setValidatingCoupon(false)
  }

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null)
    setCouponError(null)
  }

  const handleCheckout = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    
    if (paymentMethod === 'Stripe') {
      // Mock Stripe redirect for now
      setError('Stripe Gateway is currently in Sandbox mode. Please use WhatsApp Checkout for live orders.')
      setIsSubmitting(false)
      return
    }
    
    const formData = new FormData(e.currentTarget)
    formData.append('paymentMethod', paymentMethod)
    
    // Front-end LocalStorage validation to obscure backend phone checks
    if (appliedCoupon) {
      try {
        const usedCoupons = JSON.parse(localStorage.getItem('takumi_used_coupons') || '[]')
        if (usedCoupons.includes(appliedCoupon.id)) {
          setError('You have already used this coupon.')
          setIsSubmitting(false)
          return
        }
      } catch (e) {
        // Ignore parse errors
      }
    }
    
    // We pass the coupon ID if applied
    const result = await placeOrder(formData, items, finalTotal, appliedCoupon?.id)
    
    if (result.success) {
      setSuccess(true)
      
      // Save coupon usage to localStorage to prevent browser-level reuse
      if (appliedCoupon) {
        try {
          const usedCoupons = JSON.parse(localStorage.getItem('takumi_used_coupons') || '[]')
          if (!usedCoupons.includes(appliedCoupon.id)) {
            usedCoupons.push(appliedCoupon.id)
            localStorage.setItem('takumi_used_coupons', JSON.stringify(usedCoupons))
          }
        } catch (e) {
          // Ignore
        }
      }
      
      // WhatsApp Pre-filled message generation
      if (settings?.whatsapp_number) {
        const customerName = formData.get('customerName') as string
        const customerAddress = formData.get('deliveryAddress') as string
        
        let message = `*NEW ORDER - Takumi Marketplace*\n\n`
        message += `*Customer:* ${customerName}\n`
        message += `*Delivery:* ${customerAddress}\n\n`
        message += `*Items Ordered:*\n`
        
        items.forEach(item => {
          message += `- ${item.quantity}x ${item.product.name} (¥${(item.quantity * (item.product.retail_price || 0)).toLocaleString('ja-JP')})\n`
        })
        
        message += `\n*Subtotal:* ¥${subtotal.toLocaleString('ja-JP')}\n`
        if (discountAmount > 0) message += `*Discount:* -¥${discountAmount.toLocaleString('ja-JP')} (${appliedCoupon?.code})\n`
        message += `*Delivery Fee:* ¥${deliveryFee.toLocaleString('ja-JP')}\n`
        message += `*FINAL TOTAL:* ¥${finalTotal.toLocaleString('ja-JP')}\n\n`
        message += `_Order ID: ${result.orderId}_`
        
        const encodedMessage = encodeURIComponent(message)
        const waUrl = `https://wa.me/${settings.whatsapp_number.replace(/[^0-9]/g, '')}?text=${encodedMessage}`
        
        // Short delay for UX then redirect
        setTimeout(() => {
          window.location.href = waUrl
          clearCart()
        }, 1500)
      } else {
        clearCart()
        setTimeout(() => router.push('/shop'), 2000)
      }
    } else {
      setError(result.error || 'Failed to place order. Please try again.')
      setIsSubmitting(false)
    }
  }

  if (success) {
    return (
      <div className="bg-[#F8F9FA] min-h-screen pt-24 pb-24 px-4 flex items-center justify-center">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center">
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
          <h1 className="text-3xl font-black text-black mb-4 tracking-tight">Order Placed!</h1>
          <p className="text-gray-500 mb-8 font-medium">
            Thank you for shopping with Takumi. We have received your order and will contact you via WhatsApp shortly to confirm delivery.
          </p>
          <Link 
            href="/shop" 
            className="inline-flex items-center justify-center w-full bg-black text-white py-4 rounded-full font-bold uppercase tracking-widest hover:bg-gray-900 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-[#F8F9FA] min-h-screen pt-24 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl md:text-4xl font-black text-black uppercase tracking-tight">Your Cart</h1>
          <Link href="/shop" className="text-sm font-bold text-gray-500 uppercase tracking-widest hover:text-[#D4AF37] transition-colors flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Keep Shopping
          </Link>
        </div>

        {items.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center flex flex-col items-center">
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
              <ShoppingBag className="w-10 h-10 text-gray-300" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2 tracking-tight">Your cart is empty</h2>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              Looks like you haven't added any premium Halal groceries to your cart yet. Discover our fresh selections!
            </p>
            <Link 
              href="/shop" 
              className="bg-[#D4AF37] text-black px-10 py-4 rounded-full font-bold uppercase tracking-widest hover:bg-yellow-500 transition-colors"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-12 gap-10">
            {/* Cart Items List */}
            <div className="lg:col-span-7 space-y-4">
              {items.map((item) => (
                <div key={item.product.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-4 items-center">
                  <div className="relative w-24 h-24 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0 border border-gray-100">
                    {item.product.image_url ? (
                      <Image src={item.product.image_url} alt={item.product.name} fill className="object-cover" unoptimized />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <ShoppingBag className="w-8 h-8 text-gray-300" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-grow text-center sm:text-left w-full">
                    <h3 className="text-lg font-bold text-gray-900 leading-tight mb-1">{item.product.name}</h3>
                    <div className="text-sm text-gray-500 font-medium mb-3">
                      ¥{item.product.retail_price?.toLocaleString()} / {item.product.unit_type || 'piece'}
                    </div>
                    
                    <div className="flex items-center justify-center sm:justify-start gap-4">
                      {/* Quantity Selector */}
                      <div className="flex items-center bg-gray-50 rounded-full border border-gray-200">
                        <button 
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-black transition-colors rounded-l-full"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center text-sm font-bold text-black">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-black transition-colors rounded-r-full"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      
                      <button 
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors p-2"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="sm:text-right font-black text-xl text-black">
                    ¥{((item.product.retail_price || 0) * item.quantity).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>

            {/* Checkout Sidebar */}
            <div className="lg:col-span-5">
              <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 sticky top-32">
                <h2 className="text-xl font-black text-black uppercase tracking-widest border-b border-gray-100 pb-4 mb-6">
                  Order Summary
                </h2>
                
                {/* Coupon Section */}
                <div className="mb-6 pt-6 border-t border-gray-100">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2 ml-1">Promo Code</label>
                  
                  {!appliedCoupon ? (
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input 
                          type="text" 
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                          placeholder="e.g. TAKUMI10"
                          className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 font-mono text-sm uppercase transition-all"
                        />
                      </div>
                      <button 
                        type="button"
                        onClick={handleApplyCoupon}
                        disabled={!couponCode.trim() || validatingCoupon}
                        className="px-6 bg-black text-white font-bold uppercase tracking-widest text-xs rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50"
                      >
                        {validatingCoupon ? '...' : 'Apply'}
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl p-3">
                      <div className="flex items-center gap-2">
                        <Tag className="w-4 h-4 text-green-600" />
                        <span className="font-mono font-bold text-green-700">{appliedCoupon.code}</span>
                      </div>
                      <button 
                        type="button"
                        onClick={handleRemoveCoupon}
                        className="p-1 text-green-600 hover:bg-green-100 rounded-md transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                  {couponError && <p className="text-red-500 text-xs mt-2 ml-1">{couponError}</p>}
                </div>

                <div className="space-y-3 mb-6 pt-6 border-t border-gray-100">
                  <div className="flex justify-between text-gray-600 font-medium">
                    <span>Subtotal ({cartCount} items)</span>
                    <span>¥{subtotal.toLocaleString()}</span>
                  </div>
                  
                  {appliedCoupon && (
                    <div className="flex justify-between text-green-600 font-medium">
                      <span>Discount ({appliedCoupon.code})</span>
                      <span>-¥{discountAmount.toLocaleString()}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-gray-600 font-medium">
                    <span>Delivery Fee</span>
                    {!settings ? (
                      <span className="text-gray-400">Loading...</span>
                    ) : deliveryFee === 0 ? (
                      <span className="text-green-600 uppercase font-bold text-sm tracking-widest">Free</span>
                    ) : (
                      <span>¥{deliveryFee.toLocaleString()}</span>
                    )}
                  </div>
                  {settings && deliveryFee > 0 && (
                    <div className="flex items-center gap-2 text-xs font-bold text-[#D4AF37] bg-yellow-50 p-3 rounded-lg border border-yellow-100 uppercase tracking-widest mt-2">
                      <Truck className="w-4 h-4" /> 
                      You're only ¥{(settings.free_shipping_threshold - subtotalAfterDiscount).toLocaleString()} away from Free Shipping!
                    </div>
                  )}
                </div>
                
                <div className="flex justify-between items-end border-t border-gray-100 pt-4 mb-8">
                  <span className="text-gray-900 font-bold uppercase tracking-widest text-sm">Total</span>
                  <span className="text-3xl font-black text-black tracking-tight">¥{finalTotal.toLocaleString()}</span>
                </div>

                <form onSubmit={handleCheckout} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-1.5 ml-1">Full Name</label>
                    <input 
                      type="text" 
                      name="customerName"
                      required
                      placeholder="e.g. Taro Yamada"
                      className="w-full bg-gray-50 border border-gray-200 text-black px-4 py-3 rounded-xl outline-none focus:bg-white focus:border-black transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-1.5 ml-1">Phone Number</label>
                    <input 
                      type="tel" 
                      name="customerPhone"
                      required
                      placeholder="e.g. 090-1234-5678"
                      className="w-full bg-gray-50 border border-gray-200 text-black px-4 py-3 rounded-xl outline-none focus:bg-white focus:border-black transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-1.5 ml-1">Delivery Address</label>
                    <textarea 
                      name="deliveryAddress"
                      required
                      rows={3}
                      placeholder="Include postal code, prefecture, city, and building name..."
                      className="w-full bg-gray-50 border border-gray-200 text-black px-4 py-3 rounded-xl outline-none focus:bg-white focus:border-black transition-colors resize-none"
                    ></textarea>
                  </div>
                  
                  {/* Payment Method Selector */}
                  <div className="pt-2">
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-3 ml-1">Payment Method</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('WhatsApp')}
                        className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                          paymentMethod === 'WhatsApp' 
                            ? 'border-green-500 bg-green-50 text-green-700 shadow-sm' 
                            : 'border-gray-100 bg-white hover:border-gray-200 text-gray-500'
                        }`}
                      >
                        <MessageCircle className={`w-6 h-6 mb-2 ${paymentMethod === 'WhatsApp' ? 'text-green-500' : 'text-gray-400'}`} />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-center">WhatsApp</span>
                      </button>
                      
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('Stripe')}
                        className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                          paymentMethod === 'Stripe' 
                            ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-sm' 
                            : 'border-gray-100 bg-white hover:border-gray-200 text-gray-500'
                        }`}
                      >
                        <CreditCard className={`w-6 h-6 mb-2 ${paymentMethod === 'Stripe' ? 'text-blue-500' : 'text-gray-400'}`} />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-center">Card / Wallet</span>
                      </button>
                    </div>
                  </div>

                  {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium border border-red-100 mt-4">
                      {error}
                    </div>
                  )}

                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full bg-[#D4AF37] text-black py-4 rounded-full font-black uppercase tracking-widest hover:bg-yellow-500 transition-all hover:scale-[1.02] shadow-lg shadow-[#D4AF37]/20 flex items-center justify-center gap-2 mt-6 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    {isSubmitting ? 'Processing...' : paymentMethod === 'WhatsApp' ? 'Place Order via WhatsApp' : 'Pay Securely with Stripe'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
