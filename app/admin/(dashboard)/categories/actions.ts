'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export interface Category {
  id: string
  name: string
  created_at: string
}

/**
 * Fetches all categories ordered alphabetically by name.
 */
export async function getCategories() {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name', { ascending: true })

    if (error) {
      console.error('Supabase error fetching categories:', error)
      return { success: false, data: null, error: 'Failed to fetch categories.' }
    }

    return { success: true, data: data as Category[], error: null }
  } catch (error: any) {
    console.error('Exception in getCategories:', error)
    return { success: false, data: null, error: 'An unexpected error occurred.' }
  }
}

/**
 * Inserts a new category into the database.
 * Gracefully handles unique constraint violations (duplicate names).
 */
export async function createCategory(name: string) {
  try {
    if (!name || name.trim() === '') {
      return { success: false, error: 'Category name is required.' }
    }

    const supabase = await createClient()
    const cleanName = name.trim()

    const { error } = await supabase
      .from('categories')
      .insert({ name: cleanName })

    if (error) {
      console.error('Supabase error creating category:', error)
      // PostgreSQL Unique Constraint Violation Error Code
      if (error.code === '23505') {
        return { success: false, error: `The category "${cleanName}" already exists.` }
      }
      return { success: false, error: 'Failed to create the category. Please try again.' }
    }

    // Instantly update the new product form datalist options
    revalidatePath('/admin/products/new')
    revalidatePath('/admin/products/[id]/edit', 'page')

    return { success: true, error: null }
  } catch (error: any) {
    console.error('Exception in createCategory:', error)
    return { success: false, error: 'An unexpected error occurred while saving.' }
  }
}

/**
 * Deletes a category by its UUID.
 */
export async function deleteCategory(id: string) {
  try {
    if (!id) {
      return { success: false, error: 'Category ID is required for deletion.' }
    }

    const supabase = await createClient()

    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Supabase error deleting category:', error)
      return { success: false, error: 'Failed to delete the category.' }
    }

    // Instantly update the new product form datalist options
    revalidatePath('/admin/products/new')
    revalidatePath('/admin/products/[id]/edit', 'page')

    return { success: true, error: null }
  } catch (error: any) {
    console.error('Exception in deleteCategory:', error)
    return { success: false, error: 'An unexpected error occurred while deleting.' }
  }
}
