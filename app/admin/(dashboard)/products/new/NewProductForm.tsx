'use client'

import { useState, useRef, useEffect, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { useActionState } from 'react'
import { UploadCloud, Image as ImageIcon, ArrowLeft, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { createProduct } from '../actions'
import { CategoryCombobox } from '@/components/admin/CategoryCombobox'
import { Category } from '@/app/admin/(dashboard)/categories/actions'

export function NewProductForm({ initialCategories }: { initialCategories: Category[] }) {
  const router = useRouter()
  const [state, formAction, isServerPending] = useActionState(createProduct, { error: '', success: false })
  
  // Local state
  const [visibilityMode, setVisibilityMode] = useState<'retail' | 'wholesale' | 'both'>('both')
  const [dragActive, setDragActive] = useState(false)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isCompressing, setIsCompressing] = useState(false)
  const [unitType, setUnitType] = useState('')
  
  // Transition for the form wrapper
  const [isPending, startTransition] = useTransition()
  
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Redirect on success
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
        const maxDim = 1200 // Max safe dimension for e-commerce
        
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
            
            // If greater than 100KB and quality can still be lowered
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

  // Handle Image Selection & Trigger Compression
  const handleImage = async (file: File | undefined) => {
    if (!file) return
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file.')
      return
    }

    try {
      setIsCompressing(true)
      // Preview original immediately
      setImagePreview(URL.createObjectURL(file))
      
      // Compress to WebP under 100KB
      const compressed = await compressImage(file)
      setSelectedImage(compressed)
      
      // Update preview to compressed version
      setImagePreview(URL.createObjectURL(compressed))
    } catch (err) {
      console.error('Image compression failed:', err)
      alert('Failed to compress image. Try a different file.')
    } finally {
      setIsCompressing(false)
    }
  }

  // Intercept form submission to inject the compressed image
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    // Replace the native file input with our compressed File object
    if (selectedImage) {
      formData.set('image', selectedImage)
    }

    startTransition(() => {
      formAction(formData)
    })
  }

  // Loading state checks
  const isSubmitting = isPending || isServerPending || state?.success

  // Dynamic Unit Helper
  const getStockHelperText = (unit: string) => {
    if (!unit) return 'Total quantity available.'
    const lowerUnit = unit.toLowerCase().trim()
    if (/\d+(g|kg|ml|l|oz|lb)$/i.test(lowerUnit)) {
      return `How many ${unit} portions do you have?`
    }
    const pluralUnit = lowerUnit.endsWith('s') ? lowerUnit : `${lowerUnit}s`
    return `How many ${pluralUnit} do you have?`
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      
      <div className="flex items-center space-x-4">
        <Link href="/admin/products" className="p-2 bg-brand-gray/50 text-gray-400 hover:text-white rounded-lg hover:bg-brand-gray transition-colors border border-transparent hover:border-brand-border">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-white">Add New Product</h1>
          <p className="text-sm text-gray-400 mt-1">Configure your product details and pricing.</p>
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
                  if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                    handleImage(e.dataTransfer.files[0])
                  }
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
                    <p className="text-sm font-medium text-white">Click or drag image here</p>
                    <p className="text-xs text-gray-500 mt-1">JPEG, PNG, WEBP (Max 10MB)</p>
                  </div>
                )}
                
                {/* Visual Compression Overlay */}
                {isCompressing && (
                  <div className="absolute inset-0 bg-brand-dark/80 backdrop-blur-sm flex flex-col items-center justify-center z-10">
                    <Loader2 className="w-8 h-8 text-brand-gold animate-spin mb-2" />
                    <p className="text-xs font-bold text-brand-gold uppercase tracking-widest">Compressing to WebP</p>
                  </div>
                )}
              </div>
              
              <input 
                ref={fileInputRef}
                type="file" 
                accept="image/*"
                className="hidden" 
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleImage(e.target.files[0])
                  }
                }}
              />
              
              {selectedImage && !isCompressing && (
                <div className="mt-4 p-3 bg-brand-gray/50 rounded-lg border border-brand-border flex items-center justify-between">
                  <div className="flex items-center text-xs text-gray-400">
                    <ImageIcon className="w-4 h-4 mr-2 text-brand-gold" />
                    Optimized WebP 
                  </div>
                  <span className="text-xs font-mono text-brand-gold bg-brand-gold/10 px-2 py-0.5 rounded">
                    {(selectedImage.size / 1024).toFixed(1)} KB
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Form Fields */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-brand-dark rounded-2xl border border-brand-border shadow-lg p-6 sm:p-8">
              
              <div className="space-y-6">
                <div>
                  <label className="block text-xs uppercase tracking-widest font-semibold text-brand-gold mb-2">Product Name</label>
                  <input
                    name="name"
                    type="text"
                    required
                    className="w-full px-4 py-3 rounded-lg border border-brand-border bg-brand-gray text-white focus:ring-1 focus:ring-brand-gold focus:border-brand-gold outline-none transition-all placeholder-gray-600"
                    placeholder="e.g. Premium Matcha Powder"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest font-semibold text-brand-gold mb-2">Product Category</label>
                  <CategoryCombobox initialCategories={initialCategories} />
                  <p className="text-[10px] text-gray-500 mt-1.5 uppercase tracking-wider">Select a category or dynamically create a new one.</p>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest font-semibold text-brand-gold mb-2">Description</label>
                  <textarea
                    name="description"
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg border border-brand-border bg-brand-gray text-white focus:ring-1 focus:ring-brand-gold focus:border-brand-gold outline-none transition-all placeholder-gray-600 resize-none"
                    placeholder="Describe the product details..."
                  ></textarea>
                </div>

                <div className={`grid grid-cols-1 md:grid-cols-${visibilityMode === 'wholesale' ? '2' : '3'} gap-6`}>
                  {['retail', 'both'].includes(visibilityMode) && (
                    <div>
                      <label className="block text-xs uppercase tracking-widest font-semibold text-brand-gold mb-2">Retail Price (¥)</label>
                      <input
                        name="retail_price"
                        type="number"
                        step="1"
                        required
                        className="w-full px-4 py-3 rounded-lg border border-brand-border bg-brand-gray text-white focus:ring-1 focus:ring-brand-gold focus:border-brand-gold outline-none transition-all placeholder-gray-600 font-mono"
                        placeholder="0"
                      />
                    </div>
                  )}
                  <div>
                    <label className="block text-xs uppercase tracking-widest font-semibold text-brand-gold mb-2">Initial Stock</label>
                    <input
                      name="stock_count"
                      type="number"
                      defaultValue="0"
                      required
                      className="w-full px-4 py-3 rounded-lg border border-brand-border bg-brand-gray text-white focus:ring-1 focus:ring-brand-gold focus:border-brand-gold outline-none transition-all placeholder-gray-600 font-mono"
                      placeholder="0"
                    />
                    <p className="text-[10px] text-gray-400 mt-1.5 uppercase tracking-wider">{getStockHelperText(unitType)}</p>
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest font-semibold text-brand-gold mb-2">Unit Type</label>
                    <input
                      name="unit_type"
                      type="text"
                      list="unit-suggestions"
                      value={unitType}
                      onChange={(e) => setUnitType(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-brand-border bg-brand-gray text-white focus:ring-1 focus:ring-brand-gold focus:border-brand-gold outline-none transition-all placeholder-gray-600"
                      placeholder="e.g., 500g, 1kg, bottle, pack"
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
                    <p className="text-[10px] text-gray-500 mt-1.5 uppercase tracking-wider">Type any custom unit, or select a suggestion.</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-brand-border">
                <div className="mb-6">
                  <h4 className="text-sm uppercase tracking-widest font-bold text-brand-gold">Visibility Mode</h4>
                  <p className="text-xs text-gray-500 mt-1 mb-4">Select how this product is distributed and priced.</p>
                  
                  {/* Hidden input to pass value easily to server action */}
                  <input type="hidden" name="visibility_mode" value={visibilityMode} />

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {(['retail', 'wholesale', 'both'] as const).map((mode) => (
                      <label 
                        key={mode} 
                        className={`flex items-center justify-center py-3 px-4 rounded-xl border cursor-pointer transition-all ${
                          visibilityMode === mode 
                            ? 'bg-brand-gold/10 border-brand-gold text-brand-gold shadow-[0_0_10px_rgba(212,175,55,0.1)]' 
                            : 'bg-brand-gray/30 border-brand-border text-gray-400 hover:border-brand-gold/50'
                        }`}
                      >
                        <input 
                          type="radio" 
                          name="_ignore_visibility" 
                          value={mode} 
                          className="sr-only"
                          checked={visibilityMode === mode}
                          onChange={() => setVisibilityMode(mode)}
                        />
                        <span className="text-xs font-bold uppercase tracking-widest">
                          {mode === 'retail' ? 'Retail Only' : mode === 'wholesale' ? 'Wholesale Only' : 'Both (B2C + B2B)'}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {['wholesale', 'both'].includes(visibilityMode) && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 animate-in fade-in slide-in-from-top-2">
                    <div>
                      <label className="block text-xs uppercase tracking-widest font-semibold text-brand-gold mb-2">Wholesale Price (¥)</label>
                      <input
                        name="wholesale_price"
                        type="number"
                        step="1"
                        required={['wholesale', 'both'].includes(visibilityMode)}
                        className="w-full px-4 py-3 rounded-lg border border-brand-border bg-brand-gray/50 text-white focus:ring-1 focus:ring-brand-gold focus:border-brand-gold outline-none transition-all placeholder-gray-600 font-mono"
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-widest font-semibold text-brand-gold mb-2">Minimum Order (MOQ)</label>
                      <input
                        name="wholesale_moq"
                        type="number"
                        defaultValue="10"
                        required={['wholesale', 'both'].includes(visibilityMode)}
                        className="w-full px-4 py-3 rounded-lg border border-brand-border bg-brand-gray/50 text-white focus:ring-1 focus:ring-brand-gold focus:border-brand-gold outline-none transition-all placeholder-gray-600 font-mono"
                        placeholder="10"
                      />
                    </div>
                  </div>
                )}
              </div>

              {state?.error && (
                <div className="mt-6 p-4 rounded-lg bg-red-950/40 text-red-400 text-sm border border-red-900/50 flex items-start">
                  <svg className="w-5 h-5 mr-2 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span>{state.error}</span>
                </div>
              )}

              <div className="mt-8">
                <button
                  type="submit"
                  disabled={isSubmitting || isCompressing}
                  className="w-full py-4 px-4 bg-brand-gold hover:bg-brand-gold-hover text-brand-black font-bold uppercase tracking-[0.15em] text-sm rounded-xl transition-all shadow-[0_0_20px_rgba(212,175,55,0.15)] hover:shadow-[0_0_25px_rgba(212,175,55,0.3)] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center group"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5 text-brand-black" />
                      Creating Product...
                    </>
                  ) : (
                    <>
                      Publish to Storefront
                      <ArrowLeft className="w-4 h-4 ml-2 rotate-180 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </button>
              </div>

            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
