import { supabase } from '~/lib/supabaseClient';
import getAuthUser from './getAuthUser';

export async function getUserData() {
    const user = await getAuthUser();
    if (!user) return;

    const { data: userRecord, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

    if (userError) {
        console.error('Error fetching user role:', userError);
        return;
    }

    // In order of table scheme
    return {
        id: user.id,
        name: userRecord?.name,
        email: user.email,
        role: userRecord.role,
        created_at: userRecord.created_at,
        teacher_initials: userRecord.teacher_initials,
        dynamic_key: userRecord.dynamic_key,
        initial_login: userRecord.initial_login
    };
}