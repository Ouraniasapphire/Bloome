import { A, useLocation } from '@solidjs/router';
import { Show } from 'solid-js';

export default function Nav() {
    const location = useLocation();

    const active = (path: string) =>
        path === location.pathname ? 'border-sky-600' : 'border-transparent hover:border-sky-600';

    return (
        <nav class='bg-black'>
            <Show when={location.pathname !== '/auth/login'}>
                <A href='/' class={active('/')}>
                    <img class='h-8 w-8' src='/android-chrome-192x192.png' alt='Logo' />
                </A>
            </Show>
        </nav>
    );
}
