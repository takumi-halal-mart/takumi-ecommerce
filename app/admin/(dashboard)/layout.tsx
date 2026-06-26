import { ReactNode } from 'react'
import Image from 'next/image'
import { LogOut } from 'lucide-react'
import { Sidebar } from '@/components/admin/Sidebar'
import { logout } from './actions'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || !user.email) {
    redirect('/admin/login')
  }

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden bg-brand-black text-white">
      <Sidebar userEmail={user.email} />

      {/* Main Content Wrapper */}
      <main className="flex-1 flex flex-col min-w-0 h-full overflow-hidden relative">
        {/* Inner Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 lg:p-10 relative">
          {/* Subtle background glow for the main content area */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-gold/5 rounded-full blur-[150px] pointer-events-none -z-10" />
          {children}
        </div>
      </main>
    </div>
  )
}
