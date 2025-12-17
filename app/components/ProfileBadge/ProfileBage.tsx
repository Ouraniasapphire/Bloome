import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '~/clients/firebaseClient';
import useProfileColor from '~/hooks/useProfileColor';

type BadgeProps = {
    id: string;
    initials?: string;
    colorID?: string;
    overrides?: string;
};

const ProfileBadge = ({
    id,
    initials: initialsProp,
    colorID: colorIDProp,
    overrides,
}: BadgeProps) => {
    const [initials, setInitials] = useState('');
    const [profileColorID, setProfileColorID] = useState<string | undefined>(colorIDProp);

    const color = useProfileColor({ colorID: colorIDProp ?? profileColorID ?? '' });

    useEffect(() => {
        async function getBadgeData() {
            if (!id) return;

            try {
                const docRef = doc(db, 'user_settings', id);
                const docSnap = await getDoc(docRef);

                if (!docSnap.exists()) {
                    console.warn('User settings not found for id:', id);
                    return;
                }

                const data = docSnap.data() as { initials?: string; profile_color?: string };
                setInitials(data.initials ?? '');
                if (!colorIDProp) setProfileColorID(data.profile_color ?? '');
            } catch (err) {
                console.error('Failed to fetch profile badge data:', err);
            }
        }

        getBadgeData();
    }, [id, colorIDProp]);

    return (
        <div
            className={`w-8 h-8 rounded-full font-bold flex items-center justify-center ${color} ${overrides}`}
        >
            {initialsProp || initials}
        </div>
    );
};

export default ProfileBadge;