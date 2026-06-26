'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export interface StoreSettings {
  id: number
  delivery_fee: number
  free_shipping_threshold: number
  is_store_open: boolean
  whatsapp_number: string
  updated_at: string
}

/**
 * Fetches the global store settings (id = 1).
 */
export async function getStoreSettings() {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('store_settings')
      .select('*')
      .eq('id', 1)
      .single()

    if (error) {
      console.error('Supabase error fetching store settings:', error)
      return { success: false, data: null, error: 'Failed to load store configuration.' }
    }

    return { success: true, data: data as StoreSettings, error: null }
  } catch (error: any) {
    console.error('Exception in getStoreSettings:', error)
    return { success: false, data: null, error: 'An unexpected error occurred.' }
  }
}

/**
 * Updates the global store settings and revalidates the entire app cache.
 * Designed to be used with React's useActionState.
 */
export async function updateStoreSettings(prevState: any, formData: FormData) {
  try {
    const supabase = await createClient()

    // 1. Parse and validate form fields
    const delivery_feeRaw = formData.get('delivery_fee')
    const delivery_fee = delivery_feeRaw ? parseFloat(delivery_feeRaw as string) : 0

    const free_shipping_thresholdRaw = formData.get('free_shipping_threshold')
    const free_shipping_threshold = free_shipping_thresholdRaw ? parseFloat(free_shipping_thresholdRaw as string) : 0

    const whatsapp_number = (formData.get('whatsapp_number') as string) || ''
    
    // Checkboxes often send 'on' if checked in standard HTML forms
    const is_store_open = formData.get('is_store_open') === 'on' || formData.get('is_store_open') === 'true'

    // 2. Perform the update strictly where id = 1
    const { error } = await supabase
      .from('store_settings')
      .update({
        delivery_fee,
        free_shipping_threshold,
        whatsapp_number,
        is_store_open,
        updated_at: new Date().toISOString()
      })
      .eq('id', 1)

    if (error) {
      console.error('Supabase error updating store settings:', error)
      return { success: false, error: 'Failed to save store configuration. Please try again.' }
    }

    // 3. Force Next.js to purge the entire application cache
    // This ensures that navbars, cart calculations, and checkout pages instantly reflect the new settings.
    revalidatePath('/', 'layout')
    
    return { success: true, error: '' }
  } catch (error: any) {
    console.error('Exception in updateStoreSettings:', error)
    return { success: false, error: 'An unexpected error occurred while saving.' }
  }
}
