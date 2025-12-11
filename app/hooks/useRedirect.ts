import { useNavigate } from "react-router";
import { GetUserData } from "~/utils/getUserData";
import useSession from "./useSession";
import { useState } from "react";

export default function useRedirect() {
    const navigate = useNavigate();
    const [session] = useSession();

    const redirect = async (url: string) => {
        const authUserID = session?.user.id;
        if (!authUserID) return;

        const getUserData = new GetUserData({ userID: authUserID });
        const urlParam = await getUserData.getDynamicKey();

        if (urlParam && url) navigate(`/${urlParam}/${url}`, { replace: true });
    };

    return redirect;
}
