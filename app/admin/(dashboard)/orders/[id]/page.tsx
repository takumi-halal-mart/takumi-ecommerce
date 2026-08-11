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
  
  const { data: baseOrder, error } = await getOrderById(id)

  if (error || !baseOrder) {
    notFound()
  }

  const supabase = await createClient()

  // Find other orders from the same session (Split Checkout)
  const baseOrderTime = new Date(baseOrder.created_at).getTime()
  const windowStart = new Date(baseOrderTime - 1000 * 60 * 30).toISOString()
  const windowEnd = new Date(baseOrderTime + 1000 * 60 * 30).toISOString()
  
  const { data: groupOrders } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (
        id,
        quantity,
        price_at_purchase,
        selected_flavor,
        products (
          name,
          image_url
        )
      )
    `)
    .eq('customer_phone', baseOrder.customer_phone)
    .gte('created_at', windowStart)
    .lte('created_at', windowEnd)
    .order('created_at', { ascending: true })

  let order = baseOrder as any;
  let mergedItems: any[] = [];
  let paymentMethods = new Set<string>();
  let totalAmount = 0;
  let allOrderIds: string[] = [baseOrder.id];

  if (groupOrders && groupOrders.length > 0) {
    order = groupOrders[0];
    allOrderIds = [];
    groupOrders.forEach(go => {
      totalAmount += go.total_amount;
      paymentMethods.add(go.payment_method);
      if (go.order_items) {
        mergedItems = [...mergedItems, ...go.order_items];
      }
      allOrderIds.push(go.id);
    });
    
    order = {
      ...order,
      total_amount: totalAmount,
      order_items: mergedItems,
      payment_methods_array: Array.from(paymentMethods)
    };
  } else {
    order.order_items = baseOrder.order_items || [];
    order.payment_methods_array = [baseOrder.payment_method];
  }

  const orderDate = new Date(order.created_at)
  const formattedDate = orderDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
  const formattedTime = orderDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })

  // Calculate Subtotal (since total_amount might include delivery fee)
  const subtotal = order.order_items?.reduce((sum: number, item: any) => sum + (item.quantity * item.price_at_purchase), 0) || 0
  
  // Attempt to find if a coupon was used during this exact order checkout
  const serviceClient = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY! || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  
  const orderTime = new Date(order.created_at)
  const couponWindowStart = new Date(orderTime.getTime() - 60000).toISOString() // 1 min before
  const couponWindowEnd = new Date(orderTime.getTime() + 60000).toISOString()   // 1 min after
  
  const { data: usages } = await serviceClient
    .from('coupon_usages')
    .select('*, coupons(*)')
    .eq('customer_phone', order.customer_phone)
    .gte('used_at', couponWindowStart)
    .lte('used_at', couponWindowEnd)
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
          <StatusDropdown orderIds={allOrderIds} currentStatus={order.status} />
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
              <div className="flex gap-2">
                {order.payment_methods_array.map((pm: string) => (
                  <span key={pm} className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest bg-brand-gray/50 text-white border border-brand-border/50">
                    {pm}
                  </span>
                ))}
              </div>
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
                {order.order_items?.map((item: any) => (
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
                        {item.selected_flavor && (
                          <span className="ml-2 text-xs text-brand-gold bg-brand-gold/10 px-2 py-0.5 rounded-full inline-block align-middle mb-1">
                            {item.selected_flavor}
                          </span>
                        )}
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
