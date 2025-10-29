import { supabase } from "~/lib/supabaseClient";

export default async function getAuthUser() {
    const { data: authData, error: authError } = await supabase.auth.getUser();
    if (authError || !authData?.user) {
        console.error('No authenticated user:', authError);
        return null;
    }

    const user = authData.user

    return authData.user;
}