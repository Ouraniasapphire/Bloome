import { supabase } from "./supabaseClient";

type Props = {
    name: string;
    section: string;
    description: string;
    teacher_id: string;
    room: string;
    hero?: string;
}

export async function createClass(props: Props) {
    try {
        const payload: any = {
            name: props.name,
            section: props.section,
            description: props.description,
            teacher_id: props.teacher_id,
            room: props.room,
            created_at: new Date().toISOString(),
        };
        if (props.hero) payload.hero_url = props.hero


        const {data: classData, error: classError} = await supabase
            .from('classes')
            .insert(payload)
            .select()
            .single()
        if (classError) throw classError


        const {error: membershipError} = await supabase.from('memberships').upsert(
            {
                class_id: classData.id,
                user_id: classData.teacher_id,
                role: 'teacher',
                joined_at: new Date().toISOString(),
            }
        )
        if (membershipError) throw membershipError

        return classData
    }
    catch (err: any ) {
        return console.log(err)
    }
}