import { onMount } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import { supabase } from '~/lib/supabaseClient';
import { getUserData } from '~/utils/getUserData';

export default function Redirect() {
    const navigate = useNavigate();

    onMount(async () => {
        // Get session from storage (Supabase already parsed it from the URL hash)
        const { data: sessionData, error } = await supabase.auth.getSession();

        if (error) {
            console.error('Error getting session:', error);
            navigate('/login');
            return;
        }

        const authUser = sessionData?.session?.user;

        if (!authUser) {
            navigate('/login');
            return;
        }

        // Fetch your user data
        const userData = await getUserData();
        const dynamicId = userData?.dynamic_key;

        // Navigate based on role & initial login
        if (!userData?.role) {
            navigate('/select-role');
        } else if (userData?.role && userData?.initial_login) {
            navigate(`/${dynamicId}/setup`);
        } else {
            navigate(`/${dynamicId}/dashboard`);
        }
    });

    return null;
}
