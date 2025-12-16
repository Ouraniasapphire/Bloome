import { useEffect, useState } from 'react';
import { supabase } from '~/clients/supabaseClient';
import useProfileColor from '~/hooks/useProfileColor';

type BadgeProps = {
    id: string;
    initials?: string;
    colorID?: string;
    overrides?: string; // Optional style overrides
};

const ProfileBadge = (props: BadgeProps) => {
    const [profileColorID, setProfileColorID] = useState<string | undefined>(props.colorID);
    const [initials, setInitials] = useState('')

    const color = useProfileColor({ colorID: profileColorID ?? '' });

    useEffect(() => {
        async function getBadgeData() {
            if (!props.id) return;
            const { data, error } = await supabase
                .from('user_settings')
                .select('*')
                .eq('id', props.id)
                .single();

            if (error) {
                console.error(error);
                return;
            }

            setInitials(data?.initials)
            setProfileColorID(data?.profile_color);
        }

        if (!props.colorID) getBadgeData();
    }, [props.id, props.colorID]);


    // keep initials prop for settings, use initials whenever else
    return (
        <div className={`w-8 h-8 rounded-full font-bold flex items-center justify-center ${color} ${props.overrides}`}>
            {props.initials || initials}
        </div>
    );
};

export default ProfileBadge