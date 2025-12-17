// src/routes/home.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { auth } from '../clients/firebaseClient';
import { onAuthStateChanged } from 'firebase/auth';
import type { User } from 'firebase/auth';
import SignIn from '~/components/SignInButton/SignIn';
import { signInWithGoogle } from '~/routes/bloome/auth/SignInWithGoogle';

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

    if (user) {
        return <div>Redirecting to dashboard...</div>; // optional loading state
    }

    return (
        <div className='h-dvh w-vw flex items-center justify-center bg-linear-to-t from-purple-700 to-indigo-600'>
            <div className='text-center border-(--surface-100) border-2 p-4 rounded-4xl bg-(--surface-0)'>
                <h1 className='mx-4 my-20 text-6xl font-bold bg-linear-to-t from-purple-700 to-indigo-600 bg-clip-text text-transparent'>
                    Bloome
                </h1>
                <SignIn action={signInWithGoogle} />
            </div>
        </div>
    );
}
