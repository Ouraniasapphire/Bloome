import { supabase } from '~/lib/supabaseClient';
import type { User } from '@supabase/supabase-js';

export default async function getAuthUser(): Promise<User | null> {
    try {
        // Get the current session first
        const {
            data: { session },
            error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError || !session) {
            console.warn('No authenticated session:', sessionError);
            return null;
        }

        // Session exists, safe to get user
        const { data: userData, error: userError } = await supabase.auth.getUser();

        if (userError || !userData?.user) {
            console.error('Failed to get user:', userError);
            return null;
        }

        return userData.user;
    } catch (err) {
        console.error('Unexpected error fetching auth user:', err);
        return null;
    }
}
