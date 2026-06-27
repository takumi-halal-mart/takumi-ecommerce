'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { StorefrontBanner } from '@/app/actions/storefront'

interface HeroCarouselProps {
  banners: StorefrontBanner[]
}

export function HeroCarousel({ banners }: HeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  // Auto-scroll logic
  useEffect(() => {
    if (banners.length <= 1) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length)
    }, 5000) // Change banner every 5 seconds

    return () => clearInterval(interval)
  }, [banners.length])

  // Fallback if absolutely no banners are present
  if (!banners || banners.length === 0) {
    return (
      <section className="min-h-[85vh] relative flex items-center justify-center">
        <Image
          src="/default-hero.webp"
          alt="Hero Background"
          fill
          priority
          unoptimized
          className="object-cover absolute"
        />
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto flex flex-col items-center">
          <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-6">
            Premium Halal Groceries, Delivered.
          </h1>
          <p className="text-lg md:text-xl text-gray-200 mb-10 font-light">
            Experience Japan's finest selection of fresh meat, authentic spices, and daily essentials.
          </p>
          <Link
            href="/shop"
            className="bg-[#D4AF37] text-black font-bold px-8 py-4 rounded-full hover:bg-white transition-colors flex items-center gap-2"
          >
            Shop Now
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    )
  }

  return (
    <section className="min-h-[85vh] relative flex items-center justify-center overflow-hidden">
      {banners.map((banner, index) => {
        const isActive = index === currentIndex
        const heroImage = banner.image_url || '/default-hero.webp'
        const heroHeading = banner.heading || 'Premium Halal Groceries, Delivered.'
        const heroSubtext = banner.subtext || "Experience Japan's finest selection of fresh meat, authentic spices, and daily essentials."
        const heroLink = banner.redirect_url || '/shop'

        return (
          <div 
            key={banner.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${isActive ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
          >
            <Image
              src={heroImage}
              alt="Hero Background"
              fill
              priority={isActive}
              unoptimized
              className="object-cover absolute"
            />
            <div className="absolute inset-0 bg-black/60"></div>
            
            <div className="relative z-10 text-center px-4 max-w-4xl mx-auto flex flex-col items-center justify-center h-full pt-10">
              <h1 className={`text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-6 transition-all duration-1000 delay-100 ${isActive ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                {heroHeading}
              </h1>
              <p className={`text-lg md:text-xl text-gray-200 mb-10 font-light transition-all duration-1000 delay-300 ${isActive ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                {heroSubtext}
              </p>
              <Link
                href={heroLink}
                className={`bg-[#D4AF37] text-black font-bold px-8 py-4 rounded-full hover:bg-white transition-colors flex items-center gap-2 transition-all duration-1000 delay-500 ${isActive ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
              >
                Shop Now
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        )
      })}
      
      {/* Carousel Indicators */}
      {banners.length > 1 && (
        <div className="absolute bottom-20 md:bottom-24 left-1/2 -translate-x-1/2 z-20 flex space-x-3 pb-4">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex ? 'bg-[#D4AF37] w-8' : 'bg-white/50 hover:bg-white'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  )
}
