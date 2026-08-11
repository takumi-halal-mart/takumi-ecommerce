import { getWholesaleProducts } from '@/app/actions/storefront'
import { WholesaleClient } from '@/components/storefront/WholesaleClient'

import { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Wholesale Halal Products in Japan — Bulk Pricing for Businesses",
  description:
    "Takumi Halal Mart offers wholesale pricing on halal meats, spices, and groceries for restaurants, caterers, and retailers across Japan. Register for wholesale access today.",
  alternates: { canonical: "https://www.takumihalalmart.store/wholesale" },
};

export default async function WholesalePage() {
  const productsRes = await getWholesaleProducts()
  const products = productsRes.data || []

  return (
    <WholesaleClient products={products} />
  )
}
