import { useAuth } from '~/context/AuthContext';

export default function Login() {
    const { loginWithGoogle } = useAuth();

    return (
        <div class='flex flex-col items-center justify-center h-screen gap-8'>
            <h1 class='text-6xl font-bold text-gray-800 dark:text-white'>Bloome</h1>
            <button onClick={loginWithGoogle} class='py-4 px-8 bg-blue-600 text-white rounded'>
                Sign In With Google
            </button>
        </div>
    );
}
