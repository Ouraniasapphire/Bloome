import { supabase } from '~/lib/supabaseClient';

export default function Login() {
    const signInWithGoogle = async () => {
        const redirectTo = `${window.location.origin}/auth/select-role`;
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: { redirectTo },
        });

        if (error) console.error('Google login error:', error);
    };

    return (
        <div class='flex flex-col h-dvh w-dvw items-center justify-center space-y-8'>
            <h1 class=' text-6xl font-extrabold bg-clip-text '>Bloome</h1>

            <button id='loginButton' onClick={signInWithGoogle}>
                Sign In With Google
            </button>
        </div>
    );
}
