'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export interface PromotionalBanner {
  id: string
  created_at: string
  image_url: string
  heading: string | null
  subtext: string | null
  redirect_url: string | null
  is_active: boolean
}

export interface Promotion {
  id: string
  created_at: string
  offer_name: string
  target_product_id: string | null
  discount_type: 'Percentage Off' | 'Flat Discount' | 'Buy 1 Get 1'
  discount_value: number
  is_active: boolean
}

// ==========================================
// BANNER MANAGEMENT ACTIONS
// ==========================================

export async function createBanner(prevState: any, formData: FormData) {
  try {
    const supabase = await createClient()

    const heading = formData.get('heading') as string || null
    const subtext = formData.get('subtext') as string || null
    const redirect_url = formData.get('redirect_url') as string || null
    
    // Default to true when creating a new banner
    const is_active = formData.get('is_active') !== 'false'

    // 1. Handle Image Upload
    const imageFile = formData.get('image') as File | null
    if (!imageFile || imageFile.size === 0) {
      return { error: 'A banner image is required.' }
    }

    const fileExt = imageFile.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
    
    const { error: uploadError } = await supabase.storage
      .from('banner-images')
      .upload(fileName, imageFile)

    if (uploadError) {
      console.error('Banner upload error:', uploadError)
      return { error: 'Failed to upload banner image.' }
    }

    const { data: publicUrlData } = supabase.storage
      .from('banner-images')
      .getPublicUrl(fileName)

    const image_url = publicUrlData.publicUrl

    // 2. Insert into Database
    const { error: insertError } = await supabase.from('promotional_banners').insert({
      image_url,
      heading,
      subtext,
      redirect_url,
      is_active
    })

    if (insertError) {
      console.error('Database insert banner error:', insertError)
      return { error: insertError.message }
    }

    revalidatePath('/admin/promotions')
    return { success: true, error: '' }
  } catch (error: any) {
    console.error('Create banner exception:', error)
    return { error: 'An unexpected error occurred while creating the banner.' }
  }
}

export async function toggleBannerStatus(bannerId: string, currentStatus: boolean) {
  try {
    const supabase = await createClient()

    const { error } = await supabase
      .from('promotional_banners')
      .update({ is_active: !currentStatus })
      .eq('id', bannerId)

    if (error) {
      console.error('Toggle banner status error:', error)
      return { error: error.message }
    }

    revalidatePath('/admin/promotions')
    return { success: true }
  } catch (error: any) {
    console.error('Toggle banner exception:', error)
    return { error: 'An unexpected error occurred while toggling banner status.' }
  }
}

export async function deleteBanner(bannerId: string, imageUrl: string | null) {
  try {
    const supabase = await createClient()

    // 1. Delete image from bucket
    if (imageUrl) {
      const parts = imageUrl.split('/banner-images/')
      if (parts.length > 1) {
        const fileName = parts[1]
        const { error: storageError } = await supabase.storage
          .from('banner-images')
          .remove([fileName])
        if (storageError) {
          console.error('Failed to delete banner image:', storageError)
        }
      }
    }

    // 2. Delete row from table
    const { error: dbError } = await supabase
      .from('promotional_banners')
      .delete()
      .eq('id', bannerId)

    if (dbError) {
      console.error('Database delete banner error:', dbError)
      return { error: dbError.message }
    }

    revalidatePath('/admin/promotions')
    return { success: true }
  } catch (error: any) {
    console.error('Delete banner exception:', error)
    return { error: 'An unexpected error occurred while deleting the banner.' }
  }
}

// ==========================================
// PROMOTION MANAGEMENT ACTIONS
// ==========================================

export async function createPromotion(prevState: any, formData: FormData) {
  try {
    const supabase = await createClient()

    const offer_name = formData.get('offer_name') as string
    
    // target_product_id could be empty if it applies to the whole cart
    const target_product_id_raw = formData.get('target_product_id') as string
    const target_product_id = target_product_id_raw ? target_product_id_raw : null

    const discount_type = formData.get('discount_type') as 'Percentage Off' | 'Flat Discount' | 'Buy 1 Get 1'
    const discount_value = parseFloat(formData.get('discount_value') as string)
    
    const is_active = formData.get('is_active') !== 'false'

    if (!offer_name || !discount_type || isNaN(discount_value)) {
      return { error: 'Offer name, discount type, and valid discount value are required.' }
    }

    const { error: insertError } = await supabase.from('promotions').insert({
      offer_name,
      target_product_id,
      discount_type,
      discount_value,
      is_active
    })

    if (insertError) {
      console.error('Database insert promotion error:', insertError)
      return { error: insertError.message }
    }

    revalidatePath('/admin/promotions')
    return { success: true, error: '' }
  } catch (error: any) {
    console.error('Create promotion exception:', error)
    return { error: 'An unexpected error occurred while creating the promotion.' }
  }
}

export async function togglePromotionStatus(promoId: string, currentStatus: boolean) {
  try {
    const supabase = await createClient()

    const { error } = await supabase
      .from('promotions')
      .update({ is_active: !currentStatus })
      .eq('id', promoId)

    if (error) {
      console.error('Toggle promotion status error:', error)
      return { error: error.message }
    }

    revalidatePath('/admin/promotions')
    return { success: true }
  } catch (error: any) {
    console.error('Toggle promotion exception:', error)
    return { error: 'An unexpected error occurred while toggling promotion status.' }
  }
}

export async function deletePromotion(promoId: string) {
  try {
    const supabase = await createClient()

    const { error } = await supabase
      .from('promotions')
      .delete()
      .eq('id', promoId)

    if (error) {
      console.error('Database delete promotion error:', error)
      return { error: error.message }
    }

    revalidatePath('/admin/promotions')
    return { success: true }
  } catch (error: any) {
    console.error('Delete promotion exception:', error)
    return { error: 'An unexpected error occurred while deleting the promotion.' }
  }
}
