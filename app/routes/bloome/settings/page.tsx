import { useEffect, useState } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '~/clients/firebaseClient';
import ProfileBadge from '~/components/ProfileBadge/ProfileBage';
import useAuth from '~/hooks/useAuth';

const Settings = () => {
    const { user } = useAuth();
    const [settings, setSettings] = useState<{
        name: string;
        color: string;
        initials: string;
    } | null>(null);

    const [changedName, setChangedName] = useState('');
    const [changedColor, setChangedColor] = useState('');
    const [changedInitials, setChangedInitials] = useState('');

    const [currentColor, setCurrentColor] = useState('');
    const [currentInitials, setCurrentInitials] = useState('');

    // Fetch user settings from Firestore
    useEffect(() => {
        if (!user) return;

        const fetchSettings = async () => {
            try {
                const docRef = doc(db, 'user_settings', user.uid);
                const docSnap = await getDoc(docRef);

                if (!docSnap.exists()) {
                    // If user settings don't exist, create default
                    await setDoc(docRef, {
                        preferred_name: user.displayName ?? '',
                        profile_color: '',
                        initials: '',
                    });
                    setSettings({ name: user.displayName ?? '', color: '', initials: '' });
                    setChangedName(user.displayName ?? '');
                    setChangedColor('');
                    setChangedInitials('');
                    setCurrentColor('');
                    setCurrentInitials('');
                    return;
                }

                const data = docSnap.data();
                setSettings({
                    name: data.preferred_name ?? '',
                    color: data.profile_color ?? '',
                    initials: data.initials ?? '',
                });
                setChangedName(data.preferred_name ?? '');
                setChangedColor(data.profile_color ?? '');
                setChangedInitials(data.initials ?? '');
                setCurrentColor(data.profile_color ?? '');
                setCurrentInitials(data.initials ?? '');
            } catch (err) {
                console.error('Error fetching settings:', err);
            }
        };

        fetchSettings();
    }, [user]);

    if (!settings) return <p>Loading settings...</p>;

    // Update Firestore
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        const docRef = doc(db, 'user_settings', user.uid);
        const updatePayload: {
            preferred_name?: string;
            profile_color?: string;
            initials?: string;
        } = {};

        if (changedName !== settings.name) updatePayload.preferred_name = changedName;
        if (changedColor !== currentColor) updatePayload.profile_color = changedColor;
        if (changedInitials !== currentInitials) updatePayload.initials = changedInitials;

        if (Object.keys(updatePayload).length === 0) return;

        try {
            await setDoc(docRef, { ...settings, ...updatePayload });
            setSettings((prev) => ({ ...prev!, ...updatePayload }));

            if (updatePayload.profile_color) setCurrentColor(updatePayload.profile_color);
            if (updatePayload.initials) setCurrentInitials(updatePayload.initials);
        } catch (err) {
            console.error('Error updating settings:', err);
        }
    };

    return (
        <div className='flex flex-row h-full box-border'>
            <div className='box-border p-4 w-1/2 h-full leading-none flex items-center justify-center'>
                <div className='w-fit h-fit flex items-center justify-center space-x-8 bg-(--surface-0) shadow-md p-4 border-2 border-(--surface-100) rounded-full'>
                    {user && (
                        <>
                            <ProfileBadge
                                id={user.uid}
                                initials={currentInitials}
                                colorID={currentColor}
                                key={currentColor}
                                overrides='!h-20 !w-20 !text-4xl'
                            />
                            {changedName && (
                                <h1 className='font-bold text-4xl mr-2'>{changedName}</h1>
                            )}
                        </>
                    )}
                </div>
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

                <button className='px-8 py-2' onClick={handleSubmit}>
                    Save
                </button>
            </div>
        </div>
    );
};

export default Settings;
