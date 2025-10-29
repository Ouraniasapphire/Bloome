import { createSignal, onMount, For, Show } from 'solid-js';
import { supabase } from '~/lib/supabaseClient';
import type { User } from '~/types/user';
import type { Class } from '~types/class';
import ImageUploader from './ImageUploader';
import { getUserRole } from '~/utils/getUserRole';
import CreateStudioCard from './CreateStudioCard';

export default function StudioPanel() {
    const [authUser, setAuthUser] = createSignal<any>(null);
    const [role, setRole] = createSignal<string | null>(null);

    const [students, setStudents] = createSignal<User[]>([]);
    const [selectedStudents, setSelectedStudents] = createSignal<string[]>([]);
    const [classes, setClasses] = createSignal<Class[]>([]);

    onMount(async () => {
        const { data: authData, error: authError } = await supabase.auth.getUser();
        if (authError || !authData?.user) return;
        setAuthUser(authData.user);

        const userRecord = await getUserRole();
        setRole(userRecord?.role || null);

        const { data: studentData, error: studentError } = await supabase
            .from('users')
            .select('*')
            .eq('role', 'student');
        if (!studentError) setStudents(studentData || []);

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
                users!inner(name)
            `
            )
            .order('created_at', { ascending: false });

        if (userRecord?.role === 'teacher') query = query.eq('teacher_id', authData.user.id);

        const { data: classData, error: classError } = await query;
        if (classError) return;

        const classesWithStudents = await Promise.all(
            (classData || []).map(async (cls: any) => {
                const { data: enrolled, error: enrollError } = await supabase
                    .from('memberships')
                    .select('users(id, name, email)')
                    .eq('class_id', cls.id)
                    .eq('role', 'student');

                const enrolledStudents = enrolled?.map((m: any) => m.users).filter(Boolean) || [];

                return {
                    id: cls.id,
                    name: cls.name,
                    section: cls.section,
                    description: cls.description,
                    hero_url: cls.hero_url,
                    teacher_id: cls.teacher_id,
                    teacher_name: cls.users?.name || 'Unknown',
                    enrolled_students: enrolledStudents,
                };
            })
        );

        setClasses(classesWithStudents);
    });

    const addStudentsToClass = async (classId: string) => {
        if (!selectedStudents().length) return;

        const rows = selectedStudents().map((userId) => ({
            class_id: classId,
            user_id: userId,
            role: 'student',
        }));

        const { error } = await supabase.from('memberships').insert(rows);
        if (error) console.error(error);
        else {
            const { data: enrolled } = await supabase
                .from('memberships')
                .select('users(id, name, email)')
                .eq('class_id', classId)
                .eq('role', 'student');

            setClasses((prev) =>
                prev.map((c) =>
                    c.id === classId
                        ? { ...c, enrolled_students: enrolled?.map((m: any) => m.users) || [] }
                        : c
                )
            );
            setSelectedStudents([]);
        }
    };

    const removeStudentFromClass = async (classId: string, userId: string) => {
        if (!confirm('Are you sure you want to unenroll this student?')) return;

        const { error } = await supabase
            .from('memberships')
            .delete()
            .eq('class_id', classId)
            .eq('user_id', userId)
            .eq('role', 'student');

        if (error) return;

        setClasses((prev) =>
            prev.map((c) =>
                c.id === classId
                    ? {
                          ...c,
                          enrolled_students: c.enrolled_students?.filter((s) => s.id !== userId),
                      }
                    : c
            )
        );
    };

    const toggleStudent = (id: string) => {
        setSelectedStudents((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
    };

    const StudioCard = () => (
        <>
            <h2 class='text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100'>Studios</h2>
            <For each={classes()}>
                {(cls) => (
                    <div class='flex flex-col md:flex-row justify-between gap-4 rounded-lg p-5 shadow-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 mb-4 transition'>
                        {/* Left: Class Info */}
                        <div class='flex-1 flex flex-col'>
                            <h3 class='text-xl font-semibold text-gray-900 dark:text-gray-100'>
                                {cls.name} {cls.section && `(${cls.section})`} — Teacher:{' '}
                                {cls.teacher_name}
                            </h3>
                            <p class='text-gray-700 dark:text-gray-300 mt-1'>{cls.description}</p>

                            <Show when={role() !== 'student'}>
                                <div class='flex gap-3 mt-3'>
                                    <button
                                        onClick={() => addStudentsToClass(cls.id)}
                                        class='bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition'
                                    >
                                        Add Selected Students
                                    </button>

                                    <button
                                        onClick={async () => {
                                            if (
                                                !confirm(
                                                    `Are you sure you want to delete "${cls.name}"?`
                                                )
                                            )
                                                return;
                                            const { error } = await supabase
                                                .from('classes')
                                                .delete()
                                                .eq('id', cls.id);
                                            if (!error)
                                                setClasses(
                                                    classes().filter((c) => c.id !== cls.id)
                                                );
                                        }}
                                        class='bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition'
                                    >
                                        Delete Studio
                                    </button>
                                </div>

                                <h4 class='mt-3 font-semibold text-gray-800 dark:text-gray-100'>
                                    Add Students
                                </h4>
                                <div class='flex flex-col max-h-48 overflow-y-auto border border-gray-200 dark:border-gray-700 p-2 rounded-lg mt-1'>
                                    <For each={students()}>
                                        {(student) => (
                                            <label class='flex items-center gap-2 py-1'>
                                                <input
                                                    type='checkbox'
                                                    checked={selectedStudents().includes(
                                                        student.id
                                                    )}
                                                    onInput={() => toggleStudent(student.id)}
                                                    class='accent-blue-600'
                                                />
                                                <span class='text-gray-800 dark:text-gray-200'>
                                                    {student.name} ({student.email})
                                                </span>
                                            </label>
                                        )}
                                    </For>
                                </div>
                            </Show>
                        </div>

                        {/* Right: Enrolled Students */}
                        <div class='w-full md:w-64 mt-4 md:mt-0 border-t md:border-t-0 md:border-l border-gray-200 dark:border-gray-700 pt-3 md:pt-0 md:pl-4'>
                            <h4 class='font-semibold text-gray-800 dark:text-gray-100 mb-2'>
                                Enrolled Students
                            </h4>
                            <Show
                                when={cls.enrolled_students?.length}
                                fallback={
                                    <p class='text-gray-500 dark:text-gray-400 text-sm'>
                                        No students enrolled
                                    </p>
                                }
                            >
                                <ul class='max-h-48 overflow-y-auto text-sm'>
                                    <For each={cls.enrolled_students}>
                                        {(student) => (
                                            <li class='border-b border-gray-200 dark:border-gray-700 py-1 flex justify-between items-center'>
                                                <div>
                                                    <span class='font-medium text-gray-900 dark:text-gray-100'>
                                                        {student.name}
                                                    </span>
                                                    <br />
                                                    <span class='text-gray-600 dark:text-gray-400 text-xs'>
                                                        {student.email}
                                                    </span>
                                                </div>
                                                <button
                                                    class='text-red-600 text-xs hover:underline'
                                                    onClick={() =>
                                                        removeStudentFromClass(cls.id, student.id)
                                                    }
                                                >
                                                    Unenroll
                                                </button>
                                            </li>
                                        )}
                                    </For>
                                </ul>
                            </Show>
                        </div>
                    </div>
                )}
            </For>
        </>
    );

    return (
        <main class='p-6 bg-gray-50 min-h-screen dark:bg-gray-800'>
            <CreateStudioCard />
            <section class='mt-6'>
                <StudioCard />
            </section>
        </main>
    );
}
