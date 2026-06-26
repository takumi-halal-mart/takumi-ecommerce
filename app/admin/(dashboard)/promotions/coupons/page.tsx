import { getCoupons } from './actions'
import { CouponManager } from './CouponManager'
import { Tag } from 'lucide-react'

export const metadata = {
  title: 'Coupon Management | Takumi Admin',
}

export default async function CouponsPage() {
  // Fetch all coupons on the server before sending HTML to the client
  const { data: coupons, error } = await getCoupons()

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-white flex items-center">
            <Tag className="mr-3 text-brand-gold h-8 w-8" /> 
            Promotional Engine
          </h1>
          <p className="text-sm text-gray-400 mt-2 max-w-2xl leading-relaxed">
            Generate and monitor discount codes. Control wholesale and retail promotional logistics instantly.
          </p>
        </div>
      </div>

      {error ? (
        <div className="p-4 rounded-xl bg-red-950/40 text-red-400 border border-red-900/50">
          <p>{error}</p>
        </div>
      ) : (
        <CouponManager initialCoupons={coupons || []} />
      )}
      
    </div>
  )
}
