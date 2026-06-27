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
