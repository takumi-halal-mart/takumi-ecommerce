import { getCategories } from '@/app/admin/(dashboard)/categories/actions'
import { NewProductForm } from './NewProductForm'

export const metadata = {
  title: 'Add New Product | Takumi Admin',
}

export default async function NewProductPage() {
  // Fetch live categories securely on the server
  const categoriesResult = await getCategories()
  const initialCategories = categoriesResult.data || []

  return (
    <NewProductForm initialCategories={initialCategories} />
  )
}
