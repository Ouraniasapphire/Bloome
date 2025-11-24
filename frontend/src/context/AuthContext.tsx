import { createContext, useContext, createSignal, onMount, JSX } from 'solid-js';
import type { User } from '@supabase/supabase-js';
import { supabase } from '~/lib/supabaseClient';

interface AuthContextType {
    user: () => User | null;
    role: () => string | null;
    loading: () => boolean;
    loginWithGoogle: () => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>();

export function AuthProvider(props: { children: JSX.Element }) {
    const [user, setUser] = createSignal<User | null>(null);
    const [role, setRole] = createSignal<string | null>(null);
    const [loading, setLoading] = createSignal(true);

    const persistUser = (u: User | null, r?: string | null) => {
        setUser(u);
        setRole(r ?? u?.user_metadata?.role ?? null);
        if (u) {
            localStorage.setItem('user', JSON.stringify(u));
            if (r) localStorage.setItem('role', r);
        } else {
            localStorage.removeItem('user');
            localStorage.removeItem('role');
        }
    };

    const fetchUserFromDB = async (u: User) => {
        const { data: existingUser, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', u.id)
            .maybeSingle();

        if (error) throw error;
        return existingUser ?? null;
    };

    onMount(async () => {
        const storedUser = localStorage.getItem('user');
        const storedRole = localStorage.getItem('role');

        if (storedUser) setUser(JSON.parse(storedUser));
        if (storedRole) setRole(storedRole);

        try {
            const {
                data: { session },
            } = await supabase.auth.getSession();

            if (session?.user) {
                const dbUser = await fetchUserFromDB(session.user);
                persistUser(session.user, dbUser?.role ?? null);
            }
        } catch (err) {
            console.error(err);
            persistUser(null);
        } finally {
            setLoading(false);
        }

        supabase.auth.onAuthStateChange(async (_event, session) => {
            if (session?.user) {
                const dbUser = await fetchUserFromDB(session.user);
                persistUser(session.user, dbUser?.role ?? null);
            } else {
                persistUser(null);
            }
        });
    });

    const loginWithGoogle = async () => {
        const redirectTo = `${window.location.origin}/redirect`;
        await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: { redirectTo },
        });
    };

    const logout = async () => {
        await supabase.auth.signOut();
        persistUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, role, loading, loginWithGoogle, logout }}>
            {props.children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext)!;
}
