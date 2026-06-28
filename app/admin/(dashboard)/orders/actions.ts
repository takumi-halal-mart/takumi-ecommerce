'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

// --- Types ---
export interface OrderItem {
  id: string
  order_id: string
  product_id: string | null
  quantity: number
  price_at_purchase: number
  // Optional relations if you join with products
  products?: {
    name: string
    image_url: string | null
  }
}

export interface Order {
  id: string
  created_at: string
  customer_name: string
  customer_phone: string
  delivery_address: string
  total_amount: number
  status: 'Pending' | 'Shipped' | 'Completed'
  payment_method: 'Stripe' | 'WhatsApp' | 'Wholesale Inquiry'
  payment_status: 'Paid' | 'Unpaid' | 'Pending'
  // Joined relation array
  order_items?: OrderItem[]
}

/**
 * Fetches all orders, including their nested order_items.
 * Note: While this is in the actions file, it's typically best to call this directly 
 * in a Server Component to avoid passing large datasets over the Client boundary.
 */
export async function getOrders(): Promise<{ data: Order[] | null; error: string | null }> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          id,
          quantity,
          price_at_purchase,
          products (
            name,
            image_url
          )
        )
      `)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Failed to fetch orders:', error)
      return { data: null, error: error.message }
    }

    return { data: data as unknown as Order[], error: null }
  } catch (error: any) {
    console.error('getOrders exception:', error)
    return { data: null, error: 'An unexpected error occurred while fetching orders.' }
  }
}

/**
 * Fetches a single order by ID, including its nested order_items.
 */
export async function getOrderById(orderId: string): Promise<{ data: Order | null; error: string | null }> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          id,
          quantity,
          price_at_purchase,
          products (
            name,
            image_url
          )
        )
      `)
      .eq('id', orderId)
      .single()

    if (error) {
      console.error('Failed to fetch order:', error)
      return { data: null, error: error.message }
    }

    return { data: data as unknown as Order, error: null }
  } catch (error: any) {
    console.error('getOrderById exception:', error)
    return { data: null, error: 'An unexpected error occurred while fetching the order.' }
  }
}

/**
 * Updates the fulfillment status of a specific order.
 */
export async function updateOrderStatus(orderId: string, newStatus: 'Pending' | 'Shipped' | 'Completed') {
  try {
    const supabase = await createClient()

    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', orderId)

    if (error) {
      console.error('Update order status error:', error)
      return { error: error.message }
    }

    // Burst the router cache to instantly reflect the new status on the dashboard
    revalidatePath('/admin/orders')
    return { success: true }
  } catch (error: any) {
    console.error('Update order status exception:', error)
    return { error: 'An unexpected error occurred while updating the order.' }
  }
}

/**
 * Securely deletes an order. 
 * Note: Because 'order_items' uses 'ON DELETE CASCADE' in SQL,
 * deleting the parent order will automatically wipe the nested items.
 */
export async function deleteOrder(orderId: string) {
  try {
    const supabase = await createClient()

    const { error } = await supabase
      .from('orders')
      .delete()
      .eq('id', orderId)

    if (error) {
      console.error('Database delete order error:', error)
      return { error: error.message }
    }

    revalidatePath('/admin/orders')
    return { success: true }
  } catch (error: any) {
    console.error('Delete order exception:', error)
    return { error: 'An unexpected error occurred while deleting the order.' }
  }
}

export interface WholesaleInquiry {
  id: string
  business_name: string
  contact_person: string
  phone: string
  business_type: string
  primary_interest: string
  estimated_volume: string
  sourcing_requests: string | null
  status: 'New' | 'Contacted' | 'Qualified' | 'Rejected'
  created_at: string
}

export async function getWholesaleInquiries(): Promise<{ data: WholesaleInquiry[] | null; error: string | null }> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('wholesale_inquiries')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Failed to fetch inquiries:', error)
      return { data: null, error: error.message }
    }

    return { data: data as WholesaleInquiry[], error: null }
  } catch (error: any) {
    console.error('getWholesaleInquiries exception:', error)
    return { data: null, error: 'An unexpected error occurred while fetching inquiries.' }
  }
}

export async function updateInquiryStatus(id: string, newStatus: string) {
  try {
    const supabase = await createClient()

    const { error } = await supabase
      .from('wholesale_inquiries')
      .update({ status: newStatus })
      .eq('id', id)

    if (error) {
      console.error('Update inquiry status error:', error)
      return { error: error.message }
    }

    revalidatePath('/admin/orders/inquiries')
    return { success: true }
  } catch (error: any) {
    console.error('Update inquiry status exception:', error)
    return { error: 'An unexpected error occurred.' }
  }
}

export async function deleteInquiry(id: string) {
  try {
    const supabase = await createClient()

    const { error } = await supabase
      .from('wholesale_inquiries')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Delete inquiry error:', error)
      return { error: error.message }
    }

    revalidatePath('/admin/orders/inquiries')
    return { success: true }
  } catch (error: any) {
    console.error('Delete inquiry exception:', error)
    return { error: 'An unexpected error occurred.' }
  }
}
