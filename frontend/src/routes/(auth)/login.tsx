// context/AuthContext.tsx (or wherever your context is)
import { createContext, useContext } from 'solid-js';
import { supabase } from '~/lib/supabaseClient';

type AuthContextType = {
    loginWithGoogle: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>();

export const AuthProvider = (props: any) => {
    const loginWithGoogle = async () => {
        try {
            await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: import.meta.env.VITE_SUPABASE_REDIRECT_URL, // e.g., https://www.greathall.net/redirect
                },
            });
        } catch (error) {
            console.error('Error logging in with Google:', error);
        }
    };

    return (
        <AuthContext.Provider value={{ loginWithGoogle }}>{props.children}</AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext)!;
