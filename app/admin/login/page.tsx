'use client'

import { useActionState } from 'react'
import Image from 'next/image'
import { login } from './actions'

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(login, { error: '' })

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-black p-4 relative overflow-hidden">
      {/* Premium Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-brand-gold/5 blur-[120px]" />
        <div className="absolute top-[80%] -right-[10%] w-[40%] h-[40%] rounded-full bg-brand-gold/5 blur-[100px]" />
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="bg-brand-dark rounded-2xl shadow-2xl p-8 sm:p-10 border border-brand-border backdrop-blur-sm">
          
          <div className="flex flex-col items-center text-center mb-8">
            <div className="relative w-24 h-24 mb-6">
              {/* Glow behind image */}
              <div className="absolute inset-0 bg-brand-gold/20 rounded-full blur-xl animate-pulse"></div>
              <Image 
                src="/takumi.webp" 
                alt="Takumi Logo" 
                fill
                className="object-contain relative z-10 drop-shadow-2xl"
                priority
              />
            </div>
            <h1 className="text-3xl font-semibold tracking-tight text-white mb-2">
              Takumi <span className="text-brand-gold italic font-serif">Admin</span>
            </h1>
            <p className="text-sm text-gray-400">
              Sign in to manage the premium storefront.
            </p>
          </div>

          <form action={formAction} className="space-y-6">
            <div>
              <label className="block text-xs uppercase tracking-widest font-semibold text-brand-gold mb-2" htmlFor="email">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full px-4 py-3 rounded-lg border border-brand-border bg-brand-gray text-white focus:ring-1 focus:ring-brand-gold focus:border-brand-gold outline-none transition-all placeholder-gray-600"
                placeholder="admin@takumi.com"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-widest font-semibold text-brand-gold mb-2" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="w-full px-4 py-3 rounded-lg border border-brand-border bg-brand-gray text-white focus:ring-1 focus:ring-brand-gold focus:border-brand-gold outline-none transition-all placeholder-gray-600"
                placeholder="••••••••"
              />
            </div>

            {state?.error && (
              <div className="p-3 rounded-lg bg-red-950/40 text-red-400 text-sm border border-red-900/50 flex items-start">
                <svg className="w-5 h-5 mr-2 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span>{state.error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="w-full py-3.5 px-4 bg-brand-gold hover:bg-brand-gold-hover text-brand-black font-bold uppercase tracking-wider text-sm rounded-lg transition-all shadow-[0_0_20px_rgba(212,175,55,0.15)] hover:shadow-[0_0_25px_rgba(212,175,55,0.3)] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center mt-4"
            >
              {isPending ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-brand-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Authenticating...
                </>
              ) : (
                'Enter Dashboard'
              )}
            </button>
          </form>
        </div>
        
        {/* Footer Text */}
        <p className="text-center text-xs text-gray-500 mt-8 tracking-wide">
          &copy; {new Date().getFullYear()} Takumi. All rights reserved.
        </p>
      </div>
    </div>
  )
}
