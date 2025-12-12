import { useEffect, useState } from 'react';
import { supabase } from '~/clients/supabaseClient';
import ProfileBadge from '~/components/ProfileBadge/ProfileBage';
import useSession from '~/hooks/useSession';
import { GetUserData } from '~/utils/getUserData';

const Settings = () => {
    const [session] = useSession();
    const [settings, setSettings] = useState<string[]>([]);
    const [userID, setUserID] = useState('');
    const [userInitials, setUserInitials] = useState('');

    const [changedName, setChangedName] = useState('');
    const [changedColor, setChangedColor] = useState('');
    const [currentColor, setCurrentColor] = useState('');

    useEffect(() => {
        async function getUserSettings() {
            const authUserID = session?.user.id;
            if (!authUserID) return;
            setUserID(authUserID);

            const userData = new GetUserData({ userID: authUserID });

            try {
                const userSettings = await userData.getUserSettings();
                setSettings(userSettings);

                const initials = await userData.getUserInitials();
                setUserInitials(initials || '');

                // initialize badge color
                setCurrentColor(userSettings[1] || '');
                setChangedName(userSettings[0] || '');
                setChangedColor(userSettings[1] || '');
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

    async function updateSettings(props: { name?: string; color?: string }) {
        try {
            await supabase
                .from('user_settings')
                .update({ preferred_name: props.name, profile_color: props.color })
                .eq('id', userID);
        } catch (error) {
            console.error('Error updating settings:', error);
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const updatePayload: { name?: string; color?: string } = {};

        if (changedName && changedName !== preferredName) updatePayload.name = changedName;
        if (changedColor && changedColor !== currentColor) updatePayload.color = changedColor;

        if (Object.keys(updatePayload).length === 0) return;

        await updateSettings(updatePayload);

        // Update state immediately for UI
        if (updatePayload.name) setSettings([updatePayload.name, settings[1]]);
        if (updatePayload.color) {
            setSettings([updatePayload.name ?? settings[0], updatePayload.color]);
            setCurrentColor(updatePayload.color); // force badge to reload
        }
    };

    return (
        <div className='flex flex-row h-full box-border'>
            <div className='box-border p-4 w-1/2'>hello world</div>
            <div
                id='settings-right'
                className='box-border p-4 w-1/2 border-l-2 border-(--surface-100) shadow-md'
            >
                <div className='w-full h-fit flex items-center justify-center space-x-1 py-4' >
                    <h1>{preferredName}</h1>
                    <ProfileBadge
                        id={userID}
                        initials={userInitials}
                        colorID={currentColor}
                        key={currentColor}
                    />
                </div>

                <hr />

                <span className='flex items-center place-content-between'>
                    <h1>Preferred Name</h1>
                    <input value={changedName} onChange={(e) => setChangedName(e.target.value)} />
                </span>
                <span className='flex items-center place-content-between'>
                    <h1>Profile Color</h1>
                    <select
                        name='profile_color'
                        value={changedColor}
                        onChange={(e) => setChangedColor(e.target.value)}
                    >
                        <option value=''>Select an icon color</option>
                        <option value='0'>Icon color 1</option>
                        <option value='1'>Icon color 2</option>
                        <option value='2'>Icon color 3</option>
                    </select>
                </span>

                <hr />

                <button className="px-8! py-2!" onClick={handleSubmit}>
                    Save
                </button>
            </div>
        </div>
    );
};

export default Settings;
