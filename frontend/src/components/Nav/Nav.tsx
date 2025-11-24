import { useHref, useNavigate } from '@solidjs/router';
import { createEffect, createSignal, For, JSX, onMount, Show } from 'solid-js';
import ThemeToggle from '../ThemeToggle/ThemeToggle';
import { getUserData } from '~/utils/getUserData';

type Props = {
    children?: any;
};

type btnProps = {
    children: JSX.Element;
    path: string;
};

const Icon = () => {
    return (
        <svg
            class='w-12 h-12'
            viewBox='0 0 384 384'
            xmlns='http://www.w3.org/2000/svg'
            style='fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;'
        >
            <path
                d='M192,96c0,0 48,43.016 48,96c0,52.984 -48,96 -48,96c0,0 -48,-43.016 -48,-96c0,-52.984 48,-96 48,-96Z'
                style='fill:#5c4fd5;'
            />
            <path
                d='M56.235,152.235c0,0 64.359,-3.524 101.824,33.942c37.465,37.465 33.941,101.823 33.941,101.823c-0,0 -64.358,3.524 -101.823,-33.941c-37.466,-37.465 -33.942,-101.824 -33.942,-101.824Z'
                style='fill:#2979ff;'
            />
            <path
                d='M327.941,152.147c0,0 -64.358,-3.524 -101.823,33.941c-37.465,37.466 -33.941,101.824 -33.941,101.824c-0,-0 64.358,3.524 101.823,-33.941c37.465,-37.466 33.941,-101.824 33.941,-101.824Z'
                style='fill:#8e24aa;'
            />
            <path
                d='M105.974,158.029c3.896,-27.247 14.102,-48.048 14.102,-48.048c-0,-0 20.715,7.485 41.892,23.518c-7.237,12.106 -13.692,26.497 -16.492,42.182c-12.441,-8.672 -26.392,-14.173 -39.502,-17.652Z'
                style='fill:#8e24aa;'
            />
            <path
                d='M222.032,133.499c21.177,-16.033 41.892,-23.518 41.892,-23.518c0,-0 10.196,20.781 14.096,48.008c-13.117,3.498 -27.064,9.023 -39.49,17.723c-2.798,-15.697 -9.256,-30.099 -16.498,-42.213Z'
                style='fill:#2979ff;'
            />
        </svg>
    );
};

const Menu = () => {
    const navigate = useNavigate();
    return (
        <div
            id='menu-left'
            class='absolute left-[4px] top-full mt-2 flex flex-col items-center shadow-xl p-2 bg-white rounded-xl z-10 gap-4 dark:bg-gray-900'
            onClick={(e) => e.stopPropagation()}
        >
            <ThemeToggle />
            <button
                class='bg-blue-600 text-gray-100 hover:text-gray-800 text-sm text-left py-2 px-4'
                id='menu-left-btn'
                onClick={() => navigate('/')}
            >
                Log out
            </button>
        </div>
    );
};

const Nav = (Props: Props) => {
    const [usertype, setUsertype] = createSignal();

    const [showMenu, setShowMenu] = createSignal(false);
    const [dynamicKey, setDynamicKey] = createSignal();
    const [signedIn, setSignedIn] = createSignal(null);
    const children = Array.isArray(Props.children) ? Props.children : [Props.children];
    const navigate = useNavigate(); // <A> and 'use' router primitives can be only used inside a Route.

    onMount(async () => {
        const user = await getUserData();

        if (user === null) {
            return;
        } else {
            setUsertype(user?.role);
            setDynamicKey(user?.dynamic_key);
        }
    });

    const Navigate = (path: string) => {
        const key = dynamicKey();
        if (!dynamicKey) {
            return;
        }

        navigate(`/${key}/${path}`);
    };

    // Reusable button for navbar routing
    const Button = (props: btnProps) => (
        <button
            onClick={() => Navigate(props.path)}
            class='px-4 py-2 text-gray-800 dark:text-white'
        >
            {props.children}
        </button>
    );

    const Divider = () => {
        return <div class='h-6 w-px bg-gray-300 mx-4' />;
    };

    const adminLinks = () => {
        return [
            <Button path={'grades/'}>Grades</Button>,
            <Button path={'studios/'}>Studios</Button>,
        ];
    };

    const studentLinks = () => {
        return [<button> Grades </button>, <button> Settings </button>];
    };

    const handleClickShow = () => {
        setShowMenu((s) => !s);
    };
    createEffect(() => {
        const handleClick = (e: any) => {
            const menuEl = document.getElementById('menu-left');
            const btnEl = document.getElementById('menu-left-btn');

            if (!menuEl || !btnEl) {
                setShowMenu(false);
                return;
            }

            if (!menuEl.contains(e.target) && !btnEl.contains(e.target)) {
                setShowMenu(false);
            }
        };

        if (showMenu()) {
            window.addEventListener('click', handleClick);
        }

        return () => window.removeEventListener('click', handleClick);
    }, [showMenu]);

    return (
        <>
            <nav class='navbar relative p-1 flex flex-row items-center'>
                <button id='compact' class='!p-0 '>
                    <div
                        id='menu-left-btn'
                        class='flex items-center '
                        onClick={() => handleClickShow()}
                    >
                        <Icon />
                        <svg
                            xmlns='http://www.w3.org/2000/svg'
                            fill='none'
                            viewBox='0 0 24 24'
                            stroke-Width={1.5}
                            class='size-4 stroke-black dark:stroke-white'
                        >
                            <path
                                stroke-Linecap='round'
                                stroke-Linejoin='round'
                                d='m19.5 8.25-7.5 7.5-7.5-7.5'
                            />
                        </svg>
                    </div>
                </button>

                {/* Show the menu */}

                <Show when={showMenu()}>
                    <Menu />
                </Show>

                {/* Start of navbar */}

                <Divider />

                <Button path={`/${dynamicKey()}/dashboard`}>Dashboard</Button>

                {/* Admin || Teacher */}

                <Show when={usertype() === 'teacher' || usertype() === 'admin'}>
                    <For each={adminLinks()}>
                        {(link) => (
                            <>
                                <Divider />
                                {link}
                            </>
                        )}
                    </For>
                </Show>

                {/* Student */}

                <Show when={usertype() === 'student'}>
                    <For each={studentLinks()}>
                        {(link) => (
                            <>
                                <Divider />
                                {link}
                            </>
                        )}
                    </For>
                </Show>
            </nav>
        </>
    );
};

export default Nav;
