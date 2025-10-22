import { onMount, createSignal, Show } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import { supabase } from '~/lib/supabaseClient';
import StudentOverview from '~/components/views/student-overview';
import TeacherOverview from '~/components/views/teacher-overview';
import AdminOverview from '~/components/views/admin-overview';
import Loader from '~/components/Loader';

export default function OverviewPage() {
    const [role, setRole] = createSignal<string | null>(null);
    const [loading, setLoading] = createSignal(true);
    const navigate = useNavigate();

    onMount(async () => {
        try {
            const { data: authData, error: authError } = await supabase.auth.getUser();

            if (authError || !authData?.user) {
                console.warn('No authenticated user, redirecting to login.');
                setLoading(false);
                setTimeout(() => navigate('/'), 0);
                return;
            }

            const userId = authData.user.id;
            const { data: userRecord, error: userError } = await supabase
                .from('users')
                .select('role')
                .eq('id', userId)
                .maybeSingle();

            if (userError) {
                console.error('Error fetching user record:', userError);
                setLoading(false);
                setTimeout(() => navigate('/'), 0);
                return;
            }

            if (!userRecord) {
                console.warn(
                    'User exists in auth but not in users table, redirecting to select-role.'
                );
                setLoading(false);
                setTimeout(() => navigate('/select-role'), 0);
                return;
            }

            setRole(userRecord.role);
        } catch (err) {
            console.error('Unexpected error in OverviewPage:', err);
            setTimeout(() => navigate('/'), 0);
        } finally {
            setLoading(false);
        }
    });

    return (
        <Show
            when={!loading()}
            fallback={
                <main class='flex justify-center items-center h-screen'>
                    <Loader />
                </main>
            }
        >
            {role() === 'student' && <StudentOverview />}
            {role() === 'teacher' && <TeacherOverview />}
            {role() === 'admin' && <AdminOverview />}
            {!role() && (
                <main class='flex flex-col justify-center items-center h-screen text-center'>
                    <p class='text-lg'>Invalid role or user not found.</p>
                    <button
                        class=' bg-blue-600 '
                        onClick={() => navigate('/login')}
                    >
                        Go to Login
                    </button>
                </main>
            )}
        </Show>
    );
}
