import { supabase } from '~/lib/supabaseClient';
import type { User } from '~/types/user';
import getAuthUser from './getAuthUser';
import getStudents from './getStudents';
import { Class } from '~/types/class';

export type ClassData = {
    id: Class['id'];
    name: Class['name'];
    section: Class['section'];
    description: Class['description'];
    teacher_id: Class['teacher_id'];
    teacher_name: Class['teacher_name'];
    teacher_initials: Class['teacher_initials'];
    hero_url: Class['hero_url'];
};

export type LoadClassDataResult = {
    authUser: any;
    role: string | null;
    students: User[];
    classes: ClassData[];
};

/**
 * Fetches authenticated user, role, students, and classes.
 * Returns structured data you can set into Solid signals.
 */
export async function loadClassData(): Promise<LoadClassDataResult | null> {
    const user = await getAuthUser();

    if (!user) {
        return null;
    }

    // 2️⃣ Get user role
    const { data: userRecord, error: userError } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .maybeSingle();

    if (userError) {
        console.error('Error fetching user role:', userError);
        return null;
    }
    const role = userRecord?.role || null;

    // 3️⃣ Fetch students
    const studentData = await getStudents();

    if (!studentData) {
        return null;
    }

    // 4️⃣ Fetch classes with teacher names
    let query = supabase
        .from('classes')
        .select(
            `
            id,
            name,
            section,
            description,      
            hero_url,
            teacher_id,
            users!inner(name, teacher_initials)
            `
        )
        .order('created_at', { ascending: false });

    if (role === 'teacher') {
        query = query.eq('teacher_id', user.id);
    }

    const { data: classData, error: classError } = await query;
    if (classError) {
        console.error('Error fetching classes:', classError);
        return null;
    }

    const classes =
        (classData || []).map((cls: any) => ({
            id: cls.id,
            name: cls.name,
            section: cls.section,
            description: cls.description,
            hero_url: cls.hero_url || '',
            teacher_id: cls.teacher_id,
            teacher_name: cls.users.name || 'Unknown',
            teacher_initials: cls.users.teacher_initials || '',
        })) ?? [];

    return {
        authUser: user,
        role,
        students: studentData || [],
        classes,
    };
}
