import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import useSession from '~/hooks/useSession';
import { GetUserData } from '~/utils/getUserData';

const Dashboard = () => {
    const [name, setName] = useState('');
    const [session, setSession] = useSession();

    useEffect(() => {
        async function getUserName() {
            const authUserID = session?.user.id;
            if (!authUserID) return;
            const userData = new GetUserData({ userID: authUserID });
            const userName = await userData.getUserName();

            setName(userName);
        }
        getUserName()
    });

    return <>Hello, {name} </>;
};

export default Dashboard;
