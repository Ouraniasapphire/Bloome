import { supabase } from '~/lib/supabaseClient';

type Props = {
    id: any;
};

const fetchMemberships = async (props: Props) => {
    const { data: memberships, error: membershipError } = await supabase
        .from('memberships')
        .select('class_id')
        .eq('user_id', props.id);

    if (membershipError) {
        console.error('Error fetching memberships:', membershipError);
    }

    return memberships
};

export default fetchMemberships