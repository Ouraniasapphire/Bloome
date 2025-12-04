import { useParams } from 'react-router';

const Dashboard = () => {
    const { userID } = useParams()


    return <>{userID}</>;
};

export default Dashboard;
