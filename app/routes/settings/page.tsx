import { useEffect, useState } from 'react';
import useSession from '~/hooks/useSession';
import { GetUserData } from '~/utils/getUserData';

const Settings = () => {
    const [session] = useSession();
    const [settings, setSettings] = useState<string[]>([]);

    useEffect(() => {
        async function getUserSettings() {
            const authUserID = session?.user.id;
            if (!authUserID) return;

            const userData = new GetUserData({ userID: authUserID });
            try {
                const userSettings = await userData.getUserSettings();
                setSettings(userSettings); // simple array
            } catch (error) {
                console.error(error);
                setSettings([]);
            }
        }

        getUserSettings();
    }, [session]);

    if (settings.length === 0) {
        return <p>Loading settings...</p>;
    }

    const preferredName = settings[0];
    const profileColor = settings[1];

    return (
        <div className='flex flex-row h-full box-border'>
            <div className='box-border p-4 w-1/2 '> hello world</div>
            <div
                id='settings-right'
                className='box-border p-4 w-1/2 border-l-2 border-(--surface-100) shadow-md'
            >
                <h1>Preferred Name</h1>
                <input defaultValue={preferredName} />
                <hr />
            </div>
        </div>
    );
};

export default Settings;
