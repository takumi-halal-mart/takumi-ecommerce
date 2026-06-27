'use client'

import { useActionState, useTransition, useState } from 'react'
import { Coupon, createCoupon, toggleCouponStatus, deleteCoupon } from './actions'
import { Loader2, Tag, Trash2, Activity, TicketPercent, AlertTriangle, Copy, Check } from 'lucide-react'

export function CouponManager({ initialCoupons }: { initialCoupons: Coupon[] }) {
  const [state, formAction, isServerPending] = useActionState(createCoupon, { error: '', success: false })
  const [isPending, startTransition] = useTransition()
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const isSubmitting = isPending || isServerPending

  const handleCopy = (code: string, id: string) => {
    navigator.clipboard.writeText(code)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleToggle = (id: string, currentStatus: boolean) => {
    startTransition(() => {
      toggleCouponStatus(id, currentStatus)
    })
  }

  const handleDelete = (id: string) => {
    if(confirm('Are you sure you want to permanently delete this coupon? This action cannot be undone.')) {
      startTransition(() => {
        deleteCoupon(id)
      })
    }
  }

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return 'Never'
    // Extract YYYY-MM-DD directly to prevent local timezone shifts from changing the day
    const [year, month, day] = dateStr.split('T')[0].split('-')
    return `${month}/${day}/${year}` // Formats reliably to MM/DD/YYYY
  }

  return (
    <div className="space-y-12">
      
      {/* 1. The Promo Code Creator (Form) */}
      <div className="bg-brand-dark border border-brand-border rounded-2xl shadow-xl overflow-hidden relative group">
        
        {/* Aesthetic Background element */}
        <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none transition-opacity group-hover:opacity-10">
           <TicketPercent className="w-64 h-64 text-brand-gold -translate-y-24 translate-x-12" />
        </div>

        <div className="p-6 sm:p-8 relative z-10">
          <h2 className="text-sm font-bold text-white uppercase tracking-widest flex items-center mb-6 pb-4 border-b border-brand-border">
            <Tag className="w-4 h-4 mr-3 text-brand-gold" /> Promo Code Creator
          </h2>
          
          <form action={formAction} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              <div className="space-y-2">
                <label className="block text-xs uppercase tracking-widest font-semibold text-brand-gold">Promo Code</label>
                <input 
                  type="text" 
                  name="code" 
                  required 
                  className="w-full px-4 py-3 bg-brand-gray/50 text-white border border-brand-border rounded-xl focus:ring-1 focus:ring-brand-gold outline-none uppercase font-mono tracking-widest placeholder-gray-600 transition-all" 
                  placeholder="WELCOME10" 
                />
                <p className="text-[10px] text-gray-500 uppercase tracking-wider">Must be entirely unique.</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-xs uppercase tracking-widest font-semibold text-brand-gold">Discount Type</label>
                  <select 
                    name="discount_type" 
                    className="w-full px-4 py-3 bg-brand-gray/50 text-white border border-brand-border rounded-xl outline-none focus:ring-1 focus:ring-brand-gold transition-all"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (¥)</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="block text-xs uppercase tracking-widest font-semibold text-brand-gold">Value</label>
                  <input 
                    type="number" 
                    name="discount_value" 
                    required 
                    step="1" 
                    min="1"
                    className="w-full px-4 py-3 bg-brand-gray/50 text-white border border-brand-border rounded-xl outline-none focus:ring-1 focus:ring-brand-gold font-mono transition-all placeholder-gray-600" 
                    placeholder="10" 
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-6 border-t border-brand-border/50">
              <div className="space-y-2">
                <label className="block text-xs uppercase tracking-widest font-semibold text-brand-gold">Min Spend (¥)</label>
                <input 
                  type="number" 
                  name="min_spend" 
                  defaultValue="0" 
                  min="0"
                  className="w-full px-4 py-3 bg-brand-gray/50 text-white border border-brand-border rounded-xl outline-none focus:ring-1 focus:ring-brand-gold font-mono transition-all" 
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-xs uppercase tracking-widest font-semibold text-brand-gold">Usage Limit</label>
                <input 
                  type="number" 
                  name="usage_limit" 
                  min="1"
                  className="w-full px-4 py-3 bg-brand-gray/50 text-white border border-brand-border rounded-xl outline-none focus:ring-1 focus:ring-brand-gold font-mono transition-all placeholder-gray-600" 
                  placeholder="Unlimited" 
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs uppercase tracking-widest font-semibold text-brand-gold">Limit 1 use per customer</label>
                <div className="pt-2">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      name="limit_per_customer" 
                      className="sr-only peer"
                      defaultChecked
                    />
                    <div className="w-11 h-6 bg-brand-gray border border-brand-border rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-black after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-gray-400 after:border-gray-400 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand-gold peer-checked:border-brand-gold peer-checked:after:bg-black shadow-inner"></div>
                  </label>
                </div>
                <p className="text-[10px] text-gray-500 uppercase tracking-wider leading-tight">Enforces a strict one-time use policy per phone number during checkout.</p>
              </div>
              
              <div className="space-y-2">
                <label className="block text-xs uppercase tracking-widest font-semibold text-brand-gold">Expiration Date</label>
                <input 
                  type="date" 
                  name="expiration_date" 
                  className="w-full px-4 py-3 bg-brand-gray/50 text-white border border-brand-border rounded-xl outline-none focus:ring-1 focus:ring-brand-gold font-mono transition-all" 
                />
              </div>
            </div>

            {state?.error && (
              <div className="flex items-start p-4 rounded-xl bg-red-950/40 border border-red-900/50 text-red-400 animate-in fade-in slide-in-from-top-2">
                <AlertTriangle className="w-5 h-5 mr-3 shrink-0 mt-0.5" />
                <p className="text-sm">{state.error}</p>
              </div>
            )}

            <button 
              type="submit" 
              disabled={isSubmitting} 
              className="w-full mt-4 bg-brand-gold hover:bg-brand-gold-hover text-brand-black font-bold uppercase tracking-[0.2em] text-sm py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(212,175,55,0.15)] hover:shadow-[0_0_25px_rgba(212,175,55,0.3)] disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center group"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 mr-3 animate-spin text-brand-black" />
                  Generating Code...
                </>
              ) : (
                'Deploy Promotional Code'
              )}
            </button>
          </form>
        </div>
      </div>

      {/* 2. The Active Coupons Matrix */}
      <div className="bg-brand-dark border border-brand-border rounded-2xl shadow-xl overflow-hidden">
        <div className="p-6 sm:p-8 border-b border-brand-border bg-brand-gray/10">
          <h2 className="text-sm font-bold text-white uppercase tracking-widest flex items-center">
            <Activity className="w-4 h-4 mr-3 text-brand-gold" /> Active Coupons Matrix
          </h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="bg-brand-gray/40 text-[10px] uppercase tracking-widest text-brand-gold border-b border-brand-border">
              <tr>
                <th className="px-6 py-4 whitespace-nowrap">Code</th>
                <th className="px-6 py-4 whitespace-nowrap">Discount</th>
                <th className="px-6 py-4 whitespace-nowrap">Min Spend</th>
                <th className="px-6 py-4 whitespace-nowrap">Usage Stats</th>
                <th className="px-6 py-4 whitespace-nowrap">Expiry</th>
                <th className="px-6 py-4 text-center whitespace-nowrap">Status</th>
                <th className="px-6 py-4 text-right whitespace-nowrap">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border/50">
              {initialCoupons.map((coupon) => {
                const isDepleted = coupon.usage_limit !== null && coupon.times_used >= coupon.usage_limit;
                
                return (
                  <tr 
                    key={coupon.id} 
                    className={`hover:bg-brand-gray/20 transition-colors ${isDepleted ? 'opacity-60 bg-red-950/5' : ''}`}
                  >
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className={`font-mono font-bold tracking-widest px-3 py-1 rounded bg-brand-gray/80 border border-brand-border shadow-inner ${isDepleted ? 'text-gray-500' : 'text-white'}`}>
                          {coupon.code}
                        </span>
                        <button 
                          onClick={() => handleCopy(coupon.code, coupon.id)}
                          className="ml-2 p-1.5 text-gray-500 hover:text-brand-gold hover:bg-brand-gold/10 rounded-md transition-all"
                          title="Copy to clipboard"
                        >
                          {copiedId === coupon.id ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                        {coupon.limit_per_customer ? (
                          <span className="ml-3 px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest bg-brand-gold/10 text-brand-gold rounded border border-brand-gold/20">
                            1x Per User
                          </span>
                        ) : (
                          <span className="ml-3 px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest bg-brand-gray/50 text-gray-400 rounded border border-brand-border">
                            Multi-use
                          </span>
                        )}
                        {isDepleted && (
                          <span className="ml-2 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest bg-red-950/80 text-red-400 rounded border border-red-900/50">
                            Depleted
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap font-medium text-white">
                      {coupon.discount_type === 'percentage' 
                        ? <span className="text-green-400">{coupon.discount_value}% OFF</span>
                        : <span className="text-green-400">¥{coupon.discount_value} OFF</span>
                      }
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      {coupon.min_spend > 0 ? <span className="font-mono">¥{coupon.min_spend}</span> : <span className="text-gray-500">None</span>}
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className={`font-mono font-bold ${isDepleted ? 'text-red-400' : 'text-white'}`}>{coupon.times_used}</span>
                        <span className="mx-1 text-gray-500">/</span>
                        <span className="font-mono text-gray-400">{coupon.usage_limit === null ? '∞' : coupon.usage_limit}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap font-mono text-xs">
                      {formatDate(coupon.expiration_date)}
                    </td>
                    <td className="px-6 py-5 text-center whitespace-nowrap">
                      <label className="relative inline-flex items-center cursor-pointer hover:opacity-80 transition-opacity">
                        <input 
                          type="checkbox" 
                          className="sr-only peer"
                          checked={coupon.is_active}
                          onChange={() => handleToggle(coupon.id, coupon.is_active)}
                          disabled={isPending}
                        />
                        <div className="w-11 h-6 bg-brand-gray border border-brand-border rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-gray-400 after:border-gray-400 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-500/80 peer-checked:border-green-500/50 peer-checked:after:bg-white shadow-inner"></div>
                      </label>
                    </td>
                    <td className="px-6 py-5 text-right whitespace-nowrap">
                      <button 
                        onClick={() => handleDelete(coupon.id)} 
                        disabled={isPending} 
                        className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-950/40 border border-transparent hover:border-red-900/50 rounded-lg transition-all disabled:opacity-50"
                        title="Delete permanently"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                )
              })}
              
              {initialCoupons.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center">
                    <Tag className="w-8 h-8 text-brand-gold/30 mx-auto mb-3" />
                    <p className="text-sm font-medium text-gray-400">No promotional codes active.</p>
                    <p className="text-xs text-gray-500 mt-1">Use the creator above to generate your first discount.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
    </div>
  )
}
