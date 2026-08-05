import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { EditBannerForm } from './EditBannerForm'
import { PromotionalBanner } from '../../../actions'

export const metadata = {
  title: 'Edit Banner | Takumi Admin',
}

export default async function EditBannerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const supabase = await createClient()
  
  const { data: banner } = await supabase
    .from('promotional_banners')
    .select('*')
    .eq('id', id)
    .single()
    
  if (!banner) {
    redirect('/admin/promotions/banners')
  }

  return (
    <div className="max-w-3xl mx-auto">
      <EditBannerForm banner={banner as PromotionalBanner} />
    </div>
  )
}
