import { supabase } from '~/lib/supabaseClient';
import type { User } from '~/types/user';
import getAuthUser from './getAuthUser';
import getStudents from './getStudents';
import { Class } from '~/types/class';
import { getUserRole } from './getUserRole';

export type ClassData = {
    id: Class['id'];
    name: Class['name'];
    section: Class['section'];
    description: Class['description'];
    teacher_id: Class['teacher_id'];
    teacher_name: string;
    room: Class['room'];
    teacher_initials: string;
    hero_url: Class['hero_url'];
};

export type LoadClassDataResult = {
    authUser: any;
    role: any;
    students: User[];
    classes: ClassData[];
};

export async function loadClassData(): Promise<LoadClassDataResult | null> {
    // 1️⃣ Get authenticated user
    const user = await getAuthUser();
    if (!user) return null;

    // 2️⃣ Get user role
    const role = await getUserRole();
    if (!role) return null;

    // 3️⃣ Fetch students
    const students = await getStudents();

    // 4️⃣ Fetch classes
    let query = supabase
        .from('classes')
        .select(
            `
      id,
      name,
      section,
      description,
      room,
      hero_url,
      teacher_id,
      users!inner(name, teacher_initials)
    `
        )
        .order('created_at', { ascending: false });

    // If the user is a teacher, only fetch their classes
    if (role === 'teacher') {
        query = query.eq('teacher_id', user.id);
    }

    const { data: classData, error: classError } = await query;
    if (classError) {
        console.error('Error fetching classes:', classError);
        return null;
    }

    // Map class data into structured objects
    const classes: ClassData[] = (classData || []).map((cls: any) => ({
        id: cls.id,
        name: cls.name,
        section: cls.section,
        description: cls.description,
        room: cls.room || '',
        hero_url: cls.hero_url || '',
        teacher_id: cls.teacher_id,
        teacher_name: cls.users?.name || 'Unknown',
        teacher_initials: cls.users?.teacher_initials || '',
    }));

    return {
        authUser: user,
        role,
        students: students || [],
        classes,
    };
}
