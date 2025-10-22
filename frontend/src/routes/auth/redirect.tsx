import { onMount } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import { supabase } from '~/lib/supabaseClient';

export default function RedirectPage() {
    const navigate = useNavigate();

    onMount(async () => {
        const { data, error } = await supabase.auth.getUser();

        if (error || !data?.user) {
            console.error('Error fetching user:', error);
            navigate('/signup');
            return;
        }

        const user = data.user;

        // Get role from localStorage, default to student
        const selectedRole = localStorage.getItem('selectedRole') || 'student';

        // Upsert user into your users table
        const { error: insertError } = await supabase.from('users').upsert({
            id: user.id,
            name: user.user_metadata?.full_name || user.email,
            email: user.email,
            role: selectedRole,
            created_at: new Date().toISOString(),
        });

        if (insertError) console.error('Error inserting user:', insertError);

        // Clear localStorage
        localStorage.removeItem('selectedRole');

        // Redirect to overview
        navigate(`/${user.user_metadata.dynamic_key}/overview`);
    });

    return <p class='text-center mt-10'>Signing you in...</p>;
}
