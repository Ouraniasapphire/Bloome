// dashboard/layout.tsx
import { JSX, Show } from 'solid-js';
import { useAuth } from '~/context/AuthContext';
import Nav from '~/components/Nav/Nav';

export default function DashboardLayout(props: { children: JSX.Element }) {
    const { user, role, loading } = useAuth();

    return (
        <Show when={!loading()} fallback={<p>Loading...</p>}>
            <Show when={user()}>
                <div class='bg-white dark:bg-gray-800 min-h-screen overflow-auto'>

                    <div class='flex flex-row w-full min-h-screen'>

                        <main class='flex-1 overflow-auto'>
                            {props.children} {/* Each page renders here */}
                        </main>
                    </div>
                </div>
            </Show>
        </Show>
    );
}
