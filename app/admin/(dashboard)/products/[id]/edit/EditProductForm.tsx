'use client'

import { useState, useRef, useEffect, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { useActionState } from 'react'
import { UploadCloud, Image as ImageIcon, ArrowLeft, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { updateProduct, Product } from '../../actions'

export function EditProductForm({ product }: { product: Product }) {
  const router = useRouter()
  
  // Bind the productId to the server action
  const updateProductWithId = updateProduct.bind(null, product.id)
  const [state, formAction, isServerPending] = useActionState(updateProductWithId, { error: '', success: false })
  
  // Local state initialized with existing product data
  const [isWholesale, setIsWholesale] = useState(product.is_wholesale)
  const [dragActive, setDragActive] = useState(false)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  
  // Preview shows existing image by default
  const [imagePreview, setImagePreview] = useState<string | null>(product.image_url)
  const [isCompressing, setIsCompressing] = useState(false)
  
  const [isPending, startTransition] = useTransition()
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (state?.success) {
      router.push('/admin/products')
    }
  }, [state, router])

  // --- Image Compression Logic ---
  const compressImage = async (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      const img = new window.Image()
      img.src = URL.createObjectURL(file)
      
      img.onload = () => {
        const canvas = document.createElement('canvas')
        let width = img.width
        let height = img.height
        const maxDim = 1200
        
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width)
            width = maxDim
          } else {
            width = Math.round((width * maxDim) / height)
            height = maxDim
          }
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
            if (blob.size > 100 * 1024 && quality > 0.1) {
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
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file.')
      return
    }

    try {
      setIsCompressing(true)
      setImagePreview(URL.createObjectURL(file))
      
      const compressed = await compressImage(file)
      setSelectedImage(compressed)
      setImagePreview(URL.createObjectURL(compressed))
    } catch (err) {
      console.error('Image compression failed:', err)
      alert('Failed to compress image. Try a different file.')
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
        <Link href="/admin/products" className="p-2 bg-brand-gray/50 text-gray-400 hover:text-white rounded-lg hover:bg-brand-gray transition-colors border border-transparent hover:border-brand-border">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-white">Edit Product</h1>
          <p className="text-sm text-gray-400 mt-1">Modifying: <span className="text-brand-gold">{product.name}</span></p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Image Upload */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-brand-dark rounded-2xl border border-brand-border shadow-lg p-6">
              <h3 className="text-sm uppercase tracking-widest font-bold text-brand-gold mb-4">Product Image</h3>
              
              <div 
                className={`relative border-2 border-dashed rounded-xl overflow-hidden transition-all flex flex-col items-center justify-center min-h-[250px] cursor-pointer
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
                      <span className="text-white font-medium bg-black/50 px-4 py-2 rounded-lg backdrop-blur-sm">Change Image</span>
                    </div>
                  </>
                ) : (
                  <div className="text-center px-4">
                    <div className="w-12 h-12 rounded-full bg-brand-gold/10 text-brand-gold flex items-center justify-center mx-auto mb-3">
                      <UploadCloud className="w-6 h-6" />
                    </div>
                    <p className="text-sm font-medium text-white">Click or drag new image</p>
                    <p className="text-xs text-gray-500 mt-1">Leaves existing image if blank</p>
                  </div>
                )}
                
                {isCompressing && (
                  <div className="absolute inset-0 bg-brand-dark/80 backdrop-blur-sm flex flex-col items-center justify-center z-10">
                    <Loader2 className="w-8 h-8 text-brand-gold animate-spin mb-2" />
                    <p className="text-xs font-bold text-brand-gold uppercase tracking-widest">Compressing to WebP</p>
                  </div>
                )}
              </div>
              
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files && handleImage(e.target.files[0])} />
            </div>
          </div>

          {/* Right Column: Form Fields */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-brand-dark rounded-2xl border border-brand-border shadow-lg p-6 sm:p-8">
              
              <div className="space-y-6">
                <div>
                  <label className="block text-xs uppercase tracking-widest font-semibold text-brand-gold mb-2">Product Name</label>
                  <input
                    name="name" type="text" required defaultValue={product.name}
                    className="w-full px-4 py-3 rounded-lg border border-brand-border bg-brand-gray text-white focus:ring-1 focus:ring-brand-gold focus:border-brand-gold outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest font-semibold text-brand-gold mb-2">Description</label>
                  <textarea
                    name="description" rows={4} defaultValue={product.description || ''}
                    className="w-full px-4 py-3 rounded-lg border border-brand-border bg-brand-gray text-white focus:ring-1 focus:ring-brand-gold focus:border-brand-gold outline-none transition-all resize-none"
                  ></textarea>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-xs uppercase tracking-widest font-semibold text-brand-gold mb-2">Retail Price (¥)</label>
                    <input
                      name="retail_price" type="number" step="1" required defaultValue={product.retail_price ?? ''}
                      className="w-full px-4 py-3 rounded-lg border border-brand-border bg-brand-gray text-white focus:ring-1 focus:ring-brand-gold focus:border-brand-gold outline-none transition-all font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest font-semibold text-brand-gold mb-2">Stock Level</label>
                    <input
                      name="stock_count" type="number" required defaultValue={product.stock_count}
                      className="w-full px-4 py-3 rounded-lg border border-brand-border bg-brand-gray text-white focus:ring-1 focus:ring-brand-gold focus:border-brand-gold outline-none transition-all font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest font-semibold text-brand-gold mb-2">Unit Type</label>
                    <input
                      name="unit_type" type="text" list="unit-suggestions" defaultValue={product.unit_type}
                      className="w-full px-4 py-3 rounded-lg border border-brand-border bg-brand-gray text-white focus:ring-1 focus:ring-brand-gold focus:border-brand-gold outline-none transition-all"
                    />
                    <datalist id="unit-suggestions">
                      <option value="piece" />
                      <option value="100g" />
                      <option value="250g" />
                      <option value="500g" />
                      <option value="1kg" />
                      <option value="pack" />
                      <option value="bottle" />
                    </datalist>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-brand-border">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h4 className="text-sm uppercase tracking-widest font-bold text-brand-gold">Wholesale Settings</h4>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" name="is_wholesale" className="sr-only peer"
                      checked={isWholesale} onChange={(e) => setIsWholesale(e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-brand-gray rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-gold"></div>
                  </label>
                </div>

                {isWholesale && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 animate-in fade-in slide-in-from-top-2">
                    <div>
                      <label className="block text-xs uppercase tracking-widest font-semibold text-brand-gold mb-2">Wholesale Price (¥)</label>
                      <input
                        name="wholesale_price" type="number" step="1" required={isWholesale} defaultValue={product.wholesale_price || ''}
                        className="w-full px-4 py-3 rounded-lg border border-brand-border bg-brand-gray/50 text-white focus:ring-1 focus:ring-brand-gold focus:border-brand-gold outline-none transition-all font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-widest font-semibold text-brand-gold mb-2">Minimum Order (MOQ)</label>
                      <input
                        name="wholesale_moq" type="number" required={isWholesale} defaultValue={product.wholesale_moq || ''}
                        className="w-full px-4 py-3 rounded-lg border border-brand-border bg-brand-gray/50 text-white focus:ring-1 focus:ring-brand-gold focus:border-brand-gold outline-none transition-all font-mono"
                      />
                    </div>
                  </div>
                )}
              </div>

              {state?.error && (
                <div className="mt-6 p-4 rounded-lg bg-red-950/40 text-red-400 text-sm border border-red-900/50">
                  {state.error}
                </div>
              )}

              <div className="mt-8">
                <button
                  type="submit" disabled={isSubmitting || isCompressing}
                  className="w-full py-4 px-4 bg-brand-gold hover:bg-brand-gold-hover text-brand-black font-bold uppercase tracking-[0.15em] text-sm rounded-xl transition-all shadow-[0_0_20px_rgba(212,175,55,0.15)] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center group"
                >
                  {isSubmitting ? <Loader2 className="animate-spin w-5 h-5" /> : 'Save Changes'}
                </button>
              </div>

            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
