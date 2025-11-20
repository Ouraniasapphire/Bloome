import { getUserData } from "./getUserData";


export async function getUserRole(): Promise<string |null> {
    
    const userData = await getUserData();

    if (!userData) {
        return null
    }

    return userData?.role || null
}