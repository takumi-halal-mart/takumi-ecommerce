import { getStoreCategories, getAllRetailProducts } from '@/app/actions/storefront'
import { ShopClient } from '@/components/storefront/ShopClient'

export const metadata = {
  title: 'Shop | Takumi Marketplace',
  description: 'Browse our premium collection of authentic halal groceries and essentials.',
}

export default async function ShopPage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const searchParams = await props.searchParams
  const initialCategory = typeof searchParams.category === 'string' ? searchParams.category : 'All'

  const [categoriesRes, productsRes] = await Promise.all([
    getStoreCategories(),
    getAllRetailProducts()
  ])

  const categories = categoriesRes.data || []
  const products = productsRes.data || []

  return (
    <div className="bg-[#F8F9FA] min-h-screen">
      <ShopClient 
        initialProducts={products} 
        categories={categories} 
        initialCategory={initialCategory} 
      />
    </div>
  )
}
