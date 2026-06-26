import { DollarSign, ShoppingCart, Users, TrendingUp } from 'lucide-react'

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard Overview</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Welcome back. Here's what's happening with your store today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Stat Card 1 */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Revenue</h3>
            <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
              <DollarSign className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-4">$24,562.00</p>
          <div className="flex items-center mt-2 text-sm">
            <span className="text-green-600 dark:text-green-400 font-medium flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" />
              +12.5%
            </span>
            <span className="text-gray-500 dark:text-gray-400 ml-2">from last month</span>
          </div>
        </div>

        {/* Stat Card 2 */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Orders</h3>
            <div className="p-2 bg-purple-50 dark:bg-purple-900/30 rounded-lg">
              <ShoppingCart className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-4">156</p>
          <div className="flex items-center mt-2 text-sm">
            <span className="text-green-600 dark:text-green-400 font-medium flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" />
              +5.2%
            </span>
            <span className="text-gray-500 dark:text-gray-400 ml-2">from last month</span>
          </div>
        </div>

        {/* Stat Card 3 */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Customers</h3>
            <div className="p-2 bg-amber-50 dark:bg-amber-900/30 rounded-lg">
              <Users className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-4">2,345</p>
          <div className="flex items-center mt-2 text-sm">
            <span className="text-green-600 dark:text-green-400 font-medium flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" />
              +18.1%
            </span>
            <span className="text-gray-500 dark:text-gray-400 ml-2">from last month</span>
          </div>
        </div>

        {/* Stat Card 4 */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Conversion Rate</h3>
            <div className="p-2 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg">
              <TrendingUp className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-4">3.24%</p>
          <div className="flex items-center mt-2 text-sm">
            <span className="text-red-600 dark:text-red-400 font-medium flex items-center">
              <TrendingUp className="h-3 w-3 mr-1 rotate-180" />
              -1.1%
            </span>
            <span className="text-gray-500 dark:text-gray-400 ml-2">from last month</span>
          </div>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden mt-8">
        <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Recent Orders</h3>
          <button className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
            View All
          </button>
        </div>
        <div className="p-6 flex flex-col items-center justify-center text-center py-16">
          <div className="w-16 h-16 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4 border border-gray-100 dark:border-gray-700">
            <ShoppingCart className="h-8 w-8 text-gray-400 dark:text-gray-500" />
          </div>
          <p className="text-gray-900 dark:text-white font-medium text-lg">No orders yet</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-sm">
            When your customers place an order, it will appear here in the dashboard.
          </p>
        </div>
      </div>
    </div>
  )
}
