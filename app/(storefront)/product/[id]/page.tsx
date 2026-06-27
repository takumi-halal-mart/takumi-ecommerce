import { getProductById, getRelatedProducts } from '@/app/actions/storefront'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, ShieldCheck, Truck, Zap, TrendingUp } from 'lucide-react'
import { ProductActions } from '@/components/storefront/ProductActions'
import { ProductGallery } from '@/components/storefront/ProductGallery'
import { MarketplaceCard } from '@/components/storefront/MarketplaceCard'

export async function generateMetadata({ params }: { params: { id: string } }) {
  const { id } = await params
  const { data: product } = await getProductById(id)
  if (!product) return { title: 'Product Not Found | Takumi' }
  return { title: `${product.name} | Takumi Marketplace` }
}

export default async function ProductPage({ params }: { params: { id: string } }) {
  const { id } = await params
  const { data: product, error } = await getProductById(id)

  if (error || !product) {
    notFound()
  }

  const { data: relatedProducts } = await getRelatedProducts(product.category, product.id)
  const isLowStock = product.stock_count > 0 && product.stock_count < 10

  return (
    <div className="bg-[#F8F9FA] min-h-screen pb-24">
      
      {/* Breadcrumb Navigation */}
      <div className="bg-white border-b border-gray-100 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/shop" className="text-sm font-bold text-gray-500 hover:text-[#D4AF37] transition-colors flex items-center w-fit uppercase tracking-widest">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Store
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 md:pt-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          
          {/* LEFT: Image Gallery */}
          <div className="relative">
            {/* Sales Badges overlay */}
            <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
              {isLowStock && (
                <span className="bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-widest shadow-lg flex items-center gap-1.5">
                  <Zap className="w-3 h-3 fill-current" /> Limited Stock
                </span>
              )}
              {product.category === 'Fresh Meat' && (
                <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-widest shadow-lg flex items-center gap-1.5">
                  <TrendingUp className="w-3 h-3" /> Best Seller
                </span>
              )}
            </div>

            {/* Interactive Image Gallery */}
            <ProductGallery 
              images={[product.image_url || '']} 
              productName={product.name} 
            />
          </div>

          {/* RIGHT: Product Info & Cart Actions */}
          <div className="flex flex-col justify-center">
            
            <div className="mb-2">
              <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-[0.2em]">
                {product.category}
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-black text-black tracking-tight leading-tight mb-4">
              {product.name}
            </h1>
            
            <div className="flex items-end gap-3 mb-6">
              <span className="text-4xl font-mono font-black text-black tracking-tighter">
                ¥{product.retail_price?.toLocaleString('ja-JP')}
              </span>
              <span className="text-lg text-gray-500 font-medium mb-1">
                / {product.unit_type || 'piece'}
              </span>
            </div>

            <p className="text-lg text-gray-600 leading-relaxed mb-8">
              {product.description || 'Premium quality selection sourced directly for the Takumi marketplace. Perfect for your daily culinary needs.'}
            </p>

            <div className="border-t border-gray-100 pt-8">
              {/* The interactive client component for quantity + add to cart */}
              <ProductActions product={product} />
            </div>

            {/* Trust Badges - Conversion Optimizers */}
            <div className="grid grid-cols-2 gap-4 mt-10 p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center text-green-600 shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div className="text-sm font-bold text-gray-900 leading-tight">100% Halal<br/><span className="text-xs font-medium text-gray-500">Certified Quality</span></div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 shrink-0">
                  <Truck className="w-5 h-5" />
                </div>
                <div className="text-sm font-bold text-gray-900 leading-tight">Fast Delivery<br/><span className="text-xs font-medium text-gray-500">Secure Packaging</span></div>
              </div>
            </div>

          </div>
        </div>

        {/* Cross-Selling: Frequently Bought Together / Related */}
        {relatedProducts && relatedProducts.length > 0 && (
          <div className="mt-24 border-t border-gray-200 pt-16">
            <h2 className="text-2xl font-black text-black uppercase tracking-widest mb-2 text-center md:text-left">
              Frequently Bought Together
            </h2>
            <p className="text-gray-500 font-medium mb-8 text-center md:text-left">
              Customers who bought this item also purchased these.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {relatedProducts.map(related => (
                <MarketplaceCard key={related.id} product={related} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
