'use client'

import { useTransition } from 'react'
import { updateOrderStatus } from './actions'
import { Loader2 } from 'lucide-react'

interface StatusDropdownProps {
  orderId: string
  currentStatus: 'Pending' | 'Shipped' | 'Completed'
}

export function StatusDropdown({ orderId, currentStatus }: StatusDropdownProps) {
  const [isPending, startTransition] = useTransition()

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as 'Pending' | 'Shipped' | 'Completed'
    
    // Smoothly fire the server action in the background
    startTransition(() => {
      updateOrderStatus(orderId, newStatus)
    })
  }

  return (
    <div className="relative inline-flex items-center">
      <select 
        disabled={isPending}
        value={currentStatus}
        onChange={handleChange}
        className={`appearance-none bg-brand-gray border rounded-lg pl-3 pr-8 py-1.5 text-[10px] font-bold uppercase tracking-[0.1em] outline-none cursor-pointer transition-colors shadow-inner ${
          currentStatus === 'Completed' ? 'text-green-400 border-green-900/50 bg-green-950/20' : 
          currentStatus === 'Shipped' ? 'text-blue-400 border-blue-900/50 bg-blue-950/20' : 
          'text-amber-400 border-amber-900/50 bg-amber-950/20'
        } disabled:opacity-50`}
      >
        <option value="Pending">Pending</option>
        <option value="Shipped">Shipped</option>
        <option value="Completed">Completed</option>
      </select>
      
      {/* Dropdown Arrow or Spinner */}
      <div className="absolute right-2 pointer-events-none flex items-center">
        {isPending ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin text-gray-400" />
        ) : (
          <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        )}
      </div>
    </div>
  )
}
