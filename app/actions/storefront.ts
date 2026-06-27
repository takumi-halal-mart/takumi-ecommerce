'use server'

import { createClient } from '@/utils/supabase/server'

export interface StorefrontBanner {
  id: string
  heading: string | null
  subtext: string | null
  redirect_url: string | null
  image_url: string
  is_active: boolean
  created_at: string
}

export interface StorefrontCategory {
  id: string
  name: string
  created_at: string
}

export interface StorefrontProduct {
  id: string
  name: string
  description: string | null
  retail_price: number | null
  wholesale_price: number | null
  wholesale_moq: number | null
  stock_count: number
  is_retail: boolean
  is_wholesale: boolean
  unit_type: string | null
  image_url: string | null
  category: string
  created_at: string
}

/**
 * Fetches all currently active promotional banners for the storefront.
 * Uses public RLS SELECT policies.
 */
export async function getActiveBanners() {
  try {
    const supabase = await createClient()
    
    const { data, error } = await supabase
      .from('promotional_banners')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Supabase error fetching banners:', error)
      return { success: false, data: null, error: 'Failed to fetch promotional banners.' }
    }

    return { success: true, data: data as StorefrontBanner[], error: null }
  } catch (error: any) {
    console.error('Exception fetching active banners:', error)
    return { success: false, data: null, error: 'An unexpected error occurred.' }
  }
}

/**
 * Fetches all categories to populate the storefront navigation/filters.
 */
export async function getStoreCategories() {
  try {
    const supabase = await createClient()
    
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name', { ascending: true }) // Ordered alphabetically for better UX

    if (error) {
      console.error('Supabase error fetching categories:', error)
      return { success: false, data: null, error: 'Failed to fetch categories.' }
    }

    return { success: true, data: data as StorefrontCategory[], error: null }
  } catch (error: any) {
    console.error('Exception fetching categories:', error)
    return { success: false, data: null, error: 'An unexpected error occurred.' }
  }
}

/**
 * Fetches the latest 8 retail products that are currently in stock.
 * Ideal for keeping the homepage lightweight and fast.
 */
export async function getFeaturedProducts() {
  try {
    const supabase = await createClient()
    
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_retail', true)
      .gt('stock_count', 0)
      .order('created_at', { ascending: false })
      .limit(8)

    if (error) {
      console.error('Supabase error fetching featured products:', error)
      return { success: false, data: null, error: 'Failed to fetch featured products.' }
    }

    return { success: true, data: data as StorefrontProduct[], error: null }
  } catch (error: any) {
    console.error('Exception fetching featured products:', error)
    return { success: false, data: null, error: 'An unexpected error occurred.' }
  }
}

/**
 * Fetches retail products specifically mapped for the expanded homepage category sections.
 * Returns a grouped object limited to 5 products per category.
 */
export async function getHomepageCategoryProducts() {
  const targetCategories = [
    'Beverages',
    'Fresh Produce',
    'Household',
    'Meat & Poultry',
    'Rice & Grains',
    'Spices & Herbs'
  ]

  try {
    const supabase = await createClient()
    
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_retail', true)
      .gt('stock_count', 0)
      .in('category', targetCategories)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Supabase error fetching category products:', error)
      return { success: false, data: null, error: 'Failed to fetch category products.' }
    }

    const products = data as StorefrontProduct[]
    
    const groupedData: Record<string, StorefrontProduct[]> = {}
    
    targetCategories.forEach(cat => {
      groupedData[cat] = []
    })

    products.forEach((product) => {
      if (groupedData[product.category] && groupedData[product.category].length < 5) {
        groupedData[product.category].push(product)
      }
    })

    return { success: true, data: groupedData, error: null }
  } catch (error: any) {
    console.error('Exception fetching category products:', error)
    return { success: false, data: null, error: 'An unexpected error occurred.' }
  }
}

export interface StoreSettings {
  delivery_fee: number
  free_shipping_threshold: number
  is_store_open: boolean
  whatsapp_number: string
}

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
      return { success: false, data: null, error: 'Failed to fetch settings.' }
    }

    return { success: true, data: data as StoreSettings, error: null }
  } catch (error: any) {
    console.error('Exception fetching store settings:', error)
    return { success: false, data: null, error: 'An unexpected error occurred.' }
  }
}

export async function getProductById(productId: string) {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', productId)
      .eq('is_retail', true)
      .single()

    if (error) {
      console.error('Supabase error fetching product:', error)
      return { success: false, data: null, error: 'Failed to fetch product.' }
    }

    return { success: true, data: data as StorefrontProduct, error: null }
  } catch (error: any) {
    console.error('Exception fetching product:', error)
    return { success: false, data: null, error: 'An unexpected error occurred.' }
  }
}

export async function getRelatedProducts(category: string, excludeId: string) {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_retail', true)
      .eq('category', category)
      .neq('id', excludeId)
      .limit(4)

    if (error) {
      console.error('Supabase error fetching related products:', error)
      return { success: false, data: null, error: 'Failed to fetch related products.' }
    }

    return { success: true, data: data as StorefrontProduct[], error: null }
  } catch (error: any) {
    console.error('Exception fetching related products:', error)
    return { success: false, data: null, error: 'An unexpected error occurred.' }
  }
}

export async function validateCouponCode(code: string, subtotal: number) {
  try {
    const supabase = await createClient()
    const { data: coupon, error } = await supabase
      .from('coupons')
      .select('*')
      .eq('code', code.toUpperCase())
      .single()

    if (error || !coupon) {
      return { success: false, error: 'Invalid coupon code.' }
    }

    if (!coupon.is_active) {
      return { success: false, error: 'This coupon is no longer active.' }
    }

    if (subtotal < coupon.min_spend) {
      return { success: false, error: `Minimum spend of ¥${coupon.min_spend} required for this coupon.` }
    }

    if (coupon.expiration_date) {
      // Set the expiration date to the very end of the day (23:59:59.999) 
      // so the coupon remains valid on its actual expiration date.
      const expiryDate = new Date(coupon.expiration_date)
      expiryDate.setUTCHours(23, 59, 59, 999)
      
      if (expiryDate < new Date()) {
        return { success: false, error: 'This coupon has expired.' }
      }
    }

    if (coupon.usage_limit && coupon.times_used >= coupon.usage_limit) {
      return { success: false, error: 'This coupon has reached its usage limit.' }
    }

    return { 
      success: true, 
      coupon: {
        id: coupon.id,
        code: coupon.code,
        discount_type: coupon.discount_type,
        discount_value: coupon.discount_value
      }
    }
  } catch (error: any) {
    console.error('Exception validating coupon:', error)
    return { success: false, error: 'An unexpected error occurred.' }
  }
}
