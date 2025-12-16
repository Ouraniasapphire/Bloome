import { useEffect, useState } from 'react';
import Icon from './Icon';
import Menu from './Menu';
import ThemeToggle from '../ThemeToggle/ThemeToggle';
import useSession from '~/hooks/useSession';
import { supabase } from '~/clients/supabaseClient';
import { useNavigate } from 'react-router';
import useRedirect from '~/hooks/useRedirect';
import { GetUserData } from '~/utils/getUserData';
import ProfileBadge from '../ProfileBadge/ProfileBage';

const Navbar = () => {
    const [showMenu, setShowMenu] = useState(false);
    const [session, setSession] = useSession();
    const [userRole, setUserRole] = useState();
    const [userID, setUserID] = useState('');

    const navigate = useNavigate();
    const redirect = useRedirect();

    useEffect(() => {
        async function getData() {
            const authUserID = session?.user.id;
            if (!authUserID) throw new Error('User is not signed in.');

            setUserID(authUserID);

            const userData = new GetUserData({ userID: authUserID });
            const userRole = await userData.getUserRole();


            setUserRole(userRole);
        }
        getData();
    });

    useEffect(() => {
        const handleClick = (e: any) => {
            const menuEl = document.getElementById('navbar-menu');
            const btnEl = document.getElementById('navbar-menu-btn');

            if (!menuEl || !btnEl) {
                setShowMenu(false);
                return;
            }

            if (!menuEl.contains(e.target) && !btnEl.contains(e.target)) {
                setShowMenu(false);
            }
        };

        if (showMenu) {
            window.addEventListener('click', handleClick);
        }

        return () => window.removeEventListener('click', handleClick);
    }, [showMenu]);

    const signOut = async () => {
        const { error } = await supabase.auth.signOut();
        if (!error) {
            setSession(null);
            navigate('/');
        }
    };

    const handleShowMenu = () => {
        setShowMenu((prev) => !prev);
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
                <ProfileBadge id={userID} />
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
        <button key='Studio Manager' onClick={() => redirect('/studio-manager')}>
            {' '}
            Studio Manager
        </button>,
    ];

    return (
        <div className='bg-(--surface-0) w-full h-12 shadow-md flex flex-row items-center border-b-2 border-(--surface-100)'>
            <div onClick={handleShowMenu} id='navbar-menu-btn'>
                <Icon />
            </div>

            {showMenu && (
                <Menu>
                    <ThemeToggle />
                    {session && <SignOutButton />}
                </Menu>
            )}

            <div id='navbar-links' className='w-full'>
                {(userRole === 'student' && studentButtons) || teacherButtons}
            </div>

            {session && <SettingsButton />}
        </div>
    );
};

export default Navbar;
