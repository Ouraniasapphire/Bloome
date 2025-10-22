import { useNavigate, useLocation } from "@solidjs/router"
import { createSignal, onMount } from "solid-js"
import { supabase } from "~/lib/supabaseClient"

export default function StudioPage() {
    const navigate = useNavigate();
    const location = useLocation();

    const [authUser, setAuthUser] = createSignal<any>(null)

    onMount(async () => {
        const { data: authData, error: authError } = await supabase.auth.getUser(); // Wait till fetched

        if (authError || !authData?.user) {
            console.error("User not authorized", authError)
            navigate("/");
            return;

        }
        
        setAuthUser(authData.user);
    })

    return (<>Hello</>)
}