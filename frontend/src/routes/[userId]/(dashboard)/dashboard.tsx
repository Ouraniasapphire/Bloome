// dashboard/index.tsx
import AdminPanel from '~/components/views/admin-overview';
import { getUserData } from '~/utils/getUserData';
import { createSignal, onMount, Show } from 'solid-js';
import StudentOverview from '~/components/views/student-overview';
import Nav from '~/components/Nav/Nav';
import AdminOverview from '~/components/views/admin-overview';

export default function DashboardPage() {
    const [usertype, setUsertype] = createSignal();

    onMount(async () => {
        const user = await getUserData();

        setUsertype(user?.role);
    });

    return (
        <>
            <Nav />
            <Show when={usertype() === 'admin' || usertype() === 'teacher'}>
                <AdminOverview />
            </Show>
            <Show when={usertype() === 'student'}>
                <StudentOverview />
            </Show>
        </>
    );
}
