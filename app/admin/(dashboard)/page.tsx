import { DollarSign, ShoppingCart, Users, TrendingUp } from 'lucide-react'

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-white">Dashboard Overview</h1>
        <p className="text-sm text-gray-400 mt-2">Welcome back. Here is the current pulse of your premium storefront.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Stat Card 1 */}
        <div className="bg-brand-dark p-6 rounded-2xl border border-brand-border shadow-lg transition-all hover:border-brand-gold/30 hover:shadow-[0_0_20px_rgba(212,175,55,0.05)] relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <DollarSign className="h-24 w-24 text-brand-gold rotate-12 transform scale-150" />
          </div>
          <div className="flex items-center justify-between relative z-10">
            <h3 className="text-xs uppercase tracking-widest font-medium text-gray-400">Total Revenue</h3>
            <div className="p-2 bg-brand-gold/10 border border-brand-gold/20 rounded-xl">
              <DollarSign className="h-5 w-5 text-brand-gold" />
            </div>
          </div>
          <p className="text-3xl font-semibold text-white mt-5 relative z-10">$24,562.00</p>
          <div className="flex items-center mt-3 text-sm relative z-10">
            <span className="text-brand-gold font-medium flex items-center">
              <TrendingUp className="h-4 w-4 mr-1" />
              +12.5%
            </span>
            <span className="text-gray-500 ml-2 text-xs">from last month</span>
          </div>
        </div>

        {/* Stat Card 2 */}
        <div className="bg-brand-dark p-6 rounded-2xl border border-brand-border shadow-lg transition-all hover:border-brand-gold/30 hover:shadow-[0_0_20px_rgba(212,175,55,0.05)] relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <ShoppingCart className="h-24 w-24 text-brand-gold -rotate-12 transform scale-150" />
          </div>
          <div className="flex items-center justify-between relative z-10">
            <h3 className="text-xs uppercase tracking-widest font-medium text-gray-400">Active Orders</h3>
            <div className="p-2 bg-brand-gold/10 border border-brand-gold/20 rounded-xl">
              <ShoppingCart className="h-5 w-5 text-brand-gold" />
            </div>
          </div>
          <p className="text-3xl font-semibold text-white mt-5 relative z-10">156</p>
          <div className="flex items-center mt-3 text-sm relative z-10">
            <span className="text-brand-gold font-medium flex items-center">
              <TrendingUp className="h-4 w-4 mr-1" />
              +5.2%
            </span>
            <span className="text-gray-500 ml-2 text-xs">from last month</span>
          </div>
        </div>

        {/* Stat Card 3 */}
        <div className="bg-brand-dark p-6 rounded-2xl border border-brand-border shadow-lg transition-all hover:border-brand-gold/30 hover:shadow-[0_0_20px_rgba(212,175,55,0.05)] relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Users className="h-24 w-24 text-brand-gold rotate-6 transform scale-150" />
          </div>
          <div className="flex items-center justify-between relative z-10">
            <h3 className="text-xs uppercase tracking-widest font-medium text-gray-400">Total Customers</h3>
            <div className="p-2 bg-brand-gold/10 border border-brand-gold/20 rounded-xl">
              <Users className="h-5 w-5 text-brand-gold" />
            </div>
          </div>
          <p className="text-3xl font-semibold text-white mt-5 relative z-10">2,345</p>
          <div className="flex items-center mt-3 text-sm relative z-10">
            <span className="text-brand-gold font-medium flex items-center">
              <TrendingUp className="h-4 w-4 mr-1" />
              +18.1%
            </span>
            <span className="text-gray-500 ml-2 text-xs">from last month</span>
          </div>
        </div>

        {/* Stat Card 4 */}
        <div className="bg-brand-dark p-6 rounded-2xl border border-brand-border shadow-lg transition-all hover:border-brand-gold/30 hover:shadow-[0_0_20px_rgba(212,175,55,0.05)] relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <TrendingUp className="h-24 w-24 text-red-500/50 -rotate-12 transform scale-150" />
          </div>
          <div className="flex items-center justify-between relative z-10">
            <h3 className="text-xs uppercase tracking-widest font-medium text-gray-400">Conversion Rate</h3>
            <div className="p-2 bg-brand-gray border border-brand-border rounded-xl">
              <TrendingUp className="h-5 w-5 text-red-400" />
            </div>
          </div>
          <p className="text-3xl font-semibold text-white mt-5 relative z-10">3.24%</p>
          <div className="flex items-center mt-3 text-sm relative z-10">
            <span className="text-red-400 font-medium flex items-center">
              <TrendingUp className="h-4 w-4 mr-1 rotate-180" />
              -1.1%
            </span>
            <span className="text-gray-500 ml-2 text-xs">from last month</span>
          </div>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="bg-brand-dark rounded-2xl border border-brand-border shadow-lg overflow-hidden mt-8 relative">
        <div className="px-8 py-6 border-b border-brand-border flex justify-between items-center bg-brand-gray/30 backdrop-blur-sm">
          <h3 className="text-lg font-semibold text-white tracking-wide">Recent Orders</h3>
          <button className="text-xs uppercase tracking-widest font-bold text-brand-gold hover:text-brand-gold-hover transition-colors">
            View All
          </button>
        </div>
        <div className="p-8 flex flex-col items-center justify-center text-center py-24 relative overflow-hidden">
          {/* Subtle logo watermark in the background */}
          <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
             <ShoppingCart className="w-64 h-64 text-white" />
          </div>
          
          <div className="w-20 h-20 bg-brand-gray rounded-full flex items-center justify-center mb-6 border border-brand-border shadow-inner relative z-10">
            <ShoppingCart className="h-8 w-8 text-brand-gold" />
          </div>
          <p className="text-white font-semibold text-xl relative z-10">No orders yet</p>
          <p className="text-sm text-gray-400 mt-2 max-w-sm relative z-10 leading-relaxed">
            When your exclusive clientele begins placing orders, they will appear elegantly documented right here.
          </p>
        </div>
      </div>
    </div>
  )
}
