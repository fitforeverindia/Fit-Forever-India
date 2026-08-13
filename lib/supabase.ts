import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ezudcnndhboepasvlvas.supabase.co';
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV6dWRjbm5kaGJvZXBhc3ZsdmFzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU5MTg0NTYsImV4cCI6MjEwMTQ5NDQ1Nn0.dHPlpPxiyBosLJbP6A0iuJZSQJUcudLWi_AqYg4kryg';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
