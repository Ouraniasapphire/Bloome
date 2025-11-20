import { createSignal, onMount, Show } from 'solid-js';
import getAuthUser from '~/utils/getAuthUser';
import { supabase } from '~/lib/supabaseClient';
import type { Class } from '~types/class';
import ImageUploader from '../ImageUploader';
import DummyStudioCard from './DummyStudioCard';
import fetchClasses from '~/utils/fetchClasses';
import { loadClassData } from '~/utils/loadClassData';
import { getUserData } from '~/utils/getUserData';
import { getUserRole } from '~/utils/getUserRole';

type CreateStudioCardProps = {
    onClassCreated?: () => void;
};

const CreateStudioCard = (props: CreateStudioCardProps) => {
    const [authUser, setAuthUser] = createSignal<any>(null);
    const [userName, setUserName] = createSignal('');
    const [teacherInitials, setTeacherInitials] = createSignal('');
    const [role, setRole] = createSignal<string | null>(null);
    const [classes, setClasses] = createSignal<Class[]>([]);
    const [form, setForm] = createSignal({
        name: '',
        section: '',
        description: '',
        heroUrl: '',
        room: '',
    });
    const [loading, setLoading] = createSignal(false);
    const [error, setError] = createSignal<string | null>(null);

    onMount(async () => {
        const user = await getAuthUser();
        setAuthUser(user);

        const userData = await getUserData();
        setUserName(userData?.name);
        setTeacherInitials(userData?.teacher_initials);

        const userRecord = await getUserRole();
        setRole(userRecord);

        fetchClasses();

        const data = await fetchClasses();
        setClasses(data || []);
    });

    const handleInput = (field: string, value: string) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const createClass = async () => {
        const user = authUser();
        if (!user) return;

        setLoading(true);
        setError(null);

        try {
            // 1️⃣ Create the class record
            const payload: any = {
                name: form().name,
                section: form().section,
                description: form().description,
                teacher_id: user.id,
                room: form().room,
                created_at: new Date().toISOString(),
            };

            if (form().heroUrl) payload.hero_url = form().heroUrl;

            const { data: newClass, error: classError } = await supabase
                .from('classes')
                .insert(payload)
                .select()
                .single();

            if (classError) throw classError;

            // 2️⃣ Upsert teacher into memberships table as a "teacher" role
            const { error: membershipError } = await supabase.from('memberships').upsert(
                {
                    class_id: newClass.id,
                    user_id: user.id,
                    role: 'teacher',
                    joined_at: new Date().toISOString(),
                },
                { onConflict: 'class_id,user_id' } // ensures idempotency
            );

            if (membershipError) throw membershipError;

            // 3️⃣ Add the new class to the local state
            setClasses((prev) => [
                ...prev,
                {
                    ...newClass,
                    teacher_name: user.user_metadata?.full_name || user.email,
                    enrolled_students: [],
                },
            ]);

            // 4️⃣ Reset form and trigger callback
            setForm({ name: '', section: '', description: '', heroUrl: '', room: '' });
            props.onClassCreated?.();
        } catch (err: any) {
            console.error('❌ Failed to create class:', err);
            setError('Failed to create studio. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Show when={role() === 'teacher' || role() === 'admin'}>
            <section class='mb-6 p-6 bg-white shadow-xl rounded-2xl border border-gray-200 dark:bg-gray-900 dark:border-gray-700 transition-all'>
                <h2 class='text-3xl font-extrabold mb-6 text-gray-800 dark:text-gray-100'>
                    Create New Studio
                </h2>

                <div class='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <input
                        type='text'
                        placeholder='Studio Name'
                        value={form().name}
                        onInput={(e) => handleInput('name', e.currentTarget.value)}
                        class='px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition dark:bg-gray-800 dark:text-gray-100'
                    />

                    <input
                        type='text'
                        placeholder='Semester / Section'
                        value={form().section}
                        onInput={(e) => handleInput('section', e.currentTarget.value)}
                        class='px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition dark:bg-gray-800 dark:text-gray-100'
                    />

                    <input
                        type='text'
                        placeholder='Description'
                        value={form().description}
                        onInput={(e) => handleInput('description', e.currentTarget.value)}
                        class='px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition dark:bg-gray-800 dark:text-gray-100 '
                    />

                    <input
                        type='text'
                        placeholder='Room'
                        value={form().room}
                        onInput={(e) => handleInput('room', e.currentTarget.value)}
                        class='px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition dark:bg-gray-800 dark:text-gray-100 '
                    />

                    <div class='flex items-center gap-4 md:col-span-2'>
                        <div class='w-1/2'>
                            <ImageUploader onUpload={(url) => handleInput('heroUrl', url)} />
                        </div>

                        <button
                            onClick={createClass}
                            disabled={loading()}
                            class='w-1/2 py-3 px-6 leading-none bg-blue-500 text-white rounded-lg shadow-xl hover:bg-blue-600 transition disabled:opacity-50'
                        >
                            {loading() ? 'Creating...' : 'Create Studio'}
                        </button>
                    </div>

                    <div class='md:col-span-2 w-full flex justify-center mt-6'>
                        <DummyStudioCard
                            heroURL={form().heroUrl}
                            name={form().name}
                            description={form().description}
                            teacher_name={userName()}
                            section={form().section}
                            room={form().room}
                            teacher_initials={teacherInitials()}
                        />
                    </div>

                    {error() && <p class='text-red-500 md:col-span-2'>{error()}</p>}
                </div>
            </section>
        </Show>
    );
};

export default CreateStudioCard;
