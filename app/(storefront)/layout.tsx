import { MarketplaceNavbar } from '@/components/storefront/MarketplaceNavbar'
import { Footer } from '@/components/storefront/Footer'
import { CartProvider } from '@/components/providers/CartProvider'
import { getStoreSettings } from '@/app/actions/storefront'

export default async function StorefrontLayout({ children }: { children: React.ReactNode }) {
  const { data: settings } = await getStoreSettings()

  return (
    <CartProvider>
      <div className="flex flex-col min-h-screen bg-white font-sans text-brand-black">
        {settings && !settings.is_store_open && (
          <div className="bg-red-600 text-white text-center py-3 px-4 font-bold uppercase tracking-widest text-sm shadow-md z-50 relative">
            {settings.store_closed_message || 'WE ARE CURRENTLY RESTOCKING! STORE WILL REOPEN SHORTLY.'}
          </div>
        )}
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
