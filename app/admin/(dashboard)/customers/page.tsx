import { getCRMUsers } from './actions'
import { MessageCircle, Users, AlertTriangle } from 'lucide-react'

export const metadata = {
  title: 'Customer Directory | Takumi Admin',
}

export default async function CustomersPage() {
  const { data: customers, error } = await getCRMUsers()

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-white flex items-center">
            <Users className="mr-3 text-brand-gold h-8 w-8" /> 
            Customer Directory
          </h1>
          <p className="text-sm text-gray-400 mt-2 max-w-xl leading-relaxed">
            Manage your VIP clients, track lifetime values, and seamlessly connect with them via WhatsApp.
          </p>
        </div>
      </div>

      {error ? (
        <div className="p-4 rounded-xl bg-red-950/40 text-red-400 border border-red-900/50 flex items-start">
          <AlertTriangle className="h-5 w-5 mr-3 shrink-0 mt-0.5" />
          <p className="text-sm">{error}</p>
        </div>
      ) : customers && customers.length > 0 ? (
        <div className="bg-brand-dark rounded-2xl border border-brand-border shadow-xl overflow-hidden relative">
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-brand-gray/50 border-b border-brand-border">
                  <th className="px-6 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">Customer</th>
                  <th className="px-6 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">Phone</th>
                  <th className="px-6 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">Total Orders</th>
                  <th className="px-6 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">Lifetime Value</th>
                  <th className="px-6 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Primary Address</th>
                  <th className="px-6 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest text-right whitespace-nowrap">Contact</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border">
                {customers.map((customer, index) => {
                  
                  // 1. Dynamic Tagging Logic
                  const isWholesale = customer.wholesale_orders_count > 0 || customer.lifetime_value > 50000;
                  
                  // 2. Automated WhatsApp Data Link Generation
                  // Strips out all spaces, hyphens, and plus signs to ensure the WA API doesn't crash.
                  const cleanPhone = customer.customer_phone.replace(/\D/g, '');
                  const message = encodeURIComponent(`Hello ${customer.customer_name}, this is management from Takumi Halal Mart regarding your recent orders...`);
                  const waLink = `https://wa.me/${cleanPhone}?text=${message}`;

                  return (
                    <tr 
                      key={customer.customer_phone || index} 
                      className="hover:bg-brand-gray/20 transition-colors group"
                    >
                      {/* Name & Dynamic VIP Tag */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="text-sm text-white font-medium tracking-wide">{customer.customer_name}</span>
                          {isWholesale && (
                            <span className="inline-flex items-center mt-2 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest bg-brand-gold/10 text-brand-gold border border-brand-gold/20 shadow-[0_0_10px_rgba(212,175,55,0.05)] w-max">
                              Wholesale Client
                            </span>
                          )}
                        </div>
                      </td>
                      
                      {/* Phone Number */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 font-mono">
                        {customer.customer_phone}
                      </td>

                      {/* Frequency */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 font-mono font-medium">
                        {customer.total_orders}
                      </td>

                      {/* Lifetime Value */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-brand-gold font-mono font-bold tracking-wider">
                        ¥{customer.lifetime_value.toLocaleString('ja-JP')}
                      </td>

                      {/* Address */}
                      <td className="px-6 py-4 text-sm text-gray-400 max-w-xs truncate" title={customer.primary_address}>
                        {customer.primary_address || <span className="italic text-gray-600">No address on file</span>}
                      </td>

                      {/* One-Click Connect Button */}
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <a 
                          href={waLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center px-4 py-2 bg-green-950/20 text-green-500 rounded-lg border border-transparent hover:border-green-500/30 hover:bg-green-900/30 hover:text-green-400 transition-all group/btn shadow-[0_0_15px_rgba(34,197,94,0.05)]"
                          title="Message on WhatsApp"
                        >
                          <MessageCircle className="h-4 w-4 mr-2" />
                          <span className="text-[11px] font-bold tracking-[0.1em] uppercase">Connect</span>
                        </a>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-brand-dark rounded-2xl border border-brand-border p-12 text-center flex flex-col items-center justify-center shadow-lg">
          <div className="w-20 h-20 bg-brand-gray rounded-full flex items-center justify-center mb-6 border border-brand-border">
            <Users className="h-10 w-10 text-brand-gold" />
          </div>
          <h3 className="text-xl font-semibold text-white tracking-tight">No Customers Found</h3>
          <p className="text-sm text-gray-400 mt-2 max-w-md leading-relaxed">When customers place their first orders, their automated CRM profiles will be securely generated and displayed here.</p>
        </div>
      )}
    </div>
  )
}
