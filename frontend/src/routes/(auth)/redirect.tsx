import { onMount } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import { supabase } from '~/lib/supabaseClient';
import { getUserData } from '~/utils/getUserData';

export default function Redirect() {
    const navigate = useNavigate();

    onMount(async () => {
        // Wait for Supabase to finish processing OAuth redirect
        // Supabase will parse the hash and write to localStorage
        await new Promise((resolve) => setTimeout(resolve, 300));

        const {
            data: { session },
        } = await supabase.auth.getSession();

        const authUser = session?.user;

        if (!authUser) {
            console.warn('No user after OAuth redirect');
            navigate('/login');
            return;
        }

        const userData = await getUserData();
        const dynamicId = userData?.dynamic_key;

        if (!userData?.role) {
            navigate('/select-role');
        } else if (userData.initial_login) {
            navigate(`/${dynamicId}/setup`);
        } else {
            navigate(`/${dynamicId}/dashboard`);
        }
    });

    return <p>Redirecting…</p>;
}
