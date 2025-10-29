export type User = {
    id: string;
    name: string;
    email: string;
    role: 'teacher' | 'student' | 'admin';
    created_at: string; // or Date if you convert it later
    dynamic_key?: string;
    initial_login?: boolean;
};
