import { supabase } from "~/clients/supabaseClient"

type Props = {
    userID: string;
}

export async function getDynamicKey(props: Props) {
    const {data: user, error} = await supabase
    .from("users")
    .select("*")
    .eq("id", props.userID)
    .single()

    if (error || !user) {
        throw new Error(`No profile found ${error}`)
        return
    }

    return user.dynamic_key
}