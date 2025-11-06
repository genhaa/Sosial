// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js'

// Baca 'kunci rahasia' dari file .env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Bikin 'jembatan' (client) pake kunci tadi
export const supabase = createClient(supabaseUrl, supabaseKey)

// --- UDAH, SAMPE SINI AJA, JANGAN ADA APA-APA LAGI DI BAWAH ---