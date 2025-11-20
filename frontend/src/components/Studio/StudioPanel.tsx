import { createSignal, onMount, For, Show } from 'solid-js';
import { supabase } from '~/lib/supabaseClient';
import type { User } from '~/types/user';
import type { Class } from '~types/class';
import { getUserRole } from '~/utils/getUserRole';
import CreateStudioCard from './CreateStudioCard';

export default function StudioPanel() {
    const [authUser, setAuthUser] = createSignal<any>(null);
    const [role, setRole] = createSignal<string | null>(null);
    const [students, setStudents] = createSignal<User[]>([]);
    const [selectedStudents, setSelectedStudents] = createSignal<string[]>([]);
    const [classes, setClasses] = createSignal<Class[]>([]);
    const [showAddClass, setShowAddClass] = createSignal(false);

    const toggleAddClass = () => {
        const state = showAddClass(); // Default False

        setShowAddClass(!state);
    };

    // Function to fetch all classes
    const fetchClasses = async () => {
        if (!authUser()) return;

        const userRecord = await getUserRole();

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
        room,
        users!inner(name, teacher_initials)
      `
            )
            .order('created_at', { ascending: false });

        if (userRecord === 'teacher') query = query.eq('teacher_id', authUser().id);

        const { data: classData, error: classError } = await query;
        if (classError) return;

        const classesWithStudents = await Promise.all(
            (classData || []).map(async (cls: any) => {
                const { data: enrolled } = await supabase
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
                    room: cls.room,
                    teacher_initials: cls.teacher_initials,
                    teacher_name: cls.users?.name || 'Unknown',
                    enrolled_students: enrolledStudents,
                };
            })
        );

        setClasses(classesWithStudents);
    };

    // Fetch initial data
    onMount(async () => {
        const { data: authData, error: authError } = await supabase.auth.getUser();
        if (authError || !authData?.user) return;
        setAuthUser(authData.user);

        const userRecord = await getUserRole();
        setRole(userRecord || null);

        const { data: studentData, error: studentError } = await supabase
            .from('users')
            .select('*')
            .eq('role', 'student');
        if (!studentError) setStudents(studentData || []);

        await fetchClasses();
    });

    // Add selected students to a class
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

    const DeleteStudio = (props: { clsID: string, clsName: string }) => {
        return (
            <>
                <button
                    onClick={async () => {
                        if (!confirm(`Are you sure you want to delete "${props.clsName}"?`)) return;
                        const { error } = await supabase.from('classes').delete().eq('id', props.clsID);
                        if (!error) setClasses(classes().filter((c) => c.id !== props.clsID));
                    }}
                    class='bg-red-600 hover:bg-red-700 text-gray-100 px-4 py-2 rounded-lg transition'
                    id='delete-button'
                >
                    Delete Studio
                </button>
            </>
        );
    };

    // Remove a student from a class
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

    // Render classes
    const StudioCard = () => (
        <>
            <h2 class='text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100'>Studios</h2>
            <For each={classes()}>
                {(cls) => (
                    <div class='flex flex-col md:flex-row justify-between gap-4 rounded-2xl p-5 shadow-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 mb-4 transition' id='studio-card'>
                        {/* Left: Class Info */}
                        <div class='flex-1 flex flex-col'>
                            <h3 class='text-xl font-semibold text-gray-900 dark:text-gray-100'>
                                {cls.name} {cls.section && `(${cls.section})`} — Teacher:{' '}
                                {cls.teacher_name}
                            </h3>
                            <p class='text-gray-700 dark:text-gray-300 mt-1 flex justify-between w-1/2'>
                                <span>{cls.description}</span>
                                <span>{cls.room}</span>
                            </p>

                            <Show when={role() !== 'student'}>
                                <div class='flex gap-3 mt-3'>
                                    <button
                                        onClick={() => addStudentsToClass(cls.id)}
                                        class='bg-green-600 hover:bg-green-700 text-gray-100 px-4 py-2 rounded-lg transition'
                                    >
                                        Add Selected Students
                                    </button>

                                    <DeleteStudio clsID={cls.id} clsName={cls.name} />
                                </div>

                                <h4 class='mt-3 font-semibold text-gray-800 dark:text-gray-100'>
                                    Add Students
                                </h4>
                                <div class='flex flex-col max-h-48 overflow-y-auto border border-gray-200 dark:border-gray-700 p-2 rounded-lg mt-1'>
                                    <For each={students()}>
                                        {(student) => (
                                            <>
                                                <div class='flex flex-row gap-2'>
                                                    <button
                                                        class={`!px-1 !py-1 w-min leading-0 aspect-square rounded-lg border transition ${
                                                            selectedStudents().includes(student.id)
                                                                ? 'bg-green-600 text-white border-green-600'
                                                                : 'bg-blue-500 text-white hover:bg-blue-600'
                                                        }`}
                                                        onClick={() => {
                                                            if (
                                                                !selectedStudents().includes(
                                                                    student.id
                                                                )
                                                            ) {
                                                                setSelectedStudents([
                                                                    ...selectedStudents(),
                                                                    student.id,
                                                                ]);
                                                            }
                                                            addStudentsToClass(cls.id);
                                                        }}
                                                        disabled={selectedStudents().includes(
                                                            student.id
                                                        )}
                                                    >
                                                        <svg
                                                            xmlns='http://www.w3.org/2000/svg'
                                                            viewBox='0 -960 960 960'
                                                            fill='white'
                                                            class='w-6 h-6'
                                                        >
                                                            <path d='M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z' />
                                                        </svg>
                                                    </button>
                                                    <span class='flex items-center'>
                                                        {' '}
                                                        {student.name}{' '}
                                                    </span>
                                                </div>
                                                <hr class='border-gray-200 mb-4 mt-2' />
                                            </>
                                        )}
                                    </For>
                                </div>
                            </Show>
                        </div>

                        {/* Right: Enrolled Students */}
                        <div class='w-fit mt-4 md:mt-0 border-t md:border-t-0 md:border-l border-gray-200 dark:border-gray-700 pt-3 md:pt-0 md:pl-4'>
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
        <>
            <CreateStudioCard onClassCreated={fetchClasses} />
            <section class='mt-6'>
                <StudioCard />
            </section>
        </>
    );
}
