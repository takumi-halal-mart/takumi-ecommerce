'use client'

import React, { useState } from 'react'
import { updateInquiryStatus } from '../actions'

export function InquiryStatusDropdown({ inquiryId, currentStatus }: { inquiryId: string, currentStatus: string }) {
  const [isUpdating, setIsUpdating] = useState(false)

  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    setIsUpdating(true)
    const newStatus = e.target.value
    await updateInquiryStatus(inquiryId, newStatus)
    setIsUpdating(false)
  }

  // Get color based on status
  const getColor = (status: string) => {
    switch (status) {
      case 'New': return 'text-blue-400 border-blue-900/50 bg-blue-950/30'
      case 'Contacted': return 'text-brand-gold border-brand-gold/50 bg-brand-gold/10'
      case 'Qualified': return 'text-green-400 border-green-900/50 bg-green-950/30'
      case 'Rejected': return 'text-gray-400 border-gray-800 bg-gray-900/50'
      default: return 'text-gray-400 border-gray-800 bg-gray-900/50'
    }
  }

  return (
    <div className="relative">
      <select
        value={currentStatus}
        onChange={handleStatusChange}
        disabled={isUpdating}
        className={`appearance-none outline-none font-bold uppercase tracking-widest text-[10px] px-3 py-1.5 rounded-full border cursor-pointer transition-colors ${getColor(currentStatus)} ${isUpdating ? 'opacity-50 cursor-not-allowed' : 'hover:brightness-125'}`}
      >
        <option value="New" className="bg-brand-dark text-white">NEW</option>
        <option value="Contacted" className="bg-brand-dark text-white">CONTACTED</option>
        <option value="Qualified" className="bg-brand-dark text-white">QUALIFIED</option>
        <option value="Rejected" className="bg-brand-dark text-white">REJECTED</option>
      </select>
      
      {/* Custom Dropdown Arrow */}
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
        <svg className={`fill-current h-3 w-3 ${getColor(currentStatus).split(' ')[0]}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
        </svg>
      </div>
    </div>
  )
}
