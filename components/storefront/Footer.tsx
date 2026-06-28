import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-brand-black text-white pt-24 pb-10 border-t-4 border-brand-gold">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
          
          {/* Column 1: Brand Info */}
          <div className="space-y-6">
            <span className="text-2xl font-black tracking-[0.25em] text-white uppercase">
              Takumi
            </span>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              Japan's premier halal grocery delivery. Curating the finest authentic ingredients directly to your kitchen.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-brand-gold mb-6">Quick Links</h4>
            <ul className="space-y-4">
              <li>
                <Link href="/shop" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">Shop All</Link>
              </li>
              <li>
                <Link href="/categories" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">Categories</Link>
              </li>
              <li>
                <Link href="/wholesale" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">Wholesale Portal</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Customer Service */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-brand-gold mb-6">Customer Service</h4>
            <ul className="space-y-4">
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">Contact Us</Link>
              </li>
              <li>
                <Link href="/shipping" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">Shipping Policy</Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">FAQ</Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-brand-gold mb-6">Join the List</h4>
            <p className="text-gray-400 text-sm mb-4">
              Subscribe for exclusive access to VIP discounts and new arrivals.
            </p>
            <form className="relative flex items-center group">
              <input 
                type="email" 
                placeholder="Enter your email address" 
                required
                className="w-full bg-brand-gray/30 border border-brand-border text-white px-4 py-3 text-sm rounded-lg focus:outline-none focus:border-brand-gold transition-colors placeholder-gray-600"
              />
              <button 
                type="submit"
                className="absolute right-2 p-2 text-brand-gold hover:text-black hover:bg-brand-gold rounded-md transition-all"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>

        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 border-t border-brand-border flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-xs text-gray-500 font-medium tracking-wider uppercase">
            © 2026 Takumi Halal Mart.
          </p>
          <p className="text-xs text-gray-600 font-medium tracking-wider uppercase">
            Engineered by <span className="text-brand-gold">Knight Graphics</span>
          </p>
        </div>
      </div>
    </footer>
  )
}
