'use server'

import { createClient } from '@/utils/supabase/server'

export interface CRMCustomer {
  customer_name: string
  customer_phone: string
  total_orders: number
  lifetime_value: number
  primary_address: string
  wholesale_orders_count: number
}

/**
 * Fetches all aggregated customer data from the customer_crm PostgreSQL view.
 * Ordered by highest lifetime value (LTV) first.
 */
export async function getCRMUsers() {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('customer_crm')
      .select('*')
      .order('lifetime_value', { ascending: false })

    if (error) {
      console.error('Supabase error fetching CRM users:', error)
      return { success: false, error: 'Failed to fetch customer CRM data.', data: null }
    }

    return { 
      success: true, 
      data: data as CRMCustomer[], 
      error: null 
    }
  } catch (error: any) {
    console.error('Exception in getCRMUsers:', error)
    return { 
      success: false, 
      error: 'An unexpected error occurred while loading customer profiles.', 
      data: null 
    }
  }
}
