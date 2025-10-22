import { onMount, createSignal } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import { supabase } from '~/lib/supabaseClient';
import Loader from '~/components/Loader';

export default function SelectRole() {
    const navigate = useNavigate();
    const [authUser, setAuthUser] = createSignal<any>(null);
    const [alreadyRegistered, setAlreadyRegistered] = createSignal(false);
    const [loading, setLoading] = createSignal(true);

    const checkUser = async () => {
        try {
            const { data: authData, error: authError } = await supabase.auth.getUser();

            if (authError || !authData?.user) {
                navigate('/login');
                return;
            }

            const user = authData.user;
            setAuthUser(user);

            // Check if user already exists in your table
            const { data: existingUser } = await supabase
                .from('users')
                .select('*')
                .eq('id', user.id)
                .maybeSingle();

            if (existingUser) {
                setAlreadyRegistered(true);
                navigate(`/${existingUser.dynamic_key}/overview`);
                return;
            }

            setAlreadyRegistered(false);
        } catch (err) {
            console.error('Unexpected error:', err);
        } finally {
            setLoading(false);
        }
    };

    onMount(() => {
        checkUser();
    });

    const selectRole = async (role: 'student' | 'teacher' | 'admin') => {
        const user = authUser();
        if (!user || alreadyRegistered()) return;

        setLoading(true);
        const { data: upserted, error: upsertError } = await supabase
            .from('users')
            .upsert(
                {
                    id: user.id,
                    name: user.user_metadata?.full_name || user.email,
                    email: user.email,
                    role,
                    created_at: new Date().toISOString(),
                },
                { onConflict: 'id' }
            )
            .select('dynamicKey')
            .single();

        setLoading(false);

        if (upsertError) {
            console.error('Error saving role:', upsertError);
            return;
        }

        navigate(`/${upserted.dynamicKey}/overview`);
    };

    return (
        <main class='flex flex-col items-center justify-center h-screen gap-6 relative'>
            {loading() && <Loader />}


            {!loading() && !alreadyRegistered() && (
                <div class='flex flex-col gap-4 w-64'>
                    <button
                        class='bg-blue-600 text-white px-6 py-3 rounded shadow hover:bg-blue-700'
                        onClick={() => selectRole('student')}
                    >
                        Student
                    </button>
                    <button
                        class='bg-green-600 text-white px-6 py-3 rounded shadow hover:bg-green-700'
                        onClick={() => selectRole('teacher')}
                    >
                        Teacher
                    </button>
                    <button
                        class='bg-red-600 text-white px-6 py-3 rounded shadow hover:bg-red-700'
                        onClick={() => selectRole('admin')}
                    >
                        Admin
                    </button>
                </div>
            )}
        </main>
    );
}
