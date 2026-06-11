import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://zgdsqvfverqetzofmubb.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_TfR2W6ZbqqFhBEC6gdddYA_DIw2r3Ft'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
