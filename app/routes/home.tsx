// src/routes/home.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { auth, googleProvider } from '../clients/firebaseClient';
import { signInWithPopup, onAuthStateChanged } from 'firebase/auth';
import type { User } from 'firebase/auth';
import SignIn from '~/components/SignInButton/SignIn';

export default function Home() {
    const [user, setUser] = useState<User | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Listen for auth state changes
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                navigate('/redirect'); // redirect logged-in users to dashboard
            }
        });

        return () => unsubscribe();
    }, [navigate]);

    const signInWithGoogle = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const signedInUser = result.user;

            console.log('Signed-in user UID:', signedInUser.uid); // Debug
            console.log('Signed-in user email:', signedInUser.email); // Debug
        } catch (err) {
            console.error('Sign-in failed:', err);
        }
    };

    if (user) {
        return <div>Redirecting to dashboard...</div>; // optional loading state
    }

    return (
        <div className='h-dvh w-vw flex items-center justify-center bg-(--surface-0)'>
            <div className='text-center border-(--surface-100) border-2 p-4 rounded-4xl bg-(--surface-100) shadow'>
                <h1 className='mx-4 my-20 text-6xl font-bold'>Bloome</h1>
                <SignIn action={signInWithGoogle} />
            </div>
        </div>
    );
}
