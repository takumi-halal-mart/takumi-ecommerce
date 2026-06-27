import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()
  const { data, error } = await supabase.from('coupons').select('code, expiration_date')
  return NextResponse.json({ data, error })
}
