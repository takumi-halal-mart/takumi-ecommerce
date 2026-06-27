import { getWholesaleProducts } from '@/app/actions/storefront'
import { WholesaleClient } from '@/components/storefront/WholesaleClient'

export const metadata = {
  title: 'B2B Portal & Wholesale | Takumi',
  description: 'Direct imports, unmatched volume pricing, and custom sourcing for restaurants.',
}

export default async function WholesalePage() {
  const productsRes = await getWholesaleProducts()
  const products = productsRes.data || []

  return (
    <WholesaleClient products={products} />
  )
}
