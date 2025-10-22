import { createSignal, onMount, For, Show } from 'solid-js';
import { supabase } from '~/lib/supabaseClient';
import type { User } from '~/types/user';
import type { Class } from '~types/class'

export default function ClassPanel() {
    // Auth + role
    const [authUser, setAuthUser] = createSignal<any>(null);
    const [role, setRole] = createSignal<string | null>(null);

    // Form state
    const [className, setClassName] = createSignal('');
    const [section, setSection] = createSignal('');
    const [description, setDescription] = createSignal('');

    // Data
    const [students, setStudents] = createSignal<User[]>([]);
    const [selectedStudents, setSelectedStudents] = createSignal<string[]>([]);
    const [classes, setClasses] = createSignal<Class[]>([]);

    onMount(async () => {
        // 1️⃣ Get auth user
        const { data: authData, error: authError } = await supabase.auth.getUser();
        if (authError || !authData?.user) {
            console.error('No authenticated user:', authError);
            return;
        }
        const user = authData.user;
        setAuthUser(user);

        // 2️⃣ Get user role
        const { data: userRecord, error: userError } = await supabase
            .from('users')
            .select('role')
            .eq('id', user.id)
            .maybeSingle();

        if (userError) {
            console.error('Error fetching user role:', userError);
            return;
        }
        setRole(userRecord?.role || null);

        // 3️⃣ Fetch students
        const { data: studentData, error: studentError } = await supabase
            .from('users')
            .select('*')
            .eq('role', 'student');
        if (!studentError) setStudents(studentData || []);

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
                users!inner(name)
            `
            )
            .order('created_at', { ascending: false });

        if (userRecord?.role === 'teacher') {
            query = query.eq('teacher_id', user.id);
        }

        const { data: classData, error: classError } = await query;
        if (classError) {
            console.error('Error fetching classes:', classError);
            return;
        }

        // 5️⃣ For each class, fetch enrolled students
        const classesWithStudents = await Promise.all(
            (classData || []).map(async (cls: any) => {
                const { data: enrolled, error: enrollError } = await supabase
                    .from('memberships')
                    .select('users(id, name, email)')
                    .eq('class_id', cls.id)
                    .eq('role', 'student');

                if (enrollError) {
                    console.error('Error fetching enrolled students:', enrollError);
                    return {
                        ...cls,
                        teacher_name: cls.users?.name || 'Unknown',
                        enrolled_students: [],
                    };
                }

                const enrolledStudents = enrolled?.map((m: any) => m.users).filter(Boolean) || [];

                return {
                    id: cls.id,
                    name: cls.name,
                    section: cls.section,
                    description: cls.description,
                    teacher_id: cls.teacher_id,
                    teacher_name: cls.users?.name || 'Unknown',
                    enrolled_students: enrolledStudents,
                };
            })
        );

        setClasses(classesWithStudents);
    });

    // 🏫 Create class
    const createClass = async () => {
        const user = authUser();
        if (!user) return;

        const { data, error } = await supabase
            .from('classes')
            .insert({
                name: className(),
                section: section(),
                description: description(),
                teacher_id: user.id,
                created_at: new Date().toISOString(),
            })
            .select()
            .single();

        if (error) {
            console.error(error);
            return;
        }

        setClasses([
            ...classes(),
            {
                ...data,
                teacher_name: user.user_metadata?.full_name || user.email,
                enrolled_students: [],
            },
        ]);
        setClassName('');
        setSection('');
        setDescription('');
    };

    // ➕ Add students to a class
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
            // Refresh enrolled students for that class
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

    // ❌ Unenroll a student from a class
    const removeStudentFromClass = async (classId: string, userId: string) => {
        if (!confirm('Are you sure you want to unenroll this student?')) return;

        const { error } = await supabase
            .from('memberships')
            .delete()
            .eq('class_id', classId)
            .eq('user_id', userId)
            .eq('role', 'student');

        if (error) {
            console.error('Error unenrolling student:', error);
            return;
        }

        // Update UI
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

    return (
        <main class='p-6'>
            <h1 class='text-2xl font-bold mb-4'>
                {role() === 'admin' ? 'Admin Panel' : 'Teacher Panel'}
            </h1>

            <Show when={role() === 'teacher' || role() === 'admin'}>
                <section class='mb-6'>
                    <h2 class='text-xl font-semibold'>Create New Class</h2>
                    <div class='flex flex-wrap gap-2'>
                        <input
                            type='text'
                            placeholder='Class Name'
                            value={className()}
                            onInput={(e) => setClassName(e.currentTarget.value)}
                            class='border p-2 rounded flex-1'
                        />
                        <input
                            type='text'
                            placeholder='Section'
                            value={section()}
                            onInput={(e) => setSection(e.currentTarget.value)}
                            class='border p-2 rounded flex-1'
                        />
                        <input
                            type='text'
                            placeholder='Description'
                            value={description()}
                            onInput={(e) => setDescription(e.currentTarget.value)}
                            class='border p-2 rounded flex-1'
                        />
                        <button
                            onClick={createClass}
                            class='bg-blue-600 text-white px-4 py-2 rounded'
                        >
                            Create Class
                        </button>
                    </div>
                </section>
            </Show>

            <section>
                <h2 class='text-xl font-semibold mb-2'>Classes</h2>
                <For each={classes()}>
                    {(cls) => (
                        <div class='border p-4 rounded mb-4 flex justify-between gap-6'>
                            {/* Left: Class info and student adding */}
                            <div class='flex-1'>
                                <h3 class='font-bold'>
                                    {cls.name} {cls.section && `(${cls.section})`} — Teacher:{' '}
                                    {cls.teacher_name}
                                </h3>
                                <p>{cls.description}</p>

                                <Show when={role() !== 'student'}>
                                    <div class='flex gap-4 mt-2'>
                                        <button
                                            onClick={() => addStudentsToClass(cls.id)}
                                            class='bg-green-600 text-white px-4 py-2 rounded'
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
                                                if (error) console.error(error);
                                                else
                                                    setClasses(
                                                        classes().filter((c) => c.id !== cls.id)
                                                    );
                                            }}
                                            class='bg-red-600 text-white px-4 py-2 rounded'
                                        >
                                            Delete Class
                                        </button>
                                    </div>

                                    <h4 class='mt-2 font-semibold'>Add Students</h4>
                                    <div class='flex flex-col max-h-48 overflow-y-auto mb-2'>
                                        <For each={students()}>
                                            {(student) => (
                                                <label class='flex items-center gap-2'>
                                                    <input
                                                        type='checkbox'
                                                        checked={selectedStudents().includes(
                                                            student.id
                                                        )}
                                                        onInput={() => toggleStudent(student.id)}
                                                    />
                                                    {student.name} ({student.email})
                                                </label>
                                            )}
                                        </For>
                                    </div>
                                </Show>
                            </div>

                            {/* Right: Enrolled students */}
                            <div class='w-64 border-l pl-4'>
                                <h4 class='font-semibold mb-2'>Enrolled Students</h4>
                                <Show
                                    when={cls.enrolled_students?.length}
                                    fallback={
                                        <p class='text-gray-500 text-sm'>No students enrolled</p>
                                    }
                                >
                                    <ul class='max-h-48 overflow-y-auto text-sm'>
                                        <For each={cls.enrolled_students}>
                                            {(student) => (
                                                <li class='border-b py-1 flex justify-between items-center'>
                                                    <div>
                                                        <span class='font-medium'>
                                                            {student.name}
                                                        </span>
                                                        <br />
                                                        <span class='text-gray-600 text-xs'>
                                                            {student.email}
                                                        </span>
                                                    </div>
                                                    <button
                                                        class='text-red-600 text-xs ml-2 hover:underline'
                                                        onClick={() =>
                                                            removeStudentFromClass(
                                                                cls.id,
                                                                student.id
                                                            )
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
            </section>
        </main>
    );
}
