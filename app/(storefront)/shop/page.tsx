import { getStoreCategories, getPaginatedRetailProducts } from '@/app/actions/storefront'
import { ShopClient } from '@/components/storefront/ShopClient'

import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Shop All Products | Takumi Marketplace',
  description: 'Browse our premium collection of authentic groceries, meat, spices, and daily essentials at Takumi Marketplace.',
  openGraph: {
    title: 'Shop All Products | Takumi Marketplace',
    description: 'Browse our premium collection of authentic groceries, meat, and essentials.',
    url: 'https://takumi.com/shop',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Shop All Products | Takumi Marketplace',
    description: 'Browse our premium collection of authentic groceries, meat, and essentials.',
  }
}

export default async function ShopPage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const searchParams = await props.searchParams
  const initialCategory = typeof searchParams.category === 'string' ? searchParams.category : 'All'

  const [categoriesRes, productsRes] = await Promise.all([
    getStoreCategories(),
    getPaginatedRetailProducts(1, 12, initialCategory)
  ])

  const categories = categoriesRes.data || []
  const initialProducts = productsRes.data || []
  const initialTotalCount = productsRes.count || 0

  return (
    <div className="bg-[#F8F9FA] min-h-screen">
      <ShopClient 
        initialProducts={initialProducts} 
        initialTotalCount={initialTotalCount}
        categories={categories} 
        initialCategory={initialCategory} 
      />
    </div>
  )
}
