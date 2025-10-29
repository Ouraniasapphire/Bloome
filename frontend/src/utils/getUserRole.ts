import { supabase } from "~/lib/supabaseClient";
import getAuthUser from "./getAuthUser";

export async function getUserRole()  {

        const user = await getAuthUser();
        if (!user) return;

        const { data: userRecord, error: userError } = await supabase
                .from('users')
                .select('role')
                .eq('id', user.id)
                .maybeSingle();
    
            if (userError) {
                console.error('Error fetching user role:', userError);
                return;
            }

    return {
        role: userRecord?.role
    }

}