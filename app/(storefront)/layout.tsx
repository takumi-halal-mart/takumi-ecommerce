import { MarketplaceNavbar } from '@/components/storefront/MarketplaceNavbar'
import { Footer } from '@/components/storefront/Footer'
import { CartProvider } from '@/components/providers/CartProvider'

export default function StorefrontLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <div className="flex flex-col min-h-screen bg-white font-sans text-brand-black">
        {/* High-density Marketplace Navigation */}
        <MarketplaceNavbar />
        
        {/* 
          Main content area flex-grows to push the footer to the bottom.
        */}
        <main className="flex-1">
          {children}
        </main>
        
        {/* Dark premium footer */}
        <Footer />
      </div>
    </CartProvider>
  )
}
