import Image from 'next/image'
import { createClient } from '@/utils/supabase/server'
import { deleteBanner, PromotionalBanner } from '../actions'
import { BannerUploadForm } from './BannerUploadForm'
import { BannerToggle } from './BannerToggle'
import { Trash2, Link as LinkIcon, Image as ImageIcon } from 'lucide-react'

export const metadata = {
  title: 'Live Banners | Takumi Admin',
}

export default async function BannersPage() {
  const supabase = await createClient()

  // Fetch all banners
  const { data: banners, error } = await supabase
    .from('promotional_banners')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      
      {/* Header section */}
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-white">Live Banner Manager</h1>
        <p className="text-sm text-gray-400 mt-2">Design and upload large hero banners for your storefront homepage.</p>
      </div>

      {/* Upload Component */}
      <section>
        <BannerUploadForm />
      </section>

      {/* Live Banners List */}
      <section className="pt-8 border-t border-brand-border">
        <h2 className="text-xl font-bold text-white mb-6 tracking-wide flex items-center">
          <ImageIcon className="w-5 h-5 mr-3 text-brand-gold" />
          Active & Past Banners
        </h2>

        {error && (
          <div className="p-4 bg-red-950/30 text-red-400 border border-red-900/50 rounded-xl mb-6">
            Failed to load banners: {error.message}
          </div>
        )}

        {!banners || banners.length === 0 ? (
          <div className="p-12 text-center bg-brand-dark/50 rounded-2xl border border-brand-border border-dashed">
            <ImageIcon className="w-10 h-10 text-gray-500 mx-auto mb-3 opacity-50" />
            <p className="text-white font-medium">No banners uploaded yet.</p>
            <p className="text-gray-500 text-sm mt-1">Use the form above to deploy your first promotional hero.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {banners.map((banner: PromotionalBanner) => {
              const deleteAction = deleteBanner.bind(null, banner.id, banner.image_url)

              return (
                <div key={banner.id} className="group bg-brand-dark rounded-2xl border border-brand-border overflow-hidden shadow-lg hover:shadow-brand-gold/5 transition-all">
                  
                  {/* Visual Image Banner Section */}
                  <div className="relative w-full h-48 bg-brand-gray/50 border-b border-brand-border overflow-hidden flex items-center justify-center">
                    <Image 
                      src={banner.image_url} 
                      alt="Banner Preview" 
                      fill 
                      className={`object-cover transition-transform duration-500 group-hover:scale-105 ${!banner.is_active && 'opacity-40 grayscale'}`}
                    />
                    
                    {/* Simulated Storefront Overlay */}
                    {(banner.heading || banner.subtext) && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 bg-black/30 backdrop-blur-[2px]">
                        {banner.heading && <h3 className="text-2xl font-black text-white drop-shadow-lg tracking-wider uppercase">{banner.heading}</h3>}
                        {banner.subtext && <p className="text-white/90 drop-shadow-md mt-2 font-medium">{banner.subtext}</p>}
                      </div>
                    )}
                    
                    {!banner.is_active && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="bg-black/80 text-white font-bold uppercase tracking-widest px-4 py-2 rounded-lg border border-gray-600 backdrop-blur-sm">Inactive</span>
                      </div>
                    )}
                  </div>

                  {/* Banner Controls & Metadata */}
                  <div className="p-5 flex items-center justify-between">
                    <div className="flex-1 min-w-0 pr-4">
                      {banner.redirect_url ? (
                        <a href={banner.redirect_url} target="_blank" rel="noreferrer" className="inline-flex items-center text-sm font-medium text-brand-gold hover:text-brand-gold-hover truncate max-w-full group/link">
                          <LinkIcon className="w-4 h-4 mr-1.5 shrink-0" />
                          <span className="truncate underline-offset-4 group-hover/link:underline">{banner.redirect_url}</span>
                        </a>
                      ) : (
                        <span className="text-xs text-gray-500 italic">No redirect URL assigned</span>
                      )}
                      <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-2">
                        Uploaded: {new Date(banner.created_at).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex items-center space-x-6">
                      <div className="flex flex-col items-center">
                        <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-2">Visibility</span>
                        <BannerToggle bannerId={banner.id} initialStatus={banner.is_active} />
                      </div>
                      
                      <div className="h-8 w-px bg-brand-border"></div>

                      <form action={deleteAction as any}>
                        <button 
                          type="submit" 
                          title="Delete Banner"
                          className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-950/20 rounded-lg transition-colors border border-transparent hover:border-red-900/50"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </form>
                    </div>
                  </div>

                </div>
              )
            })}
          </div>
        )}
      </section>

    </div>
  )
}
