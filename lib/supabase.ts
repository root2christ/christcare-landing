import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://oklgzhkkqbziwoyhypom.supabase.co';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9rbGd6aGtrcWJ6aXdveWh5cG9tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg3OTc2OTEsImV4cCI6MjA4NDM3MzY5MX0.rTCBqVNIjdkaWcMcOGBkgQyQlDop4B3lz4kqyGSGb1c';

/** 일반 anon 클라이언트 (RLS 적용됨) */
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
