import { useEffect, useState } from 'react';
import { supabase } from '~/clients/supabaseClient';
import ProfileBadge from '~/components/ProfileBadge/ProfileBage';
import useSession from '~/hooks/useSession';
import { GetUserData } from '~/utils/getUserData';

const Settings = () => {
    const [session] = useSession();
    const [settings, setSettings] = useState<string[]>([]);
    const [userID, setUserID] = useState('');

    const [changedName, setChangedName] = useState('');

    const [changedColor, setChangedColor] = useState('');
    const [currentColor, setCurrentColor] = useState('');

    const [changedInitials, setChangedInitials] = useState('');
    const [currentInitials, setCurrentInitials] = useState('');

    useEffect(() => {
        async function getUserSettings() {
            const authUserID = session?.user.id;
            if (!authUserID) return;
            setUserID(authUserID);

            const userData = new GetUserData({ userID: authUserID });

            try {
                const userSettings = await userData.getUserSettings();
                setSettings(userSettings);

                // initialize
                setChangedName(userSettings[0] || '');

                setCurrentColor(userSettings[1] || '');
                setChangedColor(userSettings[1] || '');

                setCurrentInitials(userSettings[2] || '');
                setChangedInitials(userSettings[2] || '');
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

    // Update supabase table
    async function updateSettings(props: { name?: string; color?: string; initials?: string }) {
        try {
            await supabase
                .from('user_settings')
                .update({
                    preferred_name: props.name,
                    profile_color: props.color,
                    initials: props.initials,
                })
                .eq('id', userID);
        } catch (error) {
            console.error('Error updating settings:', error);
        }
    }

    // Collect all changes and form the payload
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const updatePayload: { name?: string; color?: string; initials?: string } = {};
        // if ( changedName && changedName !== settings[0]) updatePayload.name = changedName;
        if (changedName !== settings[0]) updatePayload.name = changedName;
        if (changedInitials && changedInitials !== currentInitials)
            updatePayload.initials = changedInitials;
        if (changedColor && changedColor !== currentColor) updatePayload.color = changedColor;

        if (Object.keys(updatePayload).length === 0) return;

        await updateSettings(updatePayload);

        // Update state immediately for UI
        setSettings((prev) => [
            updatePayload.name ?? prev[0],
            updatePayload.color ?? prev[1],
            updatePayload.initials ?? prev[2],
        ]);

        if (updatePayload.color) setCurrentColor(updatePayload.color);
        if (updatePayload.initials) setCurrentInitials(updatePayload.initials);
    };

    return (
        <div className='flex flex-row h-full box-border'>
            <div className='box-border p-4 w-1/2 h-full leading-none flex items-center justify-center'>
                <div className='w-fit h-fit flex items-center justify-center space-x-8  bg-(--surface-0) shadow-md p-4 border-2 border-(--surface-100) rounded-full'>
                    <ProfileBadge
                        id={userID}
                        initials={currentInitials}
                        colorID={currentColor}
                        key={currentColor}
                        overrides={'!h-20 !w-20 !text-4xl'}
                    />
                    {changedName && <h1 className='font-bold text-4xl'>{preferredName}</h1>}
                    
                </div>

                <div></div>
            </div>
            <div
                id='settings-right'
                className='box-border p-4 w-1/2 border-l-2 border-(--surface-100) shadow-md'
            >
                <span className='flex items-center place-content-between'>
                    <h1>Preferred Name</h1>
                    <input value={changedName} onChange={(e) => setChangedName(e.target.value)} />
                </span>

                <span className='flex items-center place-content-between'>
                    <h1>Initials</h1>
                    <input
                        value={changedInitials}
                        onChange={(e) => setChangedInitials(e.target.value)}
                        maxLength={2}
                        pattern='[a-zA-Z]+'
                    />
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

                <div className='border-t border-gray-200 my-4' />

                <button className='px-8! py-2!' onClick={handleSubmit}>
                    Save
                </button>
            </div>
        </div>
    );
};

export default Settings;
