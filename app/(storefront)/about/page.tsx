import Image from 'next/image'
import { MapPin, Clock, Star, ArrowRight, Quote } from 'lucide-react'

export const metadata = {
  title: 'About Us | Takumi Halal Mart',
  description: 'Our journey from a motor company to Japan’s premier authentic Sri Lankan and Halal grocery destination.',
}

export default function AboutPage() {
  return (
    <div className="bg-[#0a0a0a] text-white min-h-screen overflow-x-hidden selection:bg-[#D4AF37] selection:text-black font-sans">
      
      {/* Hero Section */}
      <section className="relative h-[70vh] md:h-[85vh] w-full flex items-center justify-center overflow-hidden">
        <Image 
          src="/front_shot.png"
          alt="Takumi Halal Mart at night"
          fill
          className="object-cover opacity-30 transform hover:scale-105 transition-transform duration-[3000ms] ease-out"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/50 via-transparent to-[#0a0a0a]"></div>
        
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto mt-20">
          <span className="text-[#D4AF37] font-bold tracking-[0.3em] uppercase text-xs md:text-sm mb-6 block">Our Story</span>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tight mb-6 leading-[1.1]">
            More Than A Store.<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">A Cultural Bridge.</span>
          </h1>
          <p className="text-gray-400 text-lg md:text-xl font-light max-w-2xl mx-auto leading-relaxed">
            Providing authentic Halal products and Sri Lankan essentials to our community in Japan.
          </p>
        </div>
      </section>

      {/* The Journey (Premium alternating layout) */}
      <section className="py-24 md:py-32 px-4 max-w-7xl mx-auto">
        <div className="space-y-32">
          
          {/* 2016 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center group">
            <div className="order-2 md:order-1 relative h-[350px] md:h-[450px] rounded-[2rem] overflow-hidden bg-zinc-900 border border-white/5">
              <div className="absolute inset-0 flex items-center justify-center text-zinc-800 font-black text-[8rem] md:text-[12rem] opacity-30 group-hover:scale-110 group-hover:text-zinc-700 transition-all duration-1000 ease-out select-none">
                2016
              </div>
            </div>
            <div className="order-1 md:order-2">
              <span className="text-[#D4AF37] font-bold tracking-[0.2em] uppercase text-xs mb-4 block">The Foundation</span>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">Kabir Motors Co.</h2>
              <p className="text-gray-400 text-lg leading-relaxed mb-8 font-light">
                Our journey didn't start in retail. In April 2016, we launched Kabir Motors Company Limited, specializing in the successful global export of premium vehicles and spare parts. This foundation taught us the vital importance of logistics, uncompromising quality, and global trade.
              </p>
              <div className="h-px w-16 bg-gradient-to-r from-[#D4AF37] to-transparent"></div>
            </div>
          </div>

          {/* 2024 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center group">
            <div className="md:pr-12 text-left md:text-right">
              <span className="text-[#D4AF37] font-bold tracking-[0.2em] uppercase text-xs mb-4 block">The Seed</span>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">ZEE YASAI Imports</h2>
              <p className="text-gray-400 text-lg leading-relaxed mb-8 font-light">
                Recognizing the growing need for authentic ingredients in Japan, we pivoted our expertise. In 2024, ZEE YASAI was born. We began importing fresh, high-quality vegetables and fruits directly from Sri Lanka and India to supply local specialty grocery stores.
              </p>
              <div className="h-px w-16 bg-gradient-to-l from-[#D4AF37] to-transparent ml-0 md:ml-auto"></div>
            </div>
            <div className="relative h-[350px] md:h-[450px] rounded-[2rem] overflow-hidden bg-zinc-900 border border-white/5">
               <div className="absolute inset-0 flex items-center justify-center text-zinc-800 font-black text-[8rem] md:text-[12rem] opacity-30 group-hover:scale-110 group-hover:text-zinc-700 transition-all duration-1000 ease-out select-none">
                2024
              </div>
            </div>
          </div>

          {/* 2026 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center group">
             <div className="order-2 md:order-1 relative h-[450px] md:h-[550px] rounded-[2rem] overflow-hidden shadow-2xl border border-white/10">
              <Image 
                src="/takumi_drone_shot.png" 
                alt="Takumi Halal Mart Interior" 
                fill 
                className="object-cover transform group-hover:scale-110 transition-transform duration-1000 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
              <div className="absolute bottom-8 left-8 right-8">
                 <p className="text-white font-medium text-lg border-l-2 border-[#D4AF37] pl-4">A fully realized retail storefront designed for the community.</p>
              </div>
            </div>
            <div className="order-1 md:order-2">
              <span className="text-[#D4AF37] font-bold tracking-[0.2em] uppercase text-xs mb-4 block">The Vision Realized</span>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">Takumi Halal Mart</h2>
              <p className="text-gray-400 text-lg leading-relaxed mb-8 font-light">
                In March 2026, our vision expanded into a physical space. Takumi Halal Mart opened its doors in Chiba. We evolved into a comprehensive halal grocery store, initiating premium halal product imports from around the globe directly to our customers.
              </p>
              <ul className="space-y-4 text-gray-300 font-light mt-8">
                <li className="flex items-center gap-4">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] shadow-[0_0_10px_#D4AF37]"></div>
                  Fresh Authentic Sri Lankan Produce
                </li>
                <li className="flex items-center gap-4">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] shadow-[0_0_10px_#D4AF37]"></div>
                  100% Halal Meats & Global Spices
                </li>
                <li className="flex items-center gap-4">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] shadow-[0_0_10px_#D4AF37]"></div>
                  Ready-to-Eat Short Eats & Snacks
                </li>
              </ul>
            </div>
          </div>

        </div>
      </section>

      {/* Bento Grid: Mission & Vision */}
      <section className="py-24 bg-zinc-950/50 border-y border-white/5 px-4 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Mission Card */}
            <div className="md:col-span-2 bg-gradient-to-br from-zinc-900 to-black p-10 md:p-16 rounded-[2rem] border border-white/5 relative overflow-hidden group hover:border-white/10 transition-colors">
              <div className="absolute top-0 right-0 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-[#D4AF37]/10 transition-colors duration-700"></div>
              <h3 className="text-3xl font-bold mb-6 tracking-tight">Our Mission</h3>
              <p className="text-xl md:text-2xl text-gray-400 font-light leading-relaxed max-w-2xl">
                To bridge cultures through authentic food by providing the highest quality halal products, fresh produce, and Sri Lankan essentials at affordable prices to our community in Japan.
              </p>
            </div>

            {/* Vision Card */}
            <div className="bg-gradient-to-br from-zinc-900 to-black p-10 md:p-12 rounded-[2rem] border border-white/5 relative overflow-hidden group hover:border-white/10 transition-colors">
               <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 group-hover:bg-blue-500/10 transition-colors duration-700"></div>
               <h3 className="text-3xl font-bold mb-6 tracking-tight">Our Vision</h3>
               <p className="text-gray-400 font-light leading-relaxed text-lg">
                 To become Japan's most trusted one-stop halal marketplace, ensuring that expats and locals alike have reliable access to the diverse, authentic flavors of home.
               </p>
            </div>

          </div>
        </div>
      </section>

      {/* Testimonials - Sleek Masonry / Flex */}
      <section className="py-32 px-4 max-w-7xl mx-auto relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#D4AF37]/5 rounded-full blur-[120px] pointer-events-none"></div>
        
        <div className="text-center mb-20 relative z-10">
          <span className="text-[#D4AF37] font-bold tracking-[0.2em] uppercase text-xs mb-4 block">Community Trust</span>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">Voices of Takumi</h2>
          <div className="flex justify-center items-center gap-3">
             <div className="bg-zinc-900/80 px-5 py-2.5 rounded-full border border-white/10 flex items-center gap-3 backdrop-blur-md shadow-2xl">
               <span className="font-bold text-xl tracking-tight">4.6</span>
               <div className="flex gap-1">
                 {[...Array(5)].map((_, i) => <Star key={i} className={`w-4 h-4 ${i === 4 ? 'fill-[#D4AF37]/30 text-[#D4AF37]/30' : 'fill-[#D4AF37] text-[#D4AF37]'}`} />)}
               </div>
               <span className="text-sm text-gray-400 font-medium ml-1">Google Reviews</span>
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
          {[
            {
              name: "Riyas Fareed",
              text: "If you're in Japan and missing Sri Lankan food from back home, this is the perfect place. You can find almost all your Sri Lankan essentials here... all at really good prices."
            },
            {
              name: "Fadhiya Farook",
              text: "Quality Halal products for affordable price. Fresh vegetables and fruits available. Your trusted grocery store."
            },
            {
              name: "Shimi Motors LLC",
              text: "All halal food in one roof. Reasonable price."
            }
          ].map((review, i) => (
            <div key={i} className="bg-zinc-900/40 backdrop-blur-xl border border-white/5 p-10 rounded-[2rem] hover:bg-zinc-900/80 hover:border-white/10 transition-all duration-300 group">
              <Quote className="w-10 h-10 text-[#D4AF37]/20 mb-8 group-hover:text-[#D4AF37]/40 transition-colors" />
              <p className="text-gray-300 font-light text-lg mb-10 leading-relaxed min-h-[120px]">"{review.text}"</p>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center font-bold text-sm text-gray-400">
                  {review.name.charAt(0)}
                </div>
                <div>
                  <p className="font-bold tracking-wider uppercase text-xs text-white mb-1">{review.name}</p>
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, j) => <Star key={j} className="w-3 h-3 fill-[#D4AF37] text-[#D4AF37]" />)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Location Section */}
      <section className="py-32 px-4 max-w-7xl mx-auto border-t border-white/5 mt-10">
        <div className="text-center mb-16 relative z-10">
          <span className="text-[#D4AF37] font-bold tracking-[0.2em] uppercase text-xs mb-4 block">Visit Us</span>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">How To Find Us</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-zinc-900/40 p-6 md:p-8 rounded-[3rem] border border-white/5 relative z-10">
          {/* Info Side */}
          <div className="flex flex-col justify-between p-4 md:p-8">
            <div>
              <h3 className="text-3xl font-bold mb-10 text-white">Takumi Halal Mart</h3>
              <div className="space-y-8">
                <div className="flex items-start gap-6">
                  <div className="w-14 h-14 rounded-2xl bg-[#D4AF37]/10 flex items-center justify-center shrink-0 border border-[#D4AF37]/20">
                    <MapPin className="w-6 h-6 text-[#D4AF37]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-2 text-white">Address</h4>
                    <p className="text-gray-400 font-light leading-relaxed text-lg">
                      Crest Togane 102, 708-5 Kawaba<br/>
                      Togane shi, Chiba 283-0064<br/>Japan
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-6">
                  <div className="w-14 h-14 rounded-2xl bg-[#D4AF37]/10 flex items-center justify-center shrink-0 border border-[#D4AF37]/20">
                    <Clock className="w-6 h-6 text-[#D4AF37]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-2 text-white">Store Hours</h4>
                    <p className="text-gray-400 font-light text-lg">Open Daily • Closes at 10:00 PM</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-12">
              <a 
                href="https://maps.app.goo.gl/ztVhMrsoUKvKyJzW7" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-white text-black font-bold uppercase tracking-widest px-8 py-5 rounded-2xl hover:bg-[#D4AF37] transition-all duration-300 group shadow-lg"
              >
                Open in Google Maps
                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </a>
            </div>
          </div>

          {/* Map Side */}
          <div className="h-[400px] lg:h-auto min-h-[500px] rounded-[2rem] overflow-hidden relative shadow-2xl border border-white/10 group">
             {/* Map interactive overlay on hover */}
            <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500 pointer-events-none z-10"></div>
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3243.6826647226875!2d140.35489707647225!3d35.56157843382743!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6022e30018dc9039%3A0xe5493b8d60155aeb!2sTakumi%20halal%20mart!5e0!3m2!1sen!2sjp!4v1711200000000!5m2!1sen!2sjp" 
              width="100%" 
              height="100%" 
              style={{ border: 0, filter: 'contrast(1.1) saturation(1.1)' }} 
              allowFullScreen={true} 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 w-full h-full"
            ></iframe>
          </div>
        </div>
      </section>

    </div>
  )
}
