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
        <main class='flex flex-col h-screen w-screen items-center justify-center space-y-8'>
            <h1 class='text-white text-6xl font-extrabold bg-clip-text '>Bloome</h1>

            <button
                onClick={signInWithGoogle}
                class='bg-white !text-black hover:!text-white hover:bg-gradient-to-b hover:from-[#2979FF] hover:to-[#8E24AA] transition duration-150'
            >
                Sign In With Google
            </button>
        </main>
    );
}
