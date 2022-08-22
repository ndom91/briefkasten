import { createClient } from '@supabase/supabase-js'

if (
  !process.env.SUPABASE_URL ||
  !process.env.SUPABASE_KEY ||
  !process.env.SUPABASE_BUCKET_ID
) {
  console.log(
    'SUPABASE_KEY, SUPABASE_URL or SUPABASE_BUCKET_ID missing - will not upload screenshots.'
  )
}

export const supabaseClient = () => {
  if (
    process.env.SUPABASE_URL &&
    process.env.SUPABASE_KEY &&
    process.env.SUPABASE_BUCKET_ID
  ) {
    return createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY)
  }
}
