import { useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '~/clients/supabaseClient';

export default function useSession(): [Session | null, (session: Session | null) => void] {
    const [session, setSession] = useState<Session | null>(null);

    useEffect(() => {
        // Get initial session
        supabase.auth.getSession().then(({ data }) => {
            setSession(data.session);
        });

        // Subscribe to auth changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        return () => subscription.unsubscribe();
    }, []);

    return [session, setSession];
}
