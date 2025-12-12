import { useEffect, useState } from 'react';
import { supabase } from '~/clients/supabaseClient';
import useProfileColor from '~/hooks/useProfileColor';

const ProfileBadge = (props: { id: string; initials: string; colorID?: string }) => {
    const [profileColorID, setProfileColorID] = useState<string | undefined>(props.colorID);

    const color = useProfileColor({ colorID: profileColorID ?? '' });

    useEffect(() => {
        async function getProfileColor() {
            if (!props.id) return;
            const { data, error } = await supabase
                .from('user_settings')
                .select('profile_color')
                .eq('id', props.id)
                .single();

            if (error) {
                console.error(error);
                return;
            }

            setProfileColorID(data?.profile_color);
        }

        if (!props.colorID) getProfileColor();
    }, [props.id, props.colorID]);

    return (
        <div className={`w-8 h-8 rounded-4xl font-bold flex items-center justify-center ${color}`}>
            {props.initials}
        </div>
    );
};

export default ProfileBadge;
