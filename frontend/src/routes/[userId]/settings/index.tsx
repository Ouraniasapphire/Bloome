import { createSignal, onMount } from "solid-js/types/server/reactive.js"
import { supabase } from "~/lib/supabaseClient"
import { getAuthUser } from "~/utils"

const settings = () => {
    const [authUser, setAuthUser] = createSignal<any>(null)

    onMount( async () => {
        const user = await getAuthUser()

        setAuthUser(user)
    })

    return (
        <>

        </>
    )
}