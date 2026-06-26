'use client'

import { useTransition } from 'react'
import { toggleBannerStatus } from '../actions'
import { Loader2 } from 'lucide-react'

export function BannerToggle({ bannerId, initialStatus }: { bannerId: string, initialStatus: boolean }) {
  const [isPending, startTransition] = useTransition()

  const handleToggle = () => {
    startTransition(() => {
      toggleBannerStatus(bannerId, initialStatus)
    })
  }

  return (
    <label className="relative inline-flex items-center cursor-pointer group">
      <input 
        type="checkbox" 
        className="sr-only peer"
        checked={initialStatus}
        onChange={handleToggle}
        disabled={isPending}
      />
      <div className={`
        w-11 h-6 rounded-full peer transition-all
        ${initialStatus ? 'bg-brand-gold' : 'bg-brand-gray border border-brand-border'}
        peer-checked:after:translate-x-full peer-checked:after:border-white 
        after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
        after:bg-white after:border-gray-300 after:border after:rounded-full 
        after:h-5 after:w-5 after:transition-all
      `}></div>
      
      {isPending && (
        <span className="absolute -right-6">
          <Loader2 className="w-4 h-4 text-brand-gold animate-spin" />
        </span>
      )}
    </label>
  )
}
