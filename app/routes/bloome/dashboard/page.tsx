import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import StudioCard from '~/components/StudioCard/StudioCard';
import useSession from '~/hooks/useSession';
import { GetClassData } from '~/utils/getClassData';
import { GetUserData } from '~/utils/getUserData';

const Dashboard = () => {
    const [name, setName] = useState('');
    const [session, setSession] = useSession();

    useEffect(() => {
        async function getUserName() {
            const authUserID = session?.user.id;
            if (!authUserID) return;
            const userData = new GetUserData({ userID: authUserID });
            const [userName] = await userData.getUserName();

            setName(userName);
        }

        async function fetchEnrollments() {
            const authUserID = session?.user.id;
            if (!authUserID) return;
            const data = new GetClassData({ userID: authUserID });

            console.log(data)
        }
        getUserName();
        fetchEnrollments();
    });

    const testData = {
        id: '1234',
        name: 'Test class',
        description: 'Hello world',
        teacher_id: '5678',
        invite_code: '0',
        hero_url: '',
        room: '204',
        hour: '1st',
    };

    return (
        <div className='w-full h-full flex gap-4 flex-row flex-wrap justify-start items-stretch p-4 box-border'>
            <StudioCard
                id={testData.id}
                name={testData.name}
                description={testData.description}
                teacher_id={testData.teacher_id}
                invite_code={testData.invite_code}
                room={testData.room}
                hour={testData.hour}
            />
            <StudioCard
                id={testData.id}
                name={testData.name}
                description={testData.description}
                teacher_id={testData.teacher_id}
                invite_code={testData.invite_code}
                room={testData.room}
                hour={testData.hour}
            />
            <StudioCard
                id={testData.id}
                name={testData.name}
                description={testData.description}
                teacher_id={testData.teacher_id}
                invite_code={testData.invite_code}
                room={testData.room}
                hour={testData.hour}
            />
            <StudioCard
                id={testData.id}
                name={testData.name}
                description={testData.description}
                teacher_id={testData.teacher_id}
                invite_code={testData.invite_code}
                room={testData.room}
                hour={testData.hour}
            />
        </div>
    );
};

export default Dashboard;
