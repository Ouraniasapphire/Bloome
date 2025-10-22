import { supabase } from "~/lib/supabaseClient";
import { User } from "~/types/user";

export type UserData = {
    id: string;
    name: string;
    email: string;
    role: 'teacher' | 'student' | 'admin';
    created_at: string;
    dynamic_key: string;
}

export type LoadUserDataResult = {
    authUser: any;
    role: string | null;
    memberships: any;
}

export async function loadUserData(): Promise<LoadUserDataResult | null> {
    const { data: authData, error: authError} = await supabase.auth.getUser(); // Get auth user from auth table
    if (authError || !authData?.user) {
        console.error('No authenticated user:', authError);
        return null;
    }
    const user = authData.user;
    
    const { data: userRecord, error: userError } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .maybeSingle();

    const role = userRecord?.role || null;
    return {
        authUser: user,
        role,
        memberships: null,
    };
}