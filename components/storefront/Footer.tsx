import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
)

const FacebookIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
)

const TikTokIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width="24"
    height="24"
    fill="currentColor"
    className={className}
  >
    <path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-5.201 1.743l-.002-.001.002.001a2.895 2.895 0 0 1 3.183-4.51v-3.5a6.329 6.329 0 0 0-5.394 10.692 6.33 6.33 0 0 0 10.857-4.4V8.687a8.182 8.182 0 0 0 4.773 1.526V6.79a4.831 4.831 0 0 1-1.003-.104z" />
  </svg>
)

export function Footer() {
  return (
    <footer className="bg-brand-black text-white pt-24 pb-10 border-t-4 border-brand-gold">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">

          {/* Column 1: Brand Info */}
          <div className="flex flex-col items-start -mt-8">
            <Link href="/" className="inline-block">
              <Image
                src="/takumifooter.png"
                alt="Takumi Logo"
                width={300}
                height={90}
                className="w-36 lg:w-44 h-auto object-contain object-left"
              />
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs -mt-2">
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
                <Link href="/faq" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">FAQ</Link>
              </li>
              <li>
                <Link href="/tokushoho" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">Legal (Tokushoho)</Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Social Media */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-brand-gold mb-6">Connect</h4>
            <div className="flex space-x-6">
              <Link
                href="https://www.instagram.com/takumihalalmart?igsh=aTM3emh6OTF1OGdr"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-[#E1306C] transition-colors duration-300"
                aria-label="Instagram"
              >
                <InstagramIcon className="w-6 h-6" />
              </Link>
              <Link
                href="https://www.tiktok.com/@takumi.halal.mart?_r=1&_t=ZS-97pFPv1TL88"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors duration-300"
                aria-label="TikTok"
              >
                <TikTokIcon className="w-6 h-6" />
              </Link>
              <Link
                href="https://www.facebook.com/share/196e9xqSzr/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-[#1877F2] transition-colors duration-300"
                aria-label="Facebook"
              >
                <FacebookIcon className="w-6 h-6" />
              </Link>
            </div>
          </div>

        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 border-t border-brand-border flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-xs text-gray-500 font-medium tracking-wider uppercase">
            © 2026 Takumi Halal Mart.
          </p>
          <p className="text-xs text-gray-600 font-medium tracking-wider uppercase">
            Engineered by <Link href="https://www.tiktok.com/@_knight_graphics_?_r=1&_t=ZS-97xkHAIVms5" target="_blank" rel="noopener noreferrer" className="text-brand-gold hover:text-white transition-colors duration-300">Knight Graphics</Link>
          </p>
        </div>
      </div>
    </footer>
  )
}
