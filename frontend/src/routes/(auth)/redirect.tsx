import { onMount } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import getAuthUser from '~/utils/getAuthUser';
import { getUserData } from '~/utils/getUserData';


export default function Redirect() {
    const navigate = useNavigate()

    onMount( async () => {
        const authUser = await getAuthUser();

        if (!authUser) {
            navigate('/')
        }

        const userData = await getUserData();
        const dynamicId = userData?.dynamic_key

        if (!userData?.role) {
            navigate('/select-role')
        } else if (userData?.role && userData?.initial_login) {
            navigate(`/${dynamicId}/setup`)
        } else {
            navigate(`/${dynamicId}/dashboard`);
        }
    })


    return 
}