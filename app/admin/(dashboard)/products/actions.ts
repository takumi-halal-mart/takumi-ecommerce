'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export interface Product {
  id: string
  created_at: string
  name: string
  description: string | null
  image_url: string | null
  stock_count: number
  is_retail: boolean
  retail_price: number
  is_wholesale: boolean
  wholesale_price: number | null
  wholesale_moq: number
}

/**
 * Creates a new product and uploads its image (if provided) to Supabase Storage.
 */
export async function createProduct(prevState: any, formData: FormData) {
  try {
    const supabase = await createClient()

    // 1. Extract form fields
    const name = formData.get('name') as string
    const description = formData.get('description') as string
    const stock_count = parseInt(formData.get('stock_count') as string || '0', 10)
    const retail_price = parseFloat(formData.get('retail_price') as string)
    
    // Checkboxes often send 'on' if checked
    const is_wholesale = formData.get('is_wholesale') === 'on' || formData.get('is_wholesale') === 'true'
    
    const wholesale_priceRaw = formData.get('wholesale_price')
    const wholesale_price = wholesale_priceRaw ? parseFloat(wholesale_priceRaw as string) : null
    
    const wholesale_moq = parseInt(formData.get('wholesale_moq') as string || '10', 10)

    // Basic validation
    if (!name || isNaN(retail_price)) {
      return { error: 'Name and valid retail price are required.' }
    }

    // 2. Handle Image Upload
    const imageFile = formData.get('image') as File | null
    let image_url = null

    if (imageFile && imageFile.size > 0) {
      const fileExt = imageFile.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
      
      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(fileName, imageFile)

      if (uploadError) {
        console.error('Image upload error:', uploadError)
        return { error: 'Failed to upload product image.' }
      }

      const { data: publicUrlData } = supabase.storage
        .from('product-images')
        .getPublicUrl(fileName)

      image_url = publicUrlData.publicUrl
    }

    // 3. Insert Product into DB
    const { error: insertError } = await supabase.from('products').insert({
      name,
      description,
      stock_count,
      retail_price,
      is_wholesale,
      wholesale_price,
      wholesale_moq,
      image_url
    })

    if (insertError) {
      console.error('Database insert error:', insertError)
      return { error: insertError.message }
    }

    // 4. Revalidate and Return
    revalidatePath('/admin/products')
    return { success: true, error: '' }

  } catch (error: any) {
    console.error('Create product exception:', error)
    return { error: 'An unexpected error occurred while creating the product.' }
  }
}

/**
 * Toggles the wholesale status of a specific product.
 */
export async function toggleWholesaleStatus(productId: string, currentStatus: boolean) {
  try {
    const supabase = await createClient()

    const { error } = await supabase
      .from('products')
      .update({ is_wholesale: !currentStatus })
      .eq('id', productId)

    if (error) {
      console.error('Toggle wholesale error:', error)
      return { error: error.message }
    }

    revalidatePath('/admin/products')
    return { success: true }
  } catch (error: any) {
    console.error('Toggle wholesale exception:', error)
    return { error: 'An unexpected error occurred while toggling status.' }
  }
}

/**
 * Deletes a product from the database and removes its image from storage.
 */
export async function deleteProduct(productId: string, imageUrl: string | null) {
  try {
    const supabase = await createClient()

    // 1. Delete the image from the bucket if it exists
    if (imageUrl) {
      const parts = imageUrl.split('/product-images/')
      if (parts.length > 1) {
        const fileName = parts[1]
        const { error: storageError } = await supabase.storage
          .from('product-images')
          .remove([fileName])
          
        if (storageError) {
          console.error('Failed to delete image from storage:', storageError)
          // We can choose to proceed with DB deletion even if storage fails, 
          // or return an error. Usually proceeding is better to prevent orphaned DB rows.
        }
      }
    }

    // 2. Delete the row from the products table
    const { error: dbError } = await supabase
      .from('products')
      .delete()
      .eq('id', productId)

    if (dbError) {
      console.error('Database delete error:', dbError)
      return { error: dbError.message }
    }

    revalidatePath('/admin/products')
    return { success: true }
  } catch (error: any) {
    console.error('Delete product exception:', error)
    return { error: 'An unexpected error occurred while deleting the product.' }
  }
}
