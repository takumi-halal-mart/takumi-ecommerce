import { getOrderById } from '../actions'
import { StatusDropdown } from '../StatusDropdown'
import { MapPin, Phone, CreditCard, Calendar, BoxSelect, ArrowLeft, ArrowRight, User } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { Tag } from 'lucide-react'

export const metadata = {
  title: 'Order Details | Takumi Admin',
}

interface OrderDetailsProps {
  params: {
    id: string
  }
}

export default async function OrderDetailsPage({ params }: OrderDetailsProps) {
  // Await the params to get the id (Next.js 15 requirement for dynamic routes)
  const { id } = await params
  
  const { data: order, error } = await getOrderById(id)

  if (error || !order) {
    notFound()
  }

  const orderDate = new Date(order.created_at)
  const formattedDate = orderDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
  const formattedTime = orderDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })

  // Calculate Subtotal (since total_amount might include delivery fee)
  const subtotal = order.order_items?.reduce((sum, item) => sum + (item.quantity * item.price_at_purchase), 0) || 0
  
  // Attempt to find if a coupon was used during this exact order checkout
  const supabase = await createClient()
  const serviceClient = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY! || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  
  const orderTime = new Date(order.created_at)
  const windowStart = new Date(orderTime.getTime() - 60000).toISOString() // 1 min before
  const windowEnd = new Date(orderTime.getTime() + 60000).toISOString()   // 1 min after
  
  const { data: usages } = await serviceClient
    .from('coupon_usages')
    .select('*, coupons(*)')
    .eq('customer_phone', order.customer_phone)
    .gte('used_at', windowStart)
    .lte('used_at', windowEnd)
    .limit(1)

  let discountAmount = 0
  let couponCode = null
  
  if (usages && usages.length > 0 && usages[0].coupons) {
    const coupon = usages[0].coupons
    couponCode = coupon.code
    if (coupon.discount_type === 'percentage') {
      discountAmount = Math.floor(subtotal * (coupon.discount_value / 100))
    } else {
      discountAmount = coupon.discount_value
    }
  }

  // With the exact discount known, we can perfectly reverse-engineer the delivery fee
  const deliveryFee = Math.max(0, order.total_amount - (subtotal - discountAmount))

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out pb-20">
      
      {/* Premium Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border pb-6">
        <div>
          <Link href="/admin/orders" className="text-gray-400 hover:text-brand-gold transition-colors flex items-center text-sm font-medium mb-3 w-fit">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Orders
          </Link>
          <h1 className="text-3xl font-semibold tracking-tight text-white flex items-center gap-3">
            Order Details
            <span className="text-sm font-mono bg-brand-gray/50 px-3 py-1 rounded-md text-brand-gold border border-brand-border">
              #{order.id.slice(0, 8).toUpperCase()}
            </span>
          </h1>
          <p className="text-sm text-gray-400 mt-2 flex items-center gap-2">
            <Calendar className="w-4 h-4" /> Placed on {formattedDate} at {formattedTime}
          </p>
        </div>
        
        {/* Action Controls */}
        <div className="flex items-center gap-4 bg-brand-dark p-2 rounded-xl border border-brand-border">
          <span className="text-sm font-bold text-gray-400 uppercase tracking-widest pl-2">Status:</span>
          <StatusDropdown orderId={order.id} currentStatus={order.status} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: Customer & Logistics */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Customer Card */}
          <div className="bg-brand-dark rounded-2xl border border-brand-border shadow-lg p-6">
            <h2 className="text-xs uppercase tracking-[0.15em] font-bold text-brand-gold mb-6 flex items-center">
              <User className="w-4 h-4 mr-2" /> Customer Profile
            </h2>
            <div className="space-y-4">
              <div>
                <div className="text-xs text-gray-500 mb-1">Full Name</div>
                <div className="text-white font-medium">{order.customer_name}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">Contact Phone</div>
                <div className="flex items-center text-white font-medium">
                  <Phone className="w-4 h-4 mr-2 text-gray-400" />
                  {order.customer_phone}
                </div>
              </div>
            </div>
          </div>

          {/* Delivery Card */}
          <div className="bg-brand-dark rounded-2xl border border-brand-border shadow-lg p-6">
            <h2 className="text-xs uppercase tracking-[0.15em] font-bold text-brand-gold mb-6 flex items-center">
              <MapPin className="w-4 h-4 mr-2" /> Delivery Logistics
            </h2>
            <div className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap bg-brand-gray/20 p-4 rounded-xl border border-brand-border/30">
              {order.delivery_address}
            </div>
          </div>

          {/* Financials Card */}
          <div className="bg-brand-dark rounded-2xl border border-brand-border shadow-lg p-6">
            <h2 className="text-xs uppercase tracking-[0.15em] font-bold text-brand-gold mb-6 flex items-center">
              <CreditCard className="w-4 h-4 mr-2" /> Financial Summary
            </h2>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm text-gray-400">
                <span>Subtotal ({order.order_items?.length || 0} items)</span>
                <span>¥{subtotal.toLocaleString('ja-JP')}</span>
              </div>
              
              {couponCode && discountAmount > 0 && (
                <div className="flex justify-between text-sm text-green-400">
                  <span className="flex items-center"><Tag className="w-3 h-3 mr-1" /> Discount ({couponCode})</span>
                  <span>-¥{discountAmount.toLocaleString('ja-JP')}</span>
                </div>
              )}
              
              <div className="flex justify-between text-sm text-gray-400">
                <span>Delivery Fee</span>
                <span>{deliveryFee > 0 ? `¥${deliveryFee.toLocaleString('ja-JP')}` : <span className="text-green-500 uppercase tracking-widest text-[10px] font-bold">Free Shipping</span>}</span>
              </div>
            </div>
            <div className="flex justify-between items-end pt-4 border-t border-brand-border">
              <span className="text-sm font-bold text-white uppercase tracking-widest">Total</span>
              <span className="text-2xl font-mono font-bold text-brand-gold">¥{order.total_amount.toLocaleString('ja-JP')}</span>
            </div>
            
            <div className="mt-6 pt-6 border-t border-brand-border flex justify-between items-center">
              <span className="text-xs text-gray-500 uppercase tracking-widest">Payment Method</span>
              <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest bg-green-950/30 text-green-400 border border-green-900/50">
                {order.payment_method}
              </span>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Order Items */}
        <div className="lg:col-span-2">
          <div className="bg-brand-dark rounded-2xl border border-brand-border shadow-lg overflow-hidden">
            <div className="p-6 border-b border-brand-border bg-brand-gray/10 flex justify-between items-center">
              <h2 className="text-xs uppercase tracking-[0.15em] font-bold text-brand-gold flex items-center">
                <BoxSelect className="w-4 h-4 mr-2" /> Purchased Items
              </h2>
              <span className="text-xs font-mono text-gray-400">{order.order_items?.length || 0} ITEMS</span>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                {order.order_items?.map((item) => (
                  <div key={item.id} className="flex flex-col sm:flex-row sm:items-center gap-4 bg-brand-gray/20 p-4 rounded-xl border border-brand-border/30 hover:bg-brand-gray/40 transition-colors group">
                    <div className="relative w-16 h-16 sm:w-20 sm:h-20 bg-brand-dark rounded-lg overflow-hidden border border-brand-border shrink-0 flex items-center justify-center">
                      {item.products?.image_url ? (
                        <Image src={item.products.image_url} alt={item.products.name || 'Product'} fill className="object-cover" unoptimized />
                      ) : (
                        <BoxSelect className="w-8 h-8 text-gray-500" />
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                      <div className="text-base font-semibold text-white mb-1 group-hover:text-brand-gold transition-colors">
                        {item.products?.name || 'Unknown Item'}
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-400">
                        <span className="bg-brand-dark px-2 py-0.5 rounded text-brand-gold font-bold border border-brand-border/50">
                          Qty: {item.quantity}
                        </span>
                        <span>Unit: ¥{item.price_at_purchase.toLocaleString('ja-JP')}</span>
                      </div>
                    </div>
                    
                    <div className="text-lg font-mono font-bold text-white text-right shrink-0 mt-4 sm:mt-0">
                      ¥{(item.quantity * item.price_at_purchase).toLocaleString('ja-JP')}
                    </div>
                  </div>
                ))}

                {(!order.order_items || order.order_items.length === 0) && (
                  <div className="text-center py-12">
                    <BoxSelect className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400">No items found for this order.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
