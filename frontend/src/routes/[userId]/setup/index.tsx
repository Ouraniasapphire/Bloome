import { createSignal } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import { supabase } from '~/lib/supabaseClient';
import ThemeToggle from '~/components/ThemeToggle/ThemeToggle';
import getAuthUser from '~/utils/getAuthUser';

export default function SetupPage() {
    const navigate = useNavigate();
    const [preferredName, setPreferredName] = createSignal('');
    const [loading, setLoading] = createSignal(false);
    const [error, setError] = createSignal('');

    const handleSubmit = async (e: SubmitEvent) => {
        e.preventDefault();

        const authUser = await getAuthUser();
        if (!authUser) {
            navigate('/');
        }

        const { data, error } = await supabase.from('user_settings').upsert({
            id: authUser?.id,
            preferred_name: preferredName(),
            updated_at: new Date(),
        });

        if (error) {
            console.error('Failed to update user settings:', error);
            return;
        }

        navigate('/redirect');
    };

    return (
        <div class='flex flex-col items-center justify-center min-h-screen px-6 bg-white dark:bg-gray-800'>
            <div class='max-w-md w-full rounded-lg p-8 shadow-xl border-2 text-gray-800 border-gray-200 bg-white dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100'>
                <h1 class='text-2xl font-semibold text-center mb-6'>Welcome!</h1>
                <p class='text-center text-gray-600 mb-4 dark:text-gray-100'>
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
                    <p class='text-center text-gray-600 mb-4 dark:text-gray-100'>
                        Please select a theme.
                    </p>
                    <span class='flex w-full justify-center'>
                        <ThemeToggle />
                    </span>
                    <hr class='border-gray-300 w-full' />
                    <button
                        type='submit'
                        disabled={loading()}
                        class='w-full bg-blue-600 text-gray-100 py-2 rounded-xl text-center'
                    >
                        {loading() ? 'Saving...' : 'Continue'}
                    </button>
                </form>
            </div>
        </div>
    );
}
