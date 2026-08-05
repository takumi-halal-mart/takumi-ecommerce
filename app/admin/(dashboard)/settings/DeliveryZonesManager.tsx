'use client'

import { useState } from 'react'
import { Trash2, Plus, Loader2, MapPin } from 'lucide-react'
import { addDeliveryZone, deleteDeliveryZone } from './actions'

export function DeliveryZonesManager({ initialZones }: { initialZones: any[] }) {
  const [zones, setZones] = useState(initialZones)
  const [newCity, setNewCity] = useState('')
  const [newFee, setNewFee] = useState<number | ''>('')
  const [isAdding, setIsAdding] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCity.trim() || newFee === '') return

    setIsAdding(true)
    const res = await addDeliveryZone(newCity.trim(), Number(newFee))
    
    if (res.success && res.data) {
      setZones([...zones, res.data].sort((a, b) => a.city_name.localeCompare(b.city_name)))
      setNewCity('')
      setNewFee('')
    } else {
      alert(res.error || 'Failed to add delivery zone.')
    }
    setIsAdding(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this delivery zone?')) return
    
    setDeletingId(id)
    const res = await deleteDeliveryZone(id)
    
    if (res.success) {
      setZones(zones.filter(z => z.id !== id))
    } else {
      alert(res.error || 'Failed to delete delivery zone.')
    }
    setDeletingId(null)
  }

  return (
    <div className="bg-brand-dark rounded-2xl border border-brand-border shadow-xl p-6 sm:p-8 relative overflow-hidden mt-8">
      <div className="flex items-center justify-between border-b border-brand-border pb-4 mb-6">
        <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center">
          <MapPin className="w-4 h-4 mr-2 text-brand-gold" /> Custom Delivery Zones
        </h3>
      </div>

      <div className="space-y-4 mb-8">
        {zones.length === 0 ? (
          <div className="p-8 text-center bg-brand-gray/20 rounded-xl border border-brand-border/50 border-dashed">
            <p className="text-sm text-gray-500">No custom delivery zones configured. All orders will use the flat-rate fee.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {zones.map(zone => (
              <div key={zone.id} className="flex items-center justify-between bg-brand-gray p-4 rounded-xl border border-brand-border">
                <div>
                  <div className="font-bold text-white text-sm">{zone.city_name}</div>
                  <div className="text-xs text-brand-gold mt-1 uppercase tracking-wider font-mono">
                    {zone.delivery_fee === 0 ? 'FREE DELIVERY' : `¥${zone.delivery_fee.toLocaleString()}`}
                  </div>
                </div>
                <button 
                  onClick={() => handleDelete(zone.id)}
                  disabled={deletingId === zone.id}
                  className="p-2 text-gray-500 hover:text-red-500 transition-colors bg-brand-dark rounded-lg border border-brand-border"
                >
                  {deletingId === zone.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-4 items-end bg-brand-gray/30 p-5 rounded-xl border border-brand-border border-dashed">
        <div className="flex-1 w-full">
          <label className="block text-xs uppercase tracking-widest font-semibold text-gray-400 mb-2 ml-1">City / Region Name</label>
          <input
            type="text"
            required
            value={newCity}
            onChange={e => setNewCity(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-brand-border bg-brand-dark text-white focus:ring-1 focus:ring-brand-gold outline-none transition-all placeholder-gray-600 font-mono text-sm"
            placeholder="e.g. Sammu / Sanmu (山武市)"
          />
        </div>
        <div className="w-full sm:w-32 shrink-0">
          <label className="block text-xs uppercase tracking-widest font-semibold text-gray-400 mb-2 ml-1">Fee (¥)</label>
          <input
            type="number"
            required
            min="0"
            value={newFee}
            onChange={e => setNewFee(e.target.value === '' ? '' : Number(e.target.value))}
            className="w-full px-4 py-3 rounded-lg border border-brand-border bg-brand-dark text-white focus:ring-1 focus:ring-brand-gold outline-none transition-all font-mono text-sm"
            placeholder="0"
          />
        </div>
        <button 
          type="submit"
          disabled={isAdding || !newCity.trim() || newFee === ''}
          className="h-[46px] w-full sm:w-auto px-6 bg-brand-gold hover:bg-brand-gold-hover text-brand-black font-bold uppercase tracking-widest text-xs rounded-lg transition-all disabled:opacity-50 flex items-center justify-center shrink-0"
        >
          {isAdding ? <Loader2 className="w-4 h-4 animate-spin" /> : (
            <>
              <Plus className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Add Zone</span>
            </>
          )}
        </button>
      </form>
    </div>
  )
}
