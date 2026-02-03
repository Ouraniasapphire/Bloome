import React from "react";

type Props = {
    children: any;
};

const Menu = (props: Props) => {
    return (
        <div className='absolute top-14 left-2 w-fit h-fit bg-(--surface-0) flex flex-col items-center shadow-md rounded-lg border-(--surface-100) border-2 z-50' id='navbar-menu'>
            {React.Children.map(props.children, (child) => (
                <div className='w-full flex items-center'>{child}</div>
            ))}
        </div>
    );
};

export default Menu;
