import Link from 'next/link'
import { getStoreCategories } from '@/app/actions/storefront'
import { ArrowRight, Sparkles } from 'lucide-react'

export const metadata = {
  title: 'Categories | Takumi Marketplace',
  description: 'Explore our premium selection by category.',
}

export default async function CategoriesPage() {
  const categoriesRes = await getStoreCategories()
  const categories = categoriesRes.data || []

  return (
    <div className="bg-[#F8F9FA] min-h-screen pb-24">
      {/* 1. Minimalist Typographic Header */}
      <div className="bg-brand-dark pt-20 pb-16 px-4 flex items-center justify-center">
        <div className="relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-widest uppercase mb-4">
            Our Categories
          </h1>
          <div className="w-24 h-1 bg-brand-gold mx-auto"></div>
        </div>
      </div>

      {/* 2. The Typographic Bento Box Grid */}
      <div className="max-w-7xl mx-auto px-4 mt-12 md:mt-16">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {categories.map((cat, index) => {
            // First two categories are large, dark feature blocks
            const isHeroBlock = index === 0 || index === 1
            const spanClass = isHeroBlock 
              ? "md:col-span-2 lg:col-span-2 row-span-2 min-h-[250px] md:min-h-[350px] bg-brand-dark border-brand-dark text-white" 
              : "md:col-span-1 lg:col-span-1 min-h-[180px] md:min-h-[220px] bg-white border-gray-200 text-black hover:border-brand-gold hover:shadow-lg"

            return (
              <Link 
                key={cat.id} 
                href={`/shop?category=${encodeURIComponent(cat.name)}`}
                className={`group relative rounded-3xl overflow-hidden block shadow-sm border transition-all duration-500 flex flex-col justify-between p-6 md:p-8 ${spanClass}`}
              >
                {/* Decorative Top Bar */}
                <div className="flex justify-between items-start relative z-10">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-transform duration-500 group-hover:scale-110 ${isHeroBlock ? 'bg-brand-gold/10 text-brand-gold' : 'bg-gray-50 text-gray-400 group-hover:bg-brand-gold/10 group-hover:text-brand-gold'}`}>
                    <Sparkles className="w-5 h-5 md:w-6 md:h-6" />
                  </div>
                  
                  {/* Floating Arrow that appears on hover */}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transform translate-x-4 opacity-0 transition-all duration-500 group-hover:opacity-100 group-hover:translate-x-0 ${isHeroBlock ? 'bg-brand-gold text-black' : 'bg-black text-white'}`}>
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </div>

                {/* Typography Focus */}
                <div className="mt-8 relative z-10">
                  <h3 className={`font-black uppercase tracking-widest leading-tight transition-transform duration-500 group-hover:-translate-y-2 ${isHeroBlock ? 'text-3xl md:text-5xl text-brand-gold' : 'text-xl md:text-2xl'}`}>
                    {cat.name}
                  </h3>
                  
                  {isHeroBlock && (
                    <p className="text-gray-400 mt-4 text-xs md:text-sm font-medium tracking-widest uppercase max-w-xs transition-opacity duration-500 opacity-0 group-hover:opacity-100">
                      Explore our premium selection of {cat.name.toLowerCase()}.
                    </p>
                  )}
                </div>

                {/* Subtle Glowing Gradient for Hero Blocks */}
                {isHeroBlock && (
                  <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-brand-gold/5 rounded-full blur-3xl transition-all duration-700 group-hover:bg-brand-gold/10 group-hover:scale-150 z-0"></div>
                )}
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
