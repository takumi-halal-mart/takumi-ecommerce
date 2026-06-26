import { getOrders, deleteOrder } from './actions'
import { StatusDropdown } from './StatusDropdown'
import { Trash2, BoxSelect, MapPin, Phone, CreditCard, Calendar } from 'lucide-react'

export const metadata = {
  title: 'Orders | Takumi Admin',
}

export default async function OrdersPage() {
  const { data: orders, error } = await getOrders()

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      
      {/* Premium Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-white">Fulfillment & Orders</h1>
          <p className="text-sm text-gray-400 mt-2">Manage incoming purchases and update shipping logistics.</p>
        </div>
      </div>

      {/* Database Error Handling */}
      {error && (
        <div className="p-4 bg-red-950/30 border border-red-900/50 rounded-xl text-red-400 flex items-start">
          <svg className="w-5 h-5 mr-2 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Failed to load orders: {error}</span>
        </div>
      )}

      {/* Premium Data Table Container */}
      <div className="bg-brand-dark rounded-2xl border border-brand-border shadow-lg overflow-hidden relative">
        
        {/* Empty State */}
        {!orders || orders.length === 0 ? (
          <div className="p-12 flex flex-col items-center justify-center text-center py-32 relative overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
              <BoxSelect className="w-96 h-96 text-white" />
            </div>
            <div className="w-20 h-20 bg-brand-gray rounded-full flex items-center justify-center mb-6 border border-brand-border shadow-inner relative z-10">
              <BoxSelect className="h-8 w-8 text-brand-gold" />
            </div>
            <p className="text-white font-semibold text-xl relative z-10">No orders yet</p>
            <p className="text-sm text-gray-400 mt-2 max-w-sm leading-relaxed relative z-10">
              Once customers checkout on your storefront, their fulfillment requests will queue up here.
            </p>
          </div>
        ) : (
          
          /* Data Table */
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead>
                <tr className="bg-brand-gray/30 border-b border-brand-border backdrop-blur-sm">
                  <th className="px-6 py-5 text-xs uppercase tracking-[0.15em] font-bold text-brand-gold">Order Date</th>
                  <th className="px-6 py-5 text-xs uppercase tracking-[0.15em] font-bold text-brand-gold">Customer</th>
                  <th className="px-6 py-5 text-xs uppercase tracking-[0.15em] font-bold text-brand-gold">Delivery Logistics</th>
                  <th className="px-6 py-5 text-xs uppercase tracking-[0.15em] font-bold text-brand-gold">Financials</th>
                  <th className="px-6 py-5 text-xs uppercase tracking-[0.15em] font-bold text-brand-gold text-right">Status & Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border/50">
                {orders.map((order) => {
                  
                  // Native Server Action Binding for deletions
                  const deleteAction = deleteOrder.bind(null, order.id)
                  
                  // Date Formatting
                  const orderDate = new Date(order.created_at)
                  const formattedDate = orderDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                  const formattedTime = orderDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
                  
                  return (
                    <tr key={order.id} className="hover:bg-brand-gray/40 transition-colors group">
                      
                      {/* 1. Date */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm font-medium text-white">
                          <Calendar className="w-4 h-4 mr-2 text-brand-gold/70" />
                          {formattedDate}
                        </div>
                        <div className="text-xs text-gray-500 mt-1 ml-6">{formattedTime}</div>
                      </td>

                      {/* 2. Customer Profile */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-white tracking-wide">{order.customer_name}</div>
                        <div className="flex items-center text-xs text-gray-400 mt-1">
                          <Phone className="w-3 h-3 mr-1.5 opacity-70" />
                          {order.customer_phone}
                        </div>
                      </td>

                      {/* 3. Logistics / Address */}
                      <td className="px-6 py-4">
                        <div className="flex items-start text-xs text-gray-400 max-w-[250px] leading-relaxed">
                          <MapPin className="w-3.5 h-3.5 mr-1.5 shrink-0 mt-0.5 opacity-70" />
                          <span className="truncate whitespace-normal line-clamp-2">{order.delivery_address}</span>
                        </div>
                        <div className="text-[10px] uppercase tracking-widest text-brand-gold/60 mt-1 ml-5 font-bold">
                          {order.order_items?.length || 0} Items
                        </div>
                      </td>

                      {/* 4. Financials & Payment Method */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-white font-mono font-medium">¥{order.total_amount.toLocaleString('ja-JP')}</div>
                        <div className="mt-1.5">
                          {order.payment_method === 'Stripe' ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest bg-blue-950/30 text-blue-400 border border-blue-900/50">
                              <CreditCard className="w-3 h-3 mr-1" /> Stripe
                            </span>
                          ) : order.payment_method === 'WhatsApp' ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest bg-green-950/30 text-green-400 border border-green-900/50">
                              <Phone className="w-3 h-3 mr-1" /> WhatsApp
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest bg-brand-gold/10 text-brand-gold border border-brand-gold/20">
                              <BoxSelect className="w-3 h-3 mr-1" /> Wholesale
                            </span>
                          )}
                        </div>
                      </td>

                      {/* 5. Status & Actions */}
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end space-x-4">
                          
                          {/* Client Component Dropdown for Fulfillment Status */}
                          <StatusDropdown orderId={order.id} currentStatus={order.status} />

                          {/* Delete Form (Invokes Server Action Native without JavaScript required) */}
                          <form action={deleteAction as any} className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <button 
                              type="submit" 
                              className="p-1.5 bg-red-950/10 rounded-md text-red-500/70 hover:text-red-400 hover:bg-red-950/40 border border-transparent hover:border-red-900/50 transition-all"
                              title="Delete Order"
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
