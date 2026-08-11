import { getStoreCategories, getPaginatedRetailProducts } from '@/app/actions/storefront'
import { ShopClient } from '@/components/storefront/ShopClient'

import { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Shop All Halal Products — Meat, Spices, Produce & More",
  description:
    "Browse our full catalog of halal-certified groceries. Fresh meat and poultry, authentic Sri Lankan spices, beverages, rice, grains, and household items. Best prices in Japan.",
  alternates: { canonical: "https://www.takumihalalmart.store/shop" },
};

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
