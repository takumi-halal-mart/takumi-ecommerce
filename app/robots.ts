import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/', '/cart', '/checkout'],
    },
    sitemap: 'https://takumi.com/sitemap.xml', // Replace with your actual production URL
  }
}
