import { createClient } from '@supabase/supabase-js'

/**
 * Creates a Supabase client with the Service Role Key.
 * 
 * WARNING: This client bypasses Row Level Security (RLS).
 * NEVER expose this key to the client-side (browser).
 * ONLY use this inside Server Actions, Route Handlers, or Cron Jobs
 * when you need to perform administrative tasks (e.g., verifying user roles, 
 * updating other users' profiles, or forcefully deleting records).
 */
export function createAdminClient() {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is missing from environment variables.')
  }

  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )
}
