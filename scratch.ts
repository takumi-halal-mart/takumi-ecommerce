import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://bbashlasnlphhsciulbs.supabase.co'
const supabaseKey = 'sb_publishable_FC0EQpWfU3ibt3mvXkRuIA_yjRtDSaj'

const supabase = createClient(supabaseUrl, supabaseKey)

async function run() {
  const { data, error } = await supabase.from('promotional_banners').select('*').eq('is_active', true)
  console.log('data:', data)
  console.log('error:', error)
  console.log('error details:', JSON.stringify(error, null, 2))
}
run()
