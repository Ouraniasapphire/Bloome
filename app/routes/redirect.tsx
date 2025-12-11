// routes/redirect.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { supabase } from '../clients/supabaseClient';
import Loading from '~/components/loading/Loading';
import { GetUserData } from '~/utils/getUserData';
import useSession from '~/hooks/useSession';

export default function Redirect() {
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const session = useSession();

    useEffect(() => {
        async function checkSession() {
            const {data: {session}} = await supabase.auth.getSession()

            const authUserID = session?.user.id; // Get ID from supabase user session
            if (!authUserID) {
                return;
            }

            const getUserData = new GetUserData({ userID: authUserID });
            const urlParam = await getUserData.getDynamicKey();

            if (session) {
                navigate(`/${urlParam}/dashboard`, { replace: true });
                setLoading(false);
            } else {
                navigate('/', { replace: true });
                setLoading(false);
            }

            setLoading(false);
        }

        checkSession();
    }, [navigate]);

    return loading ? <Loading /> : null;
}
