import { getProductById, getRelatedProducts } from '@/app/actions/storefront'
import { notFound } from 'next/navigation'
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
  const isLowStock = product.stock_count > 0 && product.stock_count <= 15
  const isOutOfStock = product.stock_count <= 0

  return (
    <div className="bg-[#F8F9FA] min-h-screen pb-32 md:pb-24">
      
      {/* Breadcrumb Navigation */}
      <div className="bg-white py-4 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
            <Link href="/" className="hover:text-black transition-colors">Shop</Link>
            <span>/</span>
            <Link href={`/shop?category=${encodeURIComponent(product.category)}`} className="hover:text-black transition-colors">{product.category}</Link>
            <span>/</span>
            <span className="text-black line-clamp-1">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-0 md:px-4 sm:px-6 lg:px-8 pt-0 md:pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          
          {/* LEFT: Sticky Image Gallery (Edge-to-edge on mobile) */}
          <div className="relative w-full h-[50vh] md:h-auto">
            <div className="md:sticky md:top-24 h-full">
              {/* Sales Badges */}
              <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                {product.category === 'Fresh Meat' && (
                  <span className="bg-brand-dark text-brand-gold border border-brand-gold/30 text-xs font-black px-4 py-2 rounded-full uppercase tracking-widest shadow-xl flex items-center gap-2">
                    <TrendingUp className="w-3 h-3" /> Best Seller
                  </span>
                )}
                {product.is_wholesale && (
                  <span className="bg-blue-600 text-white text-xs font-black px-4 py-2 rounded-full uppercase tracking-widest shadow-xl flex items-center gap-2">
                    Wholesale Available
                  </span>
                )}
              </div>

              {/* Gallery Component */}
              <div className="w-full h-full md:rounded-3xl overflow-hidden shadow-sm">
                <ProductGallery 
                  images={[product.image_url || '']} 
                  productName={product.name} 
                />
              </div>
            </div>
          </div>

          {/* RIGHT: Product Info & Cart Actions */}
          <div className="flex flex-col px-4 md:px-0 py-8 md:py-4">
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-black tracking-tight leading-none mb-6 uppercase">
              {product.name}
            </h1>
            
            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-4xl font-mono font-black text-brand-gold tracking-tighter">
                ¥{product.retail_price?.toLocaleString('ja-JP')}
              </span>
              <span className="text-lg text-gray-400 font-bold uppercase tracking-widest mb-1">
                / {product.unit_type || 'piece'}
              </span>
            </div>

            {/* Urgency Indicator */}
            {isLowStock && !isOutOfStock && (
              <div className="mb-8 bg-red-50 border border-red-100 rounded-xl p-4">
                <div className="flex items-center gap-2 text-red-600 font-bold text-sm uppercase tracking-widest mb-2">
                  <Zap className="w-4 h-4 fill-current" /> High Demand
                </div>
                <div className="w-full bg-red-200 rounded-full h-1.5 mb-2">
                  <div className="bg-red-600 h-1.5 rounded-full" style={{ width: `${(product.stock_count / 50) * 100}%` }}></div>
                </div>
                <p className="text-red-700 text-xs font-bold uppercase tracking-wider">Hurry, only {product.stock_count} units left in our Tokyo warehouse!</p>
              </div>
            )}
            {isOutOfStock && (
              <div className="mb-8 bg-gray-100 border border-gray-200 rounded-xl p-4">
                <p className="text-gray-500 font-bold uppercase tracking-wider text-sm text-center">Currently Out of Stock</p>
              </div>
            )}

            <p className="text-lg text-gray-600 leading-relaxed mb-10 font-medium">
              {product.description || 'Premium quality selection sourced directly for the Takumi marketplace. Expertly handled and immediately dispatched.'}
            </p>

            <div className="pt-2">
              <ProductActions product={product} />
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-2 gap-4 mt-12 pt-12 border-t border-gray-100">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center text-white shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div className="text-sm font-bold text-gray-900 leading-tight uppercase tracking-wider">100% Halal<br/><span className="text-xs text-gray-500">Certified Quality</span></div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center text-white shrink-0">
                  <Truck className="w-5 h-5" />
                </div>
                <div className="text-sm font-bold text-gray-900 leading-tight uppercase tracking-wider">Fast Delivery<br/><span className="text-xs text-gray-500">Cold-Chain Secure</span></div>
              </div>
            </div>

          </div>
        </div>

        {/* Cross-Selling */}
        {relatedProducts && relatedProducts.length > 0 && (
          <div className="mt-24 md:mt-32 border-t border-gray-200 pt-16 px-4 md:px-0">
            <h2 className="text-2xl font-black text-black uppercase tracking-widest mb-2 text-center md:text-left">
              Frequently Bought Together
            </h2>
            <p className="text-gray-500 font-medium mb-10 text-center md:text-left">
              Customers who bought this item also purchased these.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
