'use client'

import { useState, useTransition, useEffect } from 'react'
import { useActionState } from 'react'
import { StoreSettings, updateStoreSettings } from './actions'
import { Loader2, Truck, MessageCircle, CheckCircle2, AlertTriangle, Activity } from 'lucide-react'

export function SettingsForm({ initialSettings }: { initialSettings: StoreSettings }) {
  const [state, formAction, isServerPending] = useActionState(updateStoreSettings, { error: '', success: false })
  const [isPending, startTransition] = useTransition()
  
  const [isOpen, setIsOpen] = useState(initialSettings.is_store_open)
  const [showSuccess, setShowSuccess] = useState(false)

  const isSubmitting = isPending || isServerPending

  useEffect(() => {
    if (state.success) {
      setShowSuccess(true)
      const timer = setTimeout(() => setShowSuccess(false), 5000)
      return () => clearTimeout(timer)
    }
  }, [state.success])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    startTransition(() => {
      formAction(formData)
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      
      {/* SECTION 1: Operational Status (Master Switch) */}
      <div className="bg-brand-dark rounded-2xl border border-brand-border shadow-xl p-6 sm:p-8 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
           <Activity className="w-48 h-48 text-brand-gold -translate-y-12 translate-x-12" />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-start justify-between relative z-10 gap-6">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center">
              Operational Status (Master Switch)
            </h3>
            <p className="text-xs text-gray-500 mt-2 max-w-md leading-relaxed">
              When closed, the checkout is disabled and a &quot;We are restocking&quot; banner appears on the storefront.
            </p>
          </div>
          
          <div className="flex flex-col items-start sm:items-end shrink-0">
            <label className="relative inline-flex items-center cursor-pointer scale-110 mb-4">
              <input 
                type="checkbox" 
                name="is_store_open" 
                className="sr-only peer"
                checked={isOpen}
                onChange={(e) => setIsOpen(e.target.checked)}
              />
              <div className="w-14 h-7 bg-brand-gray/80 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-gray-400 after:border-gray-300 after:border after:rounded-full after:h-[22px] after:w-[22px] after:transition-all peer-checked:bg-brand-gold peer-checked:after:bg-white border border-brand-border shadow-inner"></div>
            </label>
            
            <div className={`px-4 py-2 rounded-lg border font-mono text-[11px] font-bold tracking-[0.2em] uppercase transition-all shadow-sm ${
              isOpen 
                ? 'bg-green-950/20 border-green-900/50 text-green-500' 
                : 'bg-red-950/20 border-red-900/50 text-red-500'
            }`}>
              {isOpen ? 'Accepting Orders' : 'Store Closed'}
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: Logistics & Fee Controls */}
      <div className="bg-brand-dark rounded-2xl border border-brand-border shadow-xl p-6 sm:p-8">
        <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-6 pb-4 border-b border-brand-border flex items-center">
          <Truck className="w-4 h-4 mr-2 text-brand-gold" /> Logistics & Fee Controls
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <div className="space-y-6">
            <div>
              <label className="block text-xs uppercase tracking-widest font-semibold text-brand-gold mb-2">Flat-Rate Delivery Fee (¥)</label>
              <input
                name="delivery_fee"
                type="number"
                step="1"
                required
                defaultValue={initialSettings.delivery_fee}
                className="w-full px-4 py-3 rounded-lg border border-brand-border bg-brand-gray text-white focus:ring-1 focus:ring-brand-gold focus:border-brand-gold outline-none transition-all placeholder-gray-600 font-mono"
                placeholder="1000"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-widest font-semibold text-brand-gold mb-2">Free Shipping Threshold (¥)</label>
              <input
                name="free_shipping_threshold"
                type="number"
                step="1"
                required
                defaultValue={initialSettings.free_shipping_threshold}
                className="w-full px-4 py-3 rounded-lg border border-brand-border bg-brand-gray text-white focus:ring-1 focus:ring-brand-gold focus:border-brand-gold outline-none transition-all placeholder-gray-600 font-mono"
                placeholder="10000"
              />
              <p className="text-[10px] text-gray-500 mt-1.5 uppercase tracking-wider">Apply free shipping if cart is over this amount.</p>
            </div>
          </div>

          <div className="space-y-6 border-t md:border-t-0 md:border-l border-brand-border pt-6 md:pt-0 md:pl-8">
            <div>
              <label className="block text-xs uppercase tracking-widest font-semibold text-brand-gold mb-2 flex items-center">
                 <MessageCircle className="w-3 h-3 mr-1" /> Notification Routing
              </label>
              <input
                name="whatsapp_number"
                type="text"
                required
                defaultValue={initialSettings.whatsapp_number}
                className="w-full px-4 py-3 rounded-lg border border-brand-border bg-brand-gray text-white focus:ring-1 focus:ring-brand-gold focus:border-brand-gold outline-none transition-all placeholder-gray-600 font-mono tracking-wide"
                placeholder="+819012345678"
              />
              <p className="text-[10px] text-gray-500 mt-1.5 uppercase tracking-wider leading-relaxed">
                The primary WhatsApp number management is redirected to.
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* Notifications */}
      {state?.error && (
        <div className="p-4 rounded-xl bg-red-950/40 text-red-400 border border-red-900/50 flex items-start">
          <AlertTriangle className="h-5 w-5 mr-3 shrink-0 mt-0.5" />
          <p className="text-sm">{state.error}</p>
        </div>
      )}

      {showSuccess && (
        <div className="p-4 rounded-xl bg-green-950/30 text-green-400 border border-green-900/50 flex items-start animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="h-5 w-5 mr-3 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-green-500">Configuration Saved</p>
            <p className="text-[11px] opacity-80 mt-0.5 tracking-wide">The global storefront cache has been successfully purged.</p>
          </div>
        </div>
      )}

      {/* Submit Action */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-4 px-4 bg-brand-gold hover:bg-brand-gold-hover text-brand-black font-bold uppercase tracking-[0.15em] text-sm rounded-xl transition-all shadow-[0_0_20px_rgba(212,175,55,0.15)] hover:shadow-[0_0_25px_rgba(212,175,55,0.3)] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center group"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5 text-brand-black" />
              Deploying Global Updates...
            </>
          ) : (
            'Save Global Configuration'
          )}
        </button>
      </div>

    </form>
  )
}
