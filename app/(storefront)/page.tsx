import Image from 'next/image'
import Link from 'next/link'
import { getActiveBanners, getStoreCategories, getFeaturedProducts, getHomepageCategoryProducts } from '@/app/actions/storefront'
import { MarketplaceCard } from '@/components/storefront/MarketplaceCard'
import { HeroCarousel } from '@/components/storefront/HeroCarousel'
import { ArrowRight, ShoppingBag } from 'lucide-react'
import { JsonLd } from "@/components/storefront/JsonLd";

import { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Japan's Premier Halal Grocery — Online & Chiba Store",
  description:
    "Shop halal meat, fresh Sri Lankan vegetables, spices, and daily essentials at Takumi Halal Mart. Located in Togane, Chiba. Wholesale and retail available. Order online for Japan-wide delivery.",
  alternates: { canonical: "https://www.takumihalalmart.store" },
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Takumi Halal Mart",
  url: "https://www.takumihalalmart.store",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: "https://www.takumihalalmart.store/shop?search={search_term_string}",
    },
    "query-input": "required name=search_term_string",
  },
};

export default async function StorefrontPage() {
  const [bannersRes, categoriesRes, productsRes, categoryProductsRes] = await Promise.all([
    getActiveBanners(),
    getStoreCategories(),
    getFeaturedProducts(),
    getHomepageCategoryProducts()
  ])

  const banners = bannersRes.data || []
  const categories = categoriesRes.data || []
  const products = productsRes.data || []
  const categoryProducts = categoryProductsRes.data || {}

  return (
    <div className="bg-[#F8F9FA] min-h-screen pb-24">
      {/* SECTION 1: THE HERO CAROUSEL (Cinematic & Interactive) */}
      <HeroCarousel banners={banners} />

      {/* SECTION 2: INTERACTIVE CATEGORY SCROLLER */}
      {categories.length > 0 && (
        <section className="px-4 mt-2 md:mt-4 relative z-20">
          <div className="max-w-7xl mx-auto bg-white p-6 rounded-2xl shadow-sm overflow-hidden border border-gray-100">
            <h2 className="text-center text-black tracking-widest uppercase mb-6 font-bold text-lg md:text-xl">
              Shop by Category
            </h2>
            <div className="grid grid-cols-3 gap-y-8 gap-x-2 md:flex md:flex-row md:flex-wrap md:justify-center md:gap-6 items-start pb-2">
              {categories.map((cat) => {
                const anchorId = `#section-${cat.name.replace(/\s+/g, '-').toLowerCase()}`
                return (
                  <Link
                    key={cat.id}
                    href={anchorId}
                    className="flex flex-col items-center group"
                  >
                    <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mb-3 group-hover:bg-[#D4AF37]/10 transition-colors border border-gray-100 group-hover:border-[#D4AF37]/30">
                      <ShoppingBag className="w-6 h-6 text-gray-400 group-hover:text-[#D4AF37] transition-colors" />
                    </div>
                    <span className="text-xs font-bold text-center text-gray-700 uppercase tracking-widest max-w-[120px]">
                      {cat.name}
                    </span>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* SECTION 3: FRESH ARRIVALS GRID */}
      {products.length > 0 && (
        <section className="px-4 mt-12">
          <div className="max-w-7xl mx-auto bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center">
            <div className="text-center mb-10">
              <h2 className="inline-block text-2xl md:text-3xl font-black text-black tracking-tight uppercase relative pb-2">
                Fresh Arrivals
                <span className="absolute bottom-0 left-1/4 right-1/4 h-1 bg-[#D4AF37] rounded-full"></span>
              </h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 w-full">
              {products.map((product) => (
                <MarketplaceCard key={product.id} product={product} />
              ))}
            </div>

            <Link
              href="/shop"
              className="border-2 border-black bg-transparent text-black px-8 py-3 rounded-full hover:bg-black hover:text-white transition-colors mt-10 font-bold uppercase tracking-widest text-sm"
            >
              View Full Catalog
            </Link>
          </div>
        </section>
      )}

      {/* SECTION 4: DYNAMIC CATEGORY SECTIONS (Scroll Targets) */}
      <div className="px-4 pb-12">
        {Object.entries(categoryProducts).map(([categoryName, categoryItems]) => {
          if (categoryItems.length === 0) return null // Hide empty category blocks

          const sectionId = `section-${categoryName.replace(/\s+/g, '-').toLowerCase()}`

          return (
            <section 
              key={categoryName}
              id={sectionId}
              className="max-w-7xl mx-auto mt-10 bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 scroll-mt-28"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6 border-b border-gray-50 pb-4">
                <h2 className="text-xl md:text-2xl font-black text-black uppercase tracking-tight">
                  {categoryName}
                </h2>
                <Link 
                  href={`/shop?category=${encodeURIComponent(categoryName)}`}
                  className="text-xs md:text-sm font-bold text-gray-500 hover:text-black transition-colors flex items-center gap-1 uppercase tracking-widest"
                >
                  View All <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* High-density grid limit 5 items */}
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {categoryItems.map((product) => (
                  <MarketplaceCard key={product.id} product={product} />
                ))}
              </div>
            </section>
          )
        })}
      </div>
      
      {/* SECTION 5: ABOUT TAKUMI HALAL MART */}
      <section className="px-4 pb-12">
        <div className="max-w-7xl mx-auto bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xl md:text-2xl font-black text-black tracking-tight uppercase mb-4">
            About Takumi Halal Mart
          </h2>
          <p className="text-gray-700 leading-relaxed font-medium">
            Takumi Halal Mart is a halal-certified grocery store in Togane-shi, Chiba, Japan. 
            We stock over 1000 halal products including fresh and frozen halal meat, 
            Sri Lankan vegetables and fruit, South Asian spices, Japanese beverages, 
            and everyday household items. Our store is open daily until 10 PM. 
            We ship orders across Japan. 
            Wholesale accounts are available for restaurants and businesses — 
            register at takumihalalmart.store/wholesale.
          </p>
        </div>
      </section>
      
      <JsonLd data={websiteSchema} />
    </div>
  )
}
