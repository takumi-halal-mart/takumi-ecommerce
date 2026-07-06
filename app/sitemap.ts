import { MetadataRoute } from 'next'
import { getFeaturedProducts } from '@/app/actions/storefront'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://takumihalalmart.store'

  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/shop`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/wholesale`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/tokushoho`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
  ]

  try {
    const productsRes = await getFeaturedProducts()
    const products = productsRes.data || []
    
    const productRoutes: MetadataRoute.Sitemap = products.map((product) => ({
      url: `${baseUrl}/product/${product.id}`,
      lastModified: new Date(product.created_at || new Date()),
      changeFrequency: 'weekly',
      priority: 0.8,
    }))
    
    return [...routes, ...productRoutes]
  } catch (error) {
    return routes
  }
}
