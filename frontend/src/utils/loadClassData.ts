import { supabase } from '~/lib/supabaseClient';
import type { User } from '~/types/user';

export type ClassData = {
    id: string;
    name: string;
    section?: string;
    description?: string;
    teacher_id?: string;
    teacher_name?: string;
    teacher_initials?: string;
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
    // 1️⃣ Get auth user
    const { data: authData, error: authError } = await supabase.auth.getUser();
    if (authError || !authData?.user) {
        console.error('No authenticated user:', authError);
        return null;
    }
    const user = authData.user;

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
    const { data: studentData, error: studentError } = await supabase
        .from('users')
        .select('*')
        .eq('role', 'student');

    if (studentError) {
        console.error('Error fetching students:', studentError);
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
            teacher_id: cls.teacher_id,
            teacher_name: cls.users?.name || 'Unknown',
            teacher_initials: cls.users?.teacher_initials || ''
        })) ?? [];

    return {
        authUser: user,
        role,
        students: studentData || [],
        classes,
    };
}
