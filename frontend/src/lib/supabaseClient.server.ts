// src/lib/supabaseClient.server.ts
import { createClient } from '@supabase/supabase-js';
import type { SupabaseClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL!;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY!;

export function createSupabaseServerClient(access_token?: string): SupabaseClient {
    return createClient(SUPABASE_URL, SUPABASE_KEY, {
        auth: {
            persistSession: false, // server doesn’t use localStorage
            detectSessionInUrl: false,
            autoRefreshToken: true,
            storage: {
                getItem: async () => access_token || null,
                setItem: async () => {},
                removeItem: async () => {},
            },
        },
    });
}
