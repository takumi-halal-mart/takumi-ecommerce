import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Contact Us - Takumi Halal Mart',
  description: 'Get in touch with Takumi Halal Mart. View our contact details and business hours.',
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#F8F9FA] py-12 md:py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        
        {/* Header Section */}
        <div className="bg-brand-black px-8 py-12 md:px-16 md:py-20 text-center">
          <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight mb-6">
            Get in Touch
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
            We are here to help! If you have any questions about our products, wholesale sourcing, or shipping, please reach out to us directly using the details below.
          </p>
        </div>

        {/* Content Section */}
        <div className="p-8 md:p-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
            
            {/* Contact Details */}
            <div className="space-y-10">
              <div className="flex items-start">
                <div className="flex-shrink-0 bg-brand-gold/10 p-3 rounded-full">
                  <MapPin className="w-6 h-6 text-brand-gold" />
                </div>
                <div className="ml-5">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Our Store & Office</h3>
                  <p className="text-gray-600 leading-relaxed text-base">
                    <span className="font-medium text-gray-800">KABIR MOTORS COMPANY LIMITED</span><br />
                    (Branch: Takumi Halal Mart)<br />
                    〒289-1211<br />
                    Chiba-ken, Sammu-shi,<br />
                    Ogi 689-39-2, Japan
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 bg-brand-gold/10 p-3 rounded-full">
                  <Phone className="w-6 h-6 text-brand-gold" />
                </div>
                <div className="ml-5">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Phone</h3>
                  <p className="text-gray-600 text-base">
                    <a href="tel:+81433121629" className="hover:text-brand-gold transition-colors">
                      +81 43 312 1629
                    </a>
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 bg-brand-gold/10 p-3 rounded-full">
                  <Mail className="w-6 h-6 text-brand-gold" />
                </div>
                <div className="ml-5">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Email</h3>
                  <p className="text-gray-600 text-base">
                    <a href="mailto:takumihalalmart@gmail.com" className="hover:text-brand-gold transition-colors">
                      takumihalalmart@gmail.com
                    </a>
                  </p>
                </div>
              </div>
            </div>

            {/* Additional Info / Hours */}
            <div className="bg-gray-50 rounded-2xl p-8 md:p-10 border border-gray-200 flex flex-col justify-center">
              <div className="flex items-center mb-8">
                <div className="bg-white p-2 shadow-sm rounded-lg mr-4 border border-gray-100">
                  <Clock className="w-6 h-6 text-gray-900" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Business Hours</h3>
              </div>
              
              <ul className="space-y-5 text-gray-600 text-lg">
                <li className="flex justify-between items-center border-b border-gray-200 pb-3">
                  <span className="font-medium text-gray-900">Monday - Friday</span>
                  <span>10:00 AM - 6:00 PM</span>
                </li>
                <li className="flex justify-between items-center border-b border-gray-200 pb-3">
                  <span className="font-medium text-gray-900">Saturday</span>
                  <span>10:00 AM - 4:00 PM</span>
                </li>
                <li className="flex justify-between items-center">
                  <span className="font-medium text-gray-900">Sunday</span>
                  <span className="text-red-500 font-bold bg-red-50 px-3 py-1 rounded-md text-sm">Closed</span>
                </li>
              </ul>
              
              <div className="mt-10 pt-8 border-t border-gray-200">
                 <p className="text-sm text-gray-500 leading-relaxed">
                   For inquiries related to returns or our legal policies, please refer to our{' '}
                   <Link href="/tokushoho" className="text-gray-900 font-semibold hover:text-brand-gold transition-colors underline decoration-gray-300 underline-offset-4">
                     Specified Commercial Transactions Act
                   </Link> page.
                 </p>
              </div>
            </div>
            
          </div>
        </div>

      </div>
    </div>
  );
}
