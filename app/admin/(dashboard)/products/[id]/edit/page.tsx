import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { EditProductForm } from './EditProductForm'
import { Product } from '../../actions'

export const metadata = {
  title: 'Edit Product | Takumi Admin',
}

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  // Await params in Next.js 15
  const { id } = await params

  const supabase = await createClient()
  
  // Fetch the product
  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single()
    
  // If product doesn't exist, boot them back to the table
  if (!product) {
    redirect('/admin/products')
  }

  return (
    <div className="max-w-4xl mx-auto">
      <EditProductForm product={product as Product} />
    </div>
  )
}
