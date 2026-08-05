'use client'

import { useState, useRef, useTransition, useEffect } from 'react'
import { useActionState } from 'react'
import { UploadCloud, Image as ImageIcon, Loader2, ArrowLeft } from 'lucide-react'
import { updateBanner, PromotionalBanner } from '../../../actions'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export function EditBannerForm({ banner }: { banner: PromotionalBanner }) {
  const router = useRouter()
  
  const updateBannerWithId = async (prevState: any, formData: FormData) => {
    return updateBanner(banner.id, prevState, formData)
  }
  const [state, formAction, isServerPending] = useActionState(updateBannerWithId, { error: '', success: false })
  
  const [dragActive, setDragActive] = useState(false)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(banner.image_url)
  const [isCompressing, setIsCompressing] = useState(false)
  
  const [isPending, startTransition] = useTransition()
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (state?.success) {
      router.push('/admin/promotions/banners')
    }
  }, [state, router])

  // Canvas compression for Wide Hero Banners
  const compressImage = async (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      const img = new window.Image()
      img.src = URL.createObjectURL(file)
      
      img.onload = () => {
        const canvas = document.createElement('canvas')
        let width = img.width
        let height = img.height
        const maxDim = 1920 // Hero banners need high width, but we cap at 1920px
        
        if (width > maxDim) {
          height = Math.round((height * maxDim) / width)
          width = maxDim
        }
        
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        if (!ctx) return reject('Canvas context failed')
        
        ctx.drawImage(img, 0, 0, width, height)

        let quality = 0.9
        const attemptCompress = () => {
          canvas.toBlob((blob) => {
            if (!blob) return reject('Compression failed')
            
            // Allow up to 150KB for large hero banners
            if (blob.size > 150 * 1024 && quality > 0.1) {
              quality -= 0.1
              attemptCompress()
            } else {
              const compressedFile = new File([blob], file.name.replace(/\.[^/.]+$/, "") + ".webp", {
                type: 'image/webp',
              })
              resolve(compressedFile)
            }
          }, 'image/webp', quality)
        }
        
        attemptCompress()
      }
      img.onerror = (e) => reject(e)
    })
  }

  const handleImage = async (file: File | undefined) => {
    if (!file) return
    if (!file.type.startsWith('image/')) return alert('Please upload an image file.')

    try {
      setIsCompressing(true)
      setImagePreview(URL.createObjectURL(file))
      
      const compressed = await compressImage(file)
      setSelectedImage(compressed)
      setImagePreview(URL.createObjectURL(compressed))
    } catch (err) {
      console.error('Compression failed:', err)
      alert('Failed to compress image.')
    } finally {
      setIsCompressing(false)
    }
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    if (selectedImage) {
      formData.set('image', selectedImage)
    }

    startTransition(() => {
      formAction(formData)
    })
  }

  const isSubmitting = isPending || isServerPending || state?.success

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      <div className="flex items-center space-x-4">
        <Link href="/admin/promotions/banners" className="p-2 bg-brand-gray/50 text-gray-400 hover:text-white rounded-lg hover:bg-brand-gray transition-colors border border-transparent hover:border-brand-border">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-white">Edit Banner</h1>
          <p className="text-sm text-gray-400 mt-1">Modifying existing promotional banner overlay and details.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-brand-dark rounded-2xl border border-brand-border shadow-lg p-6 sm:p-8 space-y-6">
        
        {/* Upload Zone */}
        <div>
          <label className="block text-xs uppercase tracking-widest font-semibold text-brand-gold mb-3">Hero Image Upload</label>
          <div 
            className={`relative border-2 border-dashed rounded-xl overflow-hidden transition-all flex flex-col items-center justify-center min-h-[200px] cursor-pointer
              ${dragActive ? 'border-brand-gold bg-brand-gold/5' : 'border-brand-border bg-brand-gray/30 hover:border-brand-gold/50'}
              ${imagePreview ? 'border-none bg-brand-gray' : ''}
            `}
            onDragOver={(e) => { e.preventDefault(); setDragActive(true) }}
            onDragLeave={() => setDragActive(false)}
            onDrop={(e) => {
              e.preventDefault()
              setDragActive(false)
              if (e.dataTransfer.files && e.dataTransfer.files[0]) handleImage(e.dataTransfer.files[0])
            }}
            onClick={() => fileInputRef.current?.click()}
          >
            {imagePreview ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imagePreview} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <span className="text-white font-medium bg-black/50 px-4 py-2 rounded-lg backdrop-blur-sm">Replace Image</span>
                </div>
              </>
            ) : (
              <div className="text-center px-4 py-8">
                <div className="w-12 h-12 rounded-full bg-brand-gold/10 text-brand-gold flex items-center justify-center mx-auto mb-3">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <p className="text-sm font-medium text-white">Click or drag banner image here</p>
                <p className="text-xs text-gray-500 mt-1">Recommended: 1920x600px</p>
              </div>
            )}
            
            {isCompressing && (
              <div className="absolute inset-0 bg-brand-dark/80 backdrop-blur-sm flex flex-col items-center justify-center z-10">
                <Loader2 className="w-8 h-8 text-brand-gold animate-spin mb-2" />
                <p className="text-xs font-bold text-brand-gold uppercase tracking-widest">Compressing to WebP</p>
              </div>
            )}
          </div>
          
          <input 
            ref={fileInputRef} type="file" accept="image/*" className="hidden" 
            onChange={(e) => e.target.files && handleImage(e.target.files[0])}
          />
          
          {selectedImage && !isCompressing && (
            <div className="mt-3 text-xs text-brand-gold/80 flex items-center justify-end">
              <ImageIcon className="w-3 h-3 mr-1" /> Optimized Size: {(selectedImage.size / 1024).toFixed(1)} KB
            </div>
          )}
          {!selectedImage && imagePreview && (
            <p className="text-xs text-gray-500 mt-2 text-right">Leaves existing image if blank.</p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs uppercase tracking-widest font-semibold text-brand-gold mb-2">Heading Overlay (Optional)</label>
            <input
              name="heading" type="text"
              defaultValue={banner.heading || ''}
              className="w-full px-4 py-3 rounded-lg border border-brand-border bg-brand-gray text-white focus:ring-1 focus:ring-brand-gold focus:border-brand-gold outline-none transition-all placeholder-gray-600"
              placeholder="e.g. Summer Premium Collection"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest font-semibold text-brand-gold mb-2">Subtext Overlay (Optional)</label>
            <input
              name="subtext" type="text"
              defaultValue={banner.subtext || ''}
              className="w-full px-4 py-3 rounded-lg border border-brand-border bg-brand-gray text-white focus:ring-1 focus:ring-brand-gold focus:border-brand-gold outline-none transition-all placeholder-gray-600"
              placeholder="e.g. Up to 40% Off Storewide"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs uppercase tracking-widest font-semibold text-brand-gold mb-2">Redirect URL (On Click)</label>
          <input
            name="redirect_url" type="text"
            defaultValue={banner.redirect_url || ''}
            className="w-full px-4 py-3 rounded-lg border border-brand-border bg-brand-gray text-white focus:ring-1 focus:ring-brand-gold focus:border-brand-gold outline-none transition-all placeholder-gray-600"
            placeholder="e.g. /products?collection=summer"
          />
        </div>

        {state?.error && (
          <div className="p-4 rounded-lg bg-red-950/40 text-red-400 text-sm border border-red-900/50 flex items-start">
            <svg className="w-5 h-5 mr-2 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span>{state.error}</span>
          </div>
        )}

        <button
          type="submit" disabled={isSubmitting || isCompressing}
          className="w-full py-4 bg-brand-gold hover:bg-brand-gold-hover text-brand-black font-bold uppercase tracking-[0.15em] text-sm rounded-xl transition-all shadow-[0_0_20px_rgba(212,175,55,0.15)] hover:shadow-[0_0_25px_rgba(212,175,55,0.3)] disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
        >
          {isSubmitting ? <Loader2 className="animate-spin w-5 h-5" /> : 'Save Changes'}
        </button>

      </form>
    </div>
  )
}
