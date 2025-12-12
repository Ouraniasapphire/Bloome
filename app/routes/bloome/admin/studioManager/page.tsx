import useSession from '~/hooks/useSession';
import { useEffect, useState } from 'react';
import { GetUserData } from '~/utils/getUserData';
import { useNavigate } from 'react-router';

const StudioManager = () => {
    const [userID, setUserID] = useState('');
    const [userRole, setUserRole] = useState('');
    const [session] = useSession();

    const navigate = useNavigate()

    useEffect(() => {
        async function getUserData() {
            const id = session?.user.id;
            if (!id) return;

            const userData = new GetUserData({ userID: id });
            const role = await userData.getUserRole();

            setUserID(id);
            setUserRole(role);
        }
        getUserData();
    });


    if (userRole === 'student') {
        navigate('/')
    } else {
        return (
            <div>
                
            </div>
        )
    }
};

export default StudioManager;
