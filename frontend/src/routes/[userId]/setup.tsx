import { createSignal } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import { supabase } from '~/lib/supabaseClient';
import ThemeToggle from '~/components/ThemeToggle';

export default function SetupPage() {
    const navigate = useNavigate();
    const [preferredName, setPreferredName] = createSignal('');
    const [loading, setLoading] = createSignal(false);
    const [error, setError] = createSignal('');

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await supabase.auth.getUser();
            if (response.error || !response.data?.user) throw new Error('User not found');
            const user = response.data.user;

            // Upsert user_settings safely
            const { error: settingsError } = await supabase.from('user_settings').upsert({
                id: user.id,
                preferred_name: preferredName(),
                updated_at: new Date(),
            });
            if (settingsError) throw settingsError;

            // Update users.initial_login
            const { error: userUpdateError } = await supabase
                .from('users')
                .update({ initial_login: false })
                .eq('id', user.id);
            if (userUpdateError) throw userUpdateError;

            // Update Auth metadata
            const { error: authUpdateError } = await supabase.auth.updateUser({
                data: { initial_login: false },
            });
            if (authUpdateError) throw authUpdateError;

            const { data: existingUser } = await supabase
                .from('users')
                .select('*')
                .eq('id', user.id)
                .maybeSingle();

            // Navigate
            const dynamicKey = existingUser.dynamic_key;
            if (!dynamicKey) throw new Error('Missing dynamic_key');
            navigate(`/${dynamicKey}/overview`);
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div class='flex flex-col items-center justify-center min-h-screen px-6 bg-white dark:bg-gray-800'>
            <div class='max-w-md w-full rounded-lg p-8 shadow-md border-2 text-black border-gray-200 bg-white dark:bg-gray-900 dark:border-gray-700 dark:text-white'>
                <h1 class='text-2xl font-semibold text-center mb-6'>Welcome!</h1>
                <p class='text-center text-gray-600 mb-4 dark:text-white'>
                    Set your preferred display name before continuing.
                </p>
                <form onSubmit={handleSubmit} class='space-y-4'>
                    <input
                        type='text'
                        placeholder='Preferred first name'
                        value={preferredName()}
                        onInput={(e) => setPreferredName(e.currentTarget.value)}
                        class='w-full border rounded-xl px-4 py-2'
                        required
                    />

                    <hr class='border-gray-300 w-full' />
                    <p class='text-center text-gray-600 mb-4 dark:text-white'>
                        Please select a theme.
                    </p>
                    <span class='flex w-full justify-center'>
                        <ThemeToggle />
                    </span>
                    <hr class='border-gray-300 w-full' />
                    <button
                        type='submit'
                        disabled={loading()}
                        class='w-full bg-blue-600 text-white py-2 rounded-xl text-center'
                    >
                        {loading() ? 'Saving...' : 'Continue'}
                    </button>
                </form>
            </div>
        </div>
    );
}
