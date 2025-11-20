import { supabase } from "~/lib/supabaseClient";

const fetchClasses = async () => {
        const { data, error } = await supabase
            .from('classes')
            .select(
                '*, users!inner(name, teacher_initials)'
            )
            .order('created_at', { ascending: false });

        if (error) {
            return console.error(error);
        }

        return data || []
    };

export default fetchClasses;