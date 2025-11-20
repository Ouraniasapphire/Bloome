import { getUserRole } from './getUserRole';

export async function loadUserRole(): Promise<string | null> {
    const storedRole = localStorage.getItem('userRole');
    if (storedRole) return storedRole;

    const role = await getUserRole();
    if (role) localStorage.setItem('userRole', role);
    return role;
}
