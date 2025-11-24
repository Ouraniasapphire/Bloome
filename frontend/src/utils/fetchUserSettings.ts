import { supabase } from "~/lib/supabaseClient";

export class fetchUserSettings {
    async all() {
        const {data, error} = await supabase 
        .from('user_settings')
        .select('*')

        return data
    }

    async byID(props: {id: string}) {
        const {data, error} = await supabase 
        .from('user_settings')
        .select('*')
        .eq('id', props.id)

        return data
    }
}