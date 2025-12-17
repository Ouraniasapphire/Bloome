import { useEffect, useState } from 'react';
import Loading from '~/components/loading/Loading';
import useAuth from '~/hooks/useAuth';
import useRedirect from '~/hooks/useRedirect';

export default function Redirect() {
    const [loading, setLoading] = useState(true);
    const { user, loading: authLoading } = useAuth(); // make sure your hook returns auth loading state
    const redirect = useRedirect();

    useEffect(() => {

        if (authLoading) return;
        if (!user) {
            window.location.href = '/';
            return;
        }

        const doRedirect = async () => {
            try {
                await redirect('dashboard');
            } catch (err) {
                console.error('Redirect failed:', err);
            } finally {
                setLoading(false);
            }
        };

        doRedirect();
    }, [user, authLoading, redirect]);

    return loading ? <Loading /> : null;
}
