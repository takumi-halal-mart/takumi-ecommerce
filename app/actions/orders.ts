'use server'

import { createClient } from '@/utils/supabase/server'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { CartItem } from '@/components/providers/CartProvider'

export async function placeOrder(formData: FormData, cartItems: CartItem[], totalAmount: number, couponId?: string) {
  try {
    const supabase = await createClient()
    const serviceClient = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY! || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const customerName = formData.get('customerName') as string
    const customerPhone = formData.get('customerPhone') as string
    const deliveryAddress = formData.get('deliveryAddress') as string
    const paymentMethod = formData.get('paymentMethod') as string || 'WhatsApp'

    if (!customerName || !customerPhone || !deliveryAddress) {
      return { success: false, error: 'Please fill out all required fields.' }
    }

    if (!cartItems || cartItems.length === 0) {
      return { success: false, error: 'Your cart is empty.' }
    }

    // --- Coupon Validation (Strict Phone Number Check) ---
    if (couponId) {
      // 1. Check if the coupon exists and requires limit_per_customer
      const { data: coupon, error: couponFetchError } = await supabase
        .from('coupons')
        .select('limit_per_customer')
        .eq('id', couponId)
        .single()

      if (!couponFetchError && coupon?.limit_per_customer) {
        // 2. Check if this specific phone number has already used it
        const { count } = await serviceClient
          .from('coupon_usages')
          .select('*', { count: 'exact', head: true })
          .eq('coupon_id', couponId)
          .eq('customer_phone', customerPhone)

        if (count && count > 0) {
          return { success: false, error: 'You have already used this coupon.' }
        }
      }
    }

    // Insert into orders table
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert({
        customer_name: customerName,
        customer_phone: customerPhone,
        delivery_address: deliveryAddress,
        total_amount: totalAmount,
        payment_method: paymentMethod,
        status: 'Pending',
        payment_status: 'Pending'
      })
      .select('id')
      .single()

    if (orderError) {
      console.error('Error creating order:', orderError)
      return { success: false, error: 'Failed to create order.' }
    }

    const orderId = orderData.id

    // Prepare order_items
    const orderItems = cartItems.map(item => ({
      order_id: orderId,
      product_id: item.product.id.replace('_bulk', ''),
      quantity: item.quantity,
      price_at_purchase: item.product.retail_price || 0
    }))

    // Insert into order_items table
    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems)

    if (itemsError) {
      console.error('Error inserting order items:', itemsError)
      return { success: false, error: 'Failed to add items to the order.' }
    }

    // Handle Coupon Usage Tracking
    if (couponId) {
      const { error: usageError } = await serviceClient
        .from('coupon_usages')
        .insert({
          coupon_id: couponId,
          customer_phone: customerPhone
        })
      
      if (usageError) {
        console.error('Error tracking coupon usage:', usageError)
      } else {
        // Increment the global usage count
        const { data: currentCoupon } = await serviceClient
          .from('coupons')
          .select('times_used')
          .eq('id', couponId)
          .single()
          
        if (currentCoupon) {
          await serviceClient
            .from('coupons')
            .update({ times_used: (currentCoupon.times_used || 0) + 1 })
            .eq('id', couponId)
        }
      }
    }

    return { success: true, orderId }

  } catch (error: any) {
    console.error('Exception placing order:', error)
    return { success: false, error: 'An unexpected error occurred while placing the order.' }
  }
}
