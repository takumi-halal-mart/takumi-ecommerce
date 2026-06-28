import { getWholesaleInquiries, deleteInquiry } from '../actions'
import { InquiryStatusDropdown } from '@/app/admin/(dashboard)/orders/inquiries/InquiryStatusDropdown'
import { Trash2, Phone, Briefcase, ChevronLeft, Calendar } from 'lucide-react'
import Link from 'next/link'

export const metadata = {
  title: 'Wholesale Inquiries | Takumi Admin',
}

export default async function InquiriesPage() {
  const { data: inquiries, error } = await getWholesaleInquiries()

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      
      {/* Premium Header */}
      <div className="flex flex-col justify-between gap-4">
        <Link href="/admin/orders" className="text-gray-400 hover:text-white flex items-center gap-2 text-sm font-medium w-fit">
          <ChevronLeft className="w-4 h-4" /> Back to Orders
        </Link>
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-white">Wholesale Inquiries</h1>
          <p className="text-sm text-gray-400 mt-2">Manage business partnership requests and bulk sourcing quotes.</p>
        </div>
      </div>

      {/* Database Error Handling */}
      {error && (
        <div className="p-4 bg-red-950/30 border border-red-900/50 rounded-xl text-red-400 flex items-start">
          <svg className="w-5 h-5 mr-2 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Failed to load inquiries: {error}</span>
        </div>
      )}

      {/* Premium Data Table Container */}
      <div className="bg-brand-dark rounded-2xl border border-brand-border shadow-lg overflow-hidden relative">
        
        {/* Empty State */}
        {!inquiries || inquiries.length === 0 ? (
          <div className="p-12 flex flex-col items-center justify-center text-center py-32 relative overflow-hidden">
            <div className="w-20 h-20 bg-brand-gray rounded-full flex items-center justify-center mb-6 border border-brand-border shadow-inner relative z-10">
              <Briefcase className="h-8 w-8 text-brand-gold" />
            </div>
            <p className="text-white font-semibold text-xl relative z-10">No inquiries yet</p>
            <p className="text-sm text-gray-400 mt-2 max-w-sm leading-relaxed relative z-10">
              When businesses request custom sourcing or bulk orders, they will appear here.
            </p>
          </div>
        ) : (
          
          /* Data Table */
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead>
                <tr className="bg-brand-gray/30 border-b border-brand-border backdrop-blur-sm">
                  <th className="px-6 py-5 text-xs uppercase tracking-[0.15em] font-bold text-brand-gold">Date</th>
                  <th className="px-6 py-5 text-xs uppercase tracking-[0.15em] font-bold text-brand-gold">Business Details</th>
                  <th className="px-6 py-5 text-xs uppercase tracking-[0.15em] font-bold text-brand-gold">Sourcing Interest</th>
                  <th className="px-6 py-5 text-xs uppercase tracking-[0.15em] font-bold text-brand-gold">Volume</th>
                  <th className="px-6 py-5 text-xs uppercase tracking-[0.15em] font-bold text-brand-gold text-right">Status & Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border/50">
                {inquiries.map((inquiry) => {
                  
                  // Native Server Action Binding for deletions
                  const deleteAction = deleteInquiry.bind(null, inquiry.id)
                  
                  // Date Formatting
                  const dateObj = new Date(inquiry.created_at)
                  const formattedDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                  
                  return (
                    <tr key={inquiry.id} className="hover:bg-brand-gray/40 transition-colors group">
                      
                      {/* 1. Date */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm font-medium text-white">
                          <Calendar className="w-4 h-4 mr-2 text-brand-gold/70" />
                          {formattedDate}
                        </div>
                      </td>

                      {/* 2. Business Profile */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-white tracking-wide">{inquiry.business_name}</div>
                        <div className="text-xs text-gray-400 mt-1">{inquiry.business_type}</div>
                        <div className="flex items-center text-xs text-brand-gold mt-2">
                          <Phone className="w-3 h-3 mr-1.5 opacity-70" />
                          {inquiry.phone} ({inquiry.contact_person})
                        </div>
                      </td>

                      {/* 3. Sourcing Interest & Requests */}
                      <td className="px-6 py-4 min-w-[250px] max-w-[350px]">
                        <div className="text-sm font-medium text-white mb-1">{inquiry.primary_interest}</div>
                        {inquiry.sourcing_requests ? (
                          <div className="text-xs text-gray-400 leading-relaxed whitespace-pre-wrap">
                            {inquiry.sourcing_requests}
                          </div>
                        ) : (
                          <div className="text-xs text-gray-500 italic">No specific requests provided.</div>
                        )}
                      </td>

                      {/* 4. Volume */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="inline-flex items-center px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest bg-brand-gold/10 text-brand-gold border border-brand-gold/20">
                          {inquiry.estimated_volume}
                        </div>
                      </td>

                      {/* 5. Status & Actions */}
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end space-x-4">
                          
                          {/* Client Component Dropdown for Status */}
                          <InquiryStatusDropdown inquiryId={inquiry.id} currentStatus={inquiry.status} />

                          <div className="flex items-center lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300 gap-2 mt-4 lg:mt-0">
                            {/* Delete Form */}
                            <form action={deleteAction as any}>
                              <button 
                                type="submit" 
                                className="p-1.5 bg-red-950/10 rounded-md text-red-500/70 hover:text-red-400 hover:bg-red-950/40 border border-transparent hover:border-red-900/50 transition-all flex items-center justify-center"
                                title="Delete Inquiry"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </form>
                          </div>
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
