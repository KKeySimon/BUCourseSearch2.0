import { createClient } from '@supabase/supabase-js'

// I can't get .env to work on this garbage. Someone please help >:O
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL
const supabaseKey = process.env.REACT_APP_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase