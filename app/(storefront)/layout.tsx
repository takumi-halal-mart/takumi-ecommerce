import { MarketplaceNavbar } from '@/components/storefront/MarketplaceNavbar'
import { Footer } from '@/components/storefront/Footer'
import { CartProvider } from '@/components/providers/CartProvider'
import { getStoreSettings } from '@/app/actions/storefront'
import { JsonLd } from '@/components/storefront/JsonLd'

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": ["GroceryStore", "FoodEstablishment"],
  name: "Takumi Halal Mart",
  alternateName: "タクミ ハラール マート",
  url: "https://www.takumihalalmart.store",
  logo: "https://www.takumihalalmart.store/takumi2.png",
  image: "https://www.takumihalalmart.store/front_shot.png",
  description:
    "Japan's premier halal grocery store offering 100% halal certified meat, fresh Sri Lankan produce, authentic spices, and daily essentials. Retail and wholesale available.",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Crest Togane 102, 708-5 Kawaba",
    addressLocality: "Togane-shi",
    addressRegion: "Chiba",
    postalCode: "283-0064",
    addressCountry: "JP",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 35.56157843382743,
    longitude: 140.35489707647225,
  },
  telephone: "", // Add phone number when available
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: [
      "Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday",
    ],
    closes: "22:00",
  },
  priceRange: "¥",
  currenciesAccepted: "JPY",
  paymentAccepted: "Cash, Credit Card",
  servesCuisine: ["Halal", "Sri Lankan", "South Asian", "Middle Eastern"],
  hasMap: "https://maps.app.goo.gl/ztVhMrsoUKvKyJzW7",
  sameAs: [
    "https://www.instagram.com/takumihalalmart",
    "https://www.tiktok.com/@takumi.halal.mart",
    "https://www.facebook.com/share/196e9xqSzr/",
  ],
};

export default async function StorefrontLayout({ children }: { children: React.ReactNode }) {
  const { data: settings } = await getStoreSettings()

  return (
    <CartProvider>
      <div className="flex flex-col min-h-screen bg-white font-sans text-brand-black">
        <JsonLd data={localBusinessSchema} />
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
