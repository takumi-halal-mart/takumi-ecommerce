'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/admin/login')
}

// ==========================================
// DASHBOARD METRICS & DATA FETCHING
// ==========================================

export async function getDashboardMetrics() {
  const supabase = await createClient()

  try {
    // 1. Total Revenue
    // (Summing in JS since Supabase RPC/Sum isn't set up out of the box)
    const { data: revenueData, error: revenueError } = await supabase
      .from('orders')
      .select('total_amount')
      .in('payment_status', ['Paid', 'Pending'])

    if (revenueError) throw revenueError

    const totalRevenue = revenueData?.reduce((acc, order) => acc + (Number(order.total_amount) || 0), 0) || 0

    // 2. Fulfillment Pipeline (Pending)
    const { count: pendingCount, error: pendingError } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'Pending')

    if (pendingError) throw pendingError

    // 2. Fulfillment Pipeline (Shipped)
    const { count: shippedCount, error: shippedError } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'Shipped')

    if (shippedError) throw shippedError

    // 3. Catalog Size
    const { count: productCount, error: productError } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })

    if (productError) throw productError

    return {
      success: true,
      data: {
        totalRevenue,
        pendingOrders: pendingCount || 0,
        shippedOrders: shippedCount || 0,
        catalogSize: productCount || 0
      }
    }
  } catch (error: any) {
    console.error('Error fetching dashboard metrics:', error)
    return { success: false, error: 'Failed to load dashboard metrics.', data: null }
  }
}

export async function getLowStockAlerts() {
  const supabase = await createClient()

  try {
    const { data, error } = await supabase
      .from('products')
      .select('id, name, stock_count, image_url')
      .lt('stock_count', 5)
      .order('stock_count', { ascending: true })
      .limit(10)

    if (error) throw error

    return { success: true, data }
  } catch (error: any) {
    console.error('Error fetching low stock alerts:', error)
    return { success: false, error: 'Failed to load low stock alerts.', data: null }
  }
}
