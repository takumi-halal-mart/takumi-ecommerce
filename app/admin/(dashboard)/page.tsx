import { getDashboardMetrics, getLowStockAlerts } from './actions'
import { Banknote, Package, ShoppingCart, AlertTriangle, PlusCircle, Megaphone, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export const metadata = {
  title: 'Dashboard | Takumi Admin',
}

export default async function AdminDashboardPage() {
  // Fetch data in parallel for maximum performance
  const [metricsRes, alertsRes] = await Promise.all([
    getDashboardMetrics(),
    getLowStockAlerts()
  ])

  const metrics = metricsRes.data || { totalRevenue: 0, pendingOrders: 0, shippedOrders: 0, catalogSize: 0 }
  const alerts = alertsRes.data || []

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-white">Dashboard Overview</h1>
        <p className="text-sm text-gray-400 mt-2">Welcome back. Here is the current pulse of your premium storefront.</p>
      </div>

      {/* Top Section: The Big Three Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1: Total Revenue */}
        <div className="bg-brand-dark p-6 rounded-2xl border border-brand-border shadow-lg transition-all hover:border-brand-gold/30 hover:shadow-[0_0_20px_rgba(212,175,55,0.05)] relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Banknote className="h-32 w-32 text-brand-gold rotate-12 transform scale-150 -translate-y-4 translate-x-4" />
          </div>
          <div className="flex items-center justify-between relative z-10">
            <h3 className="text-xs uppercase tracking-widest font-medium text-gray-400">Total Revenue</h3>
            <div className="p-2 bg-brand-gold/10 border border-brand-gold/20 rounded-xl">
              <Banknote className="h-5 w-5 text-brand-gold" />
            </div>
          </div>
          <p className="text-3xl font-semibold text-white mt-5 relative z-10 font-mono tracking-tight">
            ¥{metrics.totalRevenue.toLocaleString('ja-JP')}
          </p>
        </div>

        {/* Card 2: Fulfillment Pipeline */}
        <div className="bg-brand-dark p-6 rounded-2xl border border-brand-border shadow-lg transition-all hover:border-brand-gold/30 hover:shadow-[0_0_20px_rgba(212,175,55,0.05)] relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Package className="h-32 w-32 text-brand-gold -rotate-12 transform scale-150 -translate-y-4 translate-x-4" />
          </div>
          <div className="flex items-center justify-between relative z-10">
            <h3 className="text-xs uppercase tracking-widest font-medium text-gray-400">Fulfillment Pipeline</h3>
            <div className="p-2 bg-brand-gold/10 border border-brand-gold/20 rounded-xl">
              <Package className="h-5 w-5 text-brand-gold" />
            </div>
          </div>
          <div className="mt-5 relative z-10 flex items-end space-x-2">
            <p className="text-3xl font-semibold text-white font-mono tracking-tight">{metrics.pendingOrders}</p>
            <p className="text-sm text-amber-400 font-medium mb-1 uppercase tracking-wider">Pending</p>
            <span className="text-gray-600 mb-1">/</span>
            <p className="text-lg font-semibold text-gray-300 font-mono tracking-tight mb-0.5">{metrics.shippedOrders}</p>
            <p className="text-[10px] text-gray-500 font-medium mb-1.5 uppercase tracking-wider">Shipped</p>
          </div>
        </div>

        {/* Card 3: Catalog Size */}
        <div className="bg-brand-dark p-6 rounded-2xl border border-brand-border shadow-lg transition-all hover:border-brand-gold/30 hover:shadow-[0_0_20px_rgba(212,175,55,0.05)] relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <ShoppingCart className="h-32 w-32 text-brand-gold rotate-6 transform scale-150 -translate-y-4 translate-x-4" />
          </div>
          <div className="flex items-center justify-between relative z-10">
            <h3 className="text-xs uppercase tracking-widest font-medium text-gray-400">Catalog Size</h3>
            <div className="p-2 bg-brand-gold/10 border border-brand-gold/20 rounded-xl">
              <ShoppingCart className="h-5 w-5 text-brand-gold" />
            </div>
          </div>
          <div className="mt-5 relative z-10 flex items-end space-x-2">
            <p className="text-3xl font-semibold text-white font-mono tracking-tight">{metrics.catalogSize}</p>
            <p className="text-sm text-gray-400 font-medium mb-1 uppercase tracking-wider">Active Products</p>
          </div>
        </div>

      </div>

      {/* Bottom Section: Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Low Stock Alerts */}
        <div className="lg:col-span-2 bg-brand-dark rounded-2xl border border-brand-border shadow-lg overflow-hidden flex flex-col">
          <div className="px-6 py-5 border-b border-brand-border bg-brand-gray/30 flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center">
              <AlertTriangle className="w-4 h-4 mr-2 text-amber-500" />
              Low Stock Alerts
            </h3>
            <Link href="/admin/products" className="text-xs text-brand-gold hover:text-brand-gold-hover uppercase tracking-widest font-bold transition-colors flex items-center group">
              Manage Inventory <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          
          <div className="p-6 flex-1">
            {alerts.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12 border border-dashed border-brand-border rounded-xl bg-brand-gray/10">
                <div className="w-12 h-12 bg-green-950/30 text-green-500 rounded-full flex items-center justify-center mb-3">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-white font-medium">All inventory levels are healthy.</p>
                <p className="text-xs text-gray-500 mt-1">No products are currently under the 5 unit threshold.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {alerts.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 rounded-xl bg-brand-gray/20 border border-brand-border hover:border-brand-gold/30 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 relative rounded-lg border border-brand-border overflow-hidden bg-brand-gray shrink-0">
                        {item.image_url ? (
                          <Image src={item.image_url} alt={item.name} fill className="object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-600">
                            <ShoppingCart className="w-5 h-5" />
                          </div>
                        )}
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-white tracking-wide">{item.name}</h4>
                        <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-0.5">Product ID: {item.id.split('-')[0]}</p>
                      </div>
                    </div>
                    
                    <div className={`px-3 py-1.5 rounded-lg border flex items-center font-bold font-mono text-sm ${
                      item.stock_count === 0 
                        ? 'bg-red-950/30 border-red-900/50 text-red-500' 
                        : 'bg-amber-950/30 border-amber-900/50 text-amber-500'
                    }`}>
                      {item.stock_count} <span className="text-[10px] uppercase ml-1 opacity-70">Left</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Quick Actions Panel */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-brand-dark rounded-2xl border border-brand-border shadow-lg p-6">
            <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-6">Quick Actions</h3>
            
            <div className="space-y-4">
              <Link 
                href="/admin/products/new" 
                className="group flex flex-col p-5 rounded-xl border border-brand-border bg-brand-gray/30 hover:bg-brand-gold/10 hover:border-brand-gold/50 transition-all text-left"
              >
                <div className="w-10 h-10 rounded-full bg-brand-gold/10 text-brand-gold flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <PlusCircle className="w-5 h-5" />
                </div>
                <h4 className="text-white font-bold tracking-wide group-hover:text-brand-gold transition-colors">Add New Product</h4>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">Expand your catalog with new retail or wholesale items.</p>
              </Link>

              <Link 
                href="/admin/promotions/banners" 
                className="group flex flex-col p-5 rounded-xl border border-brand-border bg-brand-gray/30 hover:bg-brand-gold/10 hover:border-brand-gold/50 transition-all text-left"
              >
                <div className="w-10 h-10 rounded-full bg-brand-gold/10 text-brand-gold flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Megaphone className="w-5 h-5" />
                </div>
                <h4 className="text-white font-bold tracking-wide group-hover:text-brand-gold transition-colors">Manage Marketing</h4>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">Upload live banners and toggle storefront promotions.</p>
              </Link>
            </div>
          </div>
          
          {/* Subtle Help Box */}
          <div className="p-5 rounded-2xl bg-brand-gray/20 border border-brand-border/50 text-center">
            <p className="text-xs text-gray-400 leading-relaxed">
              Need technical assistance? <br/> Contact the <span className="text-brand-gold font-medium">Takumi Engineering</span> team.
            </p>
          </div>
        </div>

      </div>
    </div>
  )
}
