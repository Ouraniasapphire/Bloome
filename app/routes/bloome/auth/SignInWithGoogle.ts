import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, googleProvider } from '~/clients/firebaseClient';
import { signInWithPopup } from 'firebase/auth';

function generateDynamicKey() {
    return Math.random().toString(36).substring(2, 16);
}

function getInitials(fullName: string) {
    if (!fullName) return '';

    const parts = fullName.trim().split(' ');
    const first = parts[0]?.[0] ?? '';
    const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
    return (first + last).toUpperCase();
}

export async function signInWithGoogle() {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;

        if (!user?.uid || !user.email) return;

        // Ensure the `users` document exists
        const usersRef = doc(db, 'users', user.uid);
        const usersSnap = await getDoc(usersRef);
        if (!usersSnap.exists()) {
            await setDoc(usersRef, {
                createdAt: new Date(),
                email: user.email,
                role: 'student',
                initialLogin: true,
            });
        }

        // Ensure the `user_settings` document exists
        const settingsRef = doc(db, 'user_settings', user.uid);
        const settingsSnap = await getDoc(settingsRef);
        if (!settingsSnap.exists()) {
            await setDoc(settingsRef, {
                createdAt: new Date(),
                preferred_name: user.displayName || '',
                initials: getInitials(user.displayName || ''), // ✅ splice name for initials
                profile_color: '0',
                dynamicKey: generateDynamicKey(),
                updatedAt: new Date(),
            });
        }

        console.log('User signed in and both documents ensured');

        // Redirect to root
        window.location.href = '/';
    } catch (err) {
        console.error('Sign-in failed', err);
    }
}
