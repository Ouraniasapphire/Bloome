import { useEffect, useState } from 'react';
import Icon from './Icon';
import Menu from './Menu';
import ThemeToggle from '../ThemeToggle/ThemeToggle';
import useSession from '~/hooks/useSession';
import { supabase } from '~/clients/supabaseClient';
import { useNavigate } from 'react-router';
import useRedirect from '~/hooks/useRedirect';
import { GetUserData } from '~/utils/getUserData';

const Navbar = () => {
    const [menu, showMenu] = useState(false);
    const [session, setSession] = useSession();
    const [userRole, setUserRole] = useState();
    const navigate = useNavigate();
    const redirect = useRedirect();

    useEffect(() => {
        async function getRole() {
            const authUserID = session?.user.id;
            if (!authUserID) return;

            const userData = new GetUserData({ userID: authUserID });
            const userRole = await userData.getUserRole();
            setUserRole(userRole);
        }
        getRole();
    });

    const signOut = async () => {
        const { error } = await supabase.auth.signOut();
        if (!error) {
            setSession(null);
            navigate('/');
        }
    };

    const handleShowMenu = () => {
        showMenu((prev) => !prev);
    };

    const SignOutButton = () => {
        return (
            <button
                onClick={signOut}
                className='px-4 py-2 bg-linear-to-t from-purple-700 to-indigo-600 text-white rounded-lg! border-none! hover:cursor-pointer w-full mb-4 mr-4 mt-2 ml-4'
            >
                Sign out
            </button>
        );
    };

    const SettingsButton = () => {
        return (
            <button
                onClick={() => {
                    redirect('/settings');
                }}
                className='w-12 h-12 bg-(--surface-0) border-0! p-0! hover:cursor-pointer'
            >
                <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 -960 960 960'
                    className='fill-(--surface-text) h-8 w-8'
                >
                    <path d='m370-80-16-128q-13-5-24.5-12T307-235l-119 50L78-375l103-78q-1-7-1-13.5v-27q0-6.5 1-13.5L78-585l110-190 119 50q11-8 23-15t24-12l16-128h220l16 128q13 5 24.5 12t22.5 15l119-50 110 190-103 78q1 7 1 13.5v27q0 6.5-2 13.5l103 78-110 190-118-50q-11 8-23 15t-24 12L590-80H370Zm70-80h79l14-106q31-8 57.5-23.5T639-327l99 41 39-68-86-65q5-14 7-29.5t2-31.5q0-16-2-31.5t-7-29.5l86-65-39-68-99 42q-22-23-48.5-38.5T533-694l-13-106h-79l-14 106q-31 8-57.5 23.5T321-633l-99-41-39 68 86 64q-5 15-7 30t-2 32q0 16 2 31t7 30l-86 65 39 68 99-42q22 23 48.5 38.5T427-266l13 106Zm42-180q58 0 99-41t41-99q0-58-41-99t-99-41q-59 0-99.5 41T342-480q0 58 40.5 99t99.5 41Zm-2-140Z' />
                </svg>
            </button>
        );
    };

    const studentButtons = [
        <button key='Dashboard' onClick={() => redirect('/dashboard')}>
            Dashboard
        </button>,
    ];

    const teacherButtons = [
        <button key='Dashboard' onClick={() => redirect('/dashboard')}>
            Dashboard
        </button>,
        <button key='Studio Manager' onClick={() => redirect('/studio-manager')}> Studio Manager</button>,
    ];

    return (
        <div className='bg-(--surface-0) w-full h-12 text-black shadow-md flex flex-row items-center border-b-2 border-(--surface-100)'>
            <div onClick={handleShowMenu}>
                <Icon />
            </div>

            {menu && (
                <Menu>
                    <ThemeToggle />
                    {session && <SignOutButton />}
                </Menu>
            )}

            <div id='navbar-links' className='w-full'>{(userRole === 'student' && studentButtons) || teacherButtons}</div>

            {session && <SettingsButton />}
        </div>
    );
};

export default Navbar;
