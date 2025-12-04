import { useState } from 'react';
import Icon from './Icon';
import Menu from './Menu';
import ThemeToggle from '../ThemeToggle/ThemeToggle';

type Props = {
    children: any; // for the sign out button
};

const Navbar = (props: Props) => {
    const [menu, showMenu] = useState(false);

    const handleShowMenu = () => {
        showMenu((prev) => !prev);
    };

    return (
        <div className='bg-(--surface-0) w-full h-12 text-black shadow-md flex flex-row items-center border-b-2 border-(--surface-100)'>
            <div onClick={handleShowMenu}>
                <Icon />
            </div>

            {menu && (
                <Menu>
                    <ThemeToggle />
                    {props.children}
                </Menu>
            )}
        </div>
    );
};

export default Navbar;
