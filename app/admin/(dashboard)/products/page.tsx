import Link from 'next/link'
import Image from 'next/image'
import { Plus, Trash2, Edit, PackageSearch, Tag } from 'lucide-react'
import { createClient } from '@/utils/supabase/server'
import { deleteProduct, Product } from './actions'

export const metadata = {
  title: 'Products | Takumi Admin',
}

export default async function ProductsPage() {
  const supabase = await createClient()
  
  // 1. Fetch products from Supabase directly in this Server Component
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })

  const products = data as Product[] | null

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      
      {/* Premium Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-white">Inventory Management</h1>
          <p className="text-sm text-gray-400 mt-2">View, modify, and expand your premium product catalog.</p>
        </div>
        <Link 
          href="/admin/products/new"
          className="inline-flex items-center justify-center px-5 py-2.5 bg-brand-gold hover:bg-brand-gold-hover text-brand-black font-bold uppercase tracking-wider text-sm rounded-lg transition-all shadow-[0_0_15px_rgba(212,175,55,0.15)] hover:shadow-[0_0_25px_rgba(212,175,55,0.3)] shrink-0"
        >
          <Plus className="w-5 h-5 mr-2 stroke-[3]" />
          Create Product
        </Link>
      </div>

      {/* Database Error Handling */}
      {error && (
        <div className="p-4 bg-red-950/30 border border-red-900/50 rounded-xl text-red-400 flex items-start">
          <svg className="w-5 h-5 mr-2 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Failed to load products: {error.message}</span>
        </div>
      )}

      {/* Premium Data Table Container */}
      <div className="bg-brand-dark rounded-2xl border border-brand-border shadow-lg overflow-hidden relative">
        
        {/* Empty State */}
        {!products || products.length === 0 ? (
          <div className="p-12 flex flex-col items-center justify-center text-center py-32 relative overflow-hidden">
             <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
                <Tag className="w-96 h-96 text-white" />
             </div>
            <div className="w-20 h-20 bg-brand-gray rounded-full flex items-center justify-center mb-6 border border-brand-border shadow-inner relative z-10">
              <PackageSearch className="h-8 w-8 text-brand-gold" />
            </div>
            <p className="text-white font-semibold text-xl relative z-10">No products found</p>
            <p className="text-sm text-gray-400 mt-2 max-w-sm leading-relaxed relative z-10">
              Your catalog is currently empty. Click "Create Product" to configure your first premium retail or wholesale item.
            </p>
          </div>
        ) : (
          
          /* Data Table */
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-brand-gray/30 border-b border-brand-border backdrop-blur-sm">
                  <th className="px-6 py-5 text-xs uppercase tracking-[0.15em] font-bold text-brand-gold">Product</th>
                  <th className="px-6 py-5 text-xs uppercase tracking-[0.15em] font-bold text-brand-gold">Pricing</th>
                  <th className="px-6 py-5 text-xs uppercase tracking-[0.15em] font-bold text-brand-gold">Stock</th>
                  <th className="px-6 py-5 text-xs uppercase tracking-[0.15em] font-bold text-brand-gold">Distribution</th>
                  <th className="px-6 py-5 text-xs uppercase tracking-[0.15em] font-bold text-brand-gold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border/50">
                {products.map((product) => {
                  
                  // Native Server Action Binding! 
                  // This binds the current product ID and Image URL so when the form submits, it runs securely on the server.
                  const deleteAction = deleteProduct.bind(null, product.id, product.image_url)
                  
                  return (
                    <tr key={product.id} className="hover:bg-brand-gray/40 transition-colors group">
                      
                      {/* 1. Image & Details */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-12 w-12 shrink-0 relative rounded-lg border border-brand-border overflow-hidden bg-brand-gray/50 flex items-center justify-center shadow-inner">
                            {product.image_url ? (
                              <Image 
                                src={product.image_url} 
                                alt={product.name} 
                                fill 
                                className="object-cover" 
                              />
                            ) : (
                              <PackageSearch className="h-5 w-5 text-gray-500" />
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-semibold text-white tracking-wide">{product.name}</div>
                            <div className="text-xs text-gray-500 truncate max-w-[200px] mt-0.5">
                              {product.description || 'No description provided'}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* 2. Pricing Info */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-white font-medium">${product.retail_price.toFixed(2)}</div>
                        {product.is_wholesale && product.wholesale_price && (
                          <div className="text-[11px] text-brand-gold/80 mt-1 flex items-center font-medium tracking-wide">
                            <span className="text-gray-500 mr-1 uppercase">WS:</span> ${product.wholesale_price.toFixed(2)} 
                            <span className="text-gray-600 ml-1.5 opacity-70">(MOQ: {product.wholesale_moq})</span>
                          </div>
                        )}
                      </td>

                      {/* 3. Dynamic Stock Badge */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold tracking-wider uppercase border ${
                          product.stock_count > 10 
                            ? 'bg-green-950/30 text-green-400 border-green-900/50' 
                            : product.stock_count > 0
                            ? 'bg-amber-950/30 text-amber-400 border-amber-900/50'
                            : 'bg-red-950/30 text-red-400 border-red-900/50'
                        }`}>
                          {product.stock_count} units
                        </div>
                      </td>

                      {/* 4. Distribution Strategy Badge */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        {product.is_retail && product.is_wholesale ? (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-[0.1em] bg-brand-gold/10 text-brand-gold border border-brand-gold/20 shadow-[0_0_10px_rgba(212,175,55,0.05)]">
                            Retail & Wholesale
                          </span>
                        ) : product.is_wholesale ? (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-[0.1em] bg-blue-950/30 text-blue-400 border border-blue-900/50">
                            Wholesale Only
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-[0.1em] bg-brand-gray text-gray-300 border border-brand-border">
                            Retail Only
                          </span>
                        )}
                      </td>

                      {/* 5. Actions (Hover to reveal) */}
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          
                          {/* Edit Button */}
                          <Link 
                            href={`/admin/products/${product.id}/edit`}
                            className="p-2 bg-brand-gray/50 rounded-lg text-gray-400 hover:text-white hover:bg-brand-gray border border-transparent hover:border-brand-border transition-all"
                            title="Edit Product"
                          >
                            <Edit className="h-4 w-4" />
                          </Link>

                          {/* Delete Form (Invokes Server Action Native without JavaScript required) */}
                          <form action={deleteAction as any}>
                            <button 
                              type="submit" 
                              className="p-2 bg-red-950/10 rounded-lg text-red-500/70 hover:text-red-400 hover:bg-red-950/40 border border-transparent hover:border-red-900/50 transition-all"
                              title="Delete Product"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </form>

                        </div>
                      </td>

                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
