'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export interface Coupon {
  id: string
  created_at: string
  code: string
  discount_type: 'percentage' | 'fixed'
  discount_value: number
  expiration_date: string | null
  min_spend: number
  usage_limit: number | null
  times_used: number
  is_active: boolean
}

/**
 * Fetches all coupons, ordered by the newest created first.
 */
export async function getCoupons() {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('coupons')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Supabase error fetching coupons:', error)
      return { success: false, data: null, error: 'Failed to load coupons.' }
    }

    return { success: true, data: data as Coupon[], error: null }
  } catch (error: any) {
    console.error('Exception in getCoupons:', error)
    return { success: false, data: null, error: 'An unexpected error occurred.' }
  }
}

/**
 * Creates a new promotional coupon.
 * Designed to be used with React's useActionState hook.
 */
export async function createCoupon(prevState: any, formData: FormData) {
  try {
    const supabase = await createClient()

    // 1. Force the code to uppercase to prevent case-sensitive duplication issues
    const codeRaw = formData.get('code') as string
    if (!codeRaw || codeRaw.trim() === '') {
      return { success: false, error: 'Coupon code is required.' }
    }
    const code = codeRaw.trim().toUpperCase()

    // 2. Parse core details
    const discount_type = formData.get('discount_type') as string
    const discount_valueRaw = formData.get('discount_value') as string
    const discount_value = discount_valueRaw ? parseFloat(discount_valueRaw) : 0

    const min_spendRaw = formData.get('min_spend') as string
    const min_spend = min_spendRaw ? parseFloat(min_spendRaw) : 0

    // 3. Gracefully handle null values for constraints
    const expiration_dateRaw = formData.get('expiration_date') as string
    const expiration_date = (expiration_dateRaw && expiration_dateRaw.trim() !== '') 
      ? new Date(expiration_dateRaw).toISOString() 
      : null

    const usage_limitRaw = formData.get('usage_limit') as string
    const usage_limit = (usage_limitRaw && usage_limitRaw.trim() !== '') 
      ? parseInt(usage_limitRaw, 10) 
      : null

    const payload = {
      code,
      discount_type,
      discount_value,
      expiration_date,
      min_spend,
      usage_limit
    }

    // 4. Insert into the database
    const { error } = await supabase
      .from('coupons')
      .insert(payload)

    if (error) {
      console.error('Supabase error creating coupon:', error)
      // Check for PostgreSQL Unique Constraint Violation
      if (error.code === '23505') {
        return { success: false, error: `The promotional code "${code}" already exists.` }
      }
      return { success: false, error: 'Failed to generate the coupon. Please check the values.' }
    }

    // Purge the cache so the list instantly updates
    revalidatePath('/admin/promotions/coupons')
    return { success: true, error: null }

  } catch (error: any) {
    console.error('Exception in createCoupon:', error)
    return { success: false, error: 'An unexpected error occurred while saving the coupon.' }
  }
}

/**
 * Instantly toggles a coupon on or off without needing to delete it.
 */
export async function toggleCouponStatus(couponId: string, currentStatus: boolean) {
  try {
    const supabase = await createClient()

    const { error } = await supabase
      .from('coupons')
      .update({ is_active: !currentStatus })
      .eq('id', couponId)

    if (error) {
      console.error('Supabase error toggling coupon:', error)
      return { success: false, error: 'Failed to update the coupon status.' }
    }

    revalidatePath('/admin/promotions/coupons')
    return { success: true, error: null }
  } catch (error: any) {
    console.error('Exception in toggleCouponStatus:', error)
    return { success: false, error: 'An unexpected error occurred.' }
  }
}

/**
 * Permanently deletes a coupon.
 */
export async function deleteCoupon(couponId: string) {
  try {
    const supabase = await createClient()

    const { error } = await supabase
      .from('coupons')
      .delete()
      .eq('id', couponId)

    if (error) {
      console.error('Supabase error deleting coupon:', error)
      return { success: false, error: 'Failed to delete the coupon.' }
    }

    revalidatePath('/admin/promotions/coupons')
    return { success: true, error: null }
  } catch (error: any) {
    console.error('Exception in deleteCoupon:', error)
    return { success: false, error: 'An unexpected error occurred.' }
  }
}
