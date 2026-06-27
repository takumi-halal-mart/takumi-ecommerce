'use client'

import React, { useState } from 'react'
import Image from 'next/image'

interface ProductGalleryProps {
  images: string[]
  productName: string
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [activeImage, setActiveImage] = useState(images[0] || null)

  if (!images || images.length === 0 || !images[0]) {
    return (
      <div className="relative aspect-square bg-gray-50 rounded-3xl overflow-hidden border border-gray-100 shadow-sm flex items-center justify-center">
        <span className="text-gray-400 font-medium">No Image Available</span>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Main Large Image */}
      <div className="relative aspect-square bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm group">
        <Image 
          src={activeImage || images[0]} 
          alt={productName} 
          fill 
          className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out" 
          priority
          unoptimized 
        />
      </div>

      {/* Thumbnails (Only show if we have "multiple") */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-3 sm:gap-4">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveImage(img)}
              className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                activeImage === img ? 'border-[#D4AF37] opacity-100 scale-95' : 'border-transparent opacity-60 hover:opacity-100 hover:scale-95'
              }`}
            >
              <Image 
                src={img} 
                alt={`${productName} thumbnail ${idx + 1}`} 
                fill 
                className="object-cover"
                unoptimized
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
