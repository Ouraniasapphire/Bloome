import { createSignal, onMount, Show } from 'solid-js';
import getAuthUser from '~/utils/getAuthUser';
import { supabase } from '~/lib/supabaseClient';
import type { Class } from '~types/class';
import ImageUploader from './ImageUploader';
import { getUserRole } from '~/utils/getUserRole';
import { uploadImage } from '~/lib/uploadImage';

const CreateStudioCard = () => {
    const [authUser, setAuthUser] = createSignal<any>(null);
    const [role, setRole] = createSignal<string | null>(null);
    const [className, setClassName] = createSignal('');
    const [section, setSection] = createSignal('');
    const [description, setDescription] = createSignal('');
    const [uploadURL, setUploadURL] = createSignal('');
    const [classes, setClasses] = createSignal<Class[]>([]);

    onMount(async () => {
        const auth = await getAuthUser();
        setAuthUser(auth);

        const userRecord = await getUserRole();
        setRole(userRecord?.role || null);

        fetchClasses();
    });

    const fetchClasses = async () => {
        const user = authUser();
        if (!user) return;

        const { data: classData, error: classError } = await supabase
            .from('classes')
            .select('id, name, section, description, hero_url, teacher_id, users!inner(name)')
            .order('created_at', { ascending: false });

        if (classError) {
            console.error(classError);
            return;
        }

        setClasses(classData || []);
    };

    const createClass = async () => {
        const user = authUser();
        if (!user) return;

        // Build payload
        const payload: any = {
            name: className(),
            section: section(),
            description: description(),
            teacher_id: user.id,
            created_at: new Date().toISOString(),
        };

        // Only add hero_url if user uploaded an image
        if (uploadURL()) {
            payload.hero_url = uploadURL();
        }

        const { data, error } = await supabase.from('classes').insert(payload).select().single();

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

        fetchClasses();

        setClassName('');
        setSection('');
        setDescription('');
        setUploadURL('');
    };

    return (
        <Show when={role() === 'teacher' || role() === 'admin'}>
            <section class='mb-6 p-6 bg-white shadow-md rounded-lg border border-gray-200 dark:bg-gray-900 dark:border-gray-700'>
                <h2 class='text-2xl font-bold mb-4 text-gray-800 dark:text-white'>
                    Create New Studio
                </h2>

                <div class='flex flex-col md:flex-row flex-wrap gap-4'>
                    <input
                        type='text'
                        placeholder='Studio Name'
                        value={className()}
                        onInput={(e) => setClassName(e.currentTarget.value)}
                        class='text-black flex-1 border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition dark:text-white'
                    />

                    <input
                        type='text'
                        placeholder='Semester / Section'
                        value={section()}
                        onInput={(e) => setSection(e.currentTarget.value)}
                        class='text-black flex-1 border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition dark:text-white'
                    />

                    <input
                        type='text'
                        placeholder='Description'
                        value={description()}
                        onInput={(e) => setDescription(e.currentTarget.value)}
                        class='text-black flex-1 border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition dark:text-white'
                    />

                    <hr class='border-gray-300 w-full' />

                    <div class='flex-1'>
                        <ImageUploader onUpload={setUploadURL} />
                    </div>

                    <hr class='border-gray-300 w-full' />

                    <button
                        onClick={createClass}
                        class='justify-center bg-blue-600 hover:bg-blue-700 text-white text-center font-semibold px-6 py-3 rounded-lg shadow-md transition transform hover:cursor-pointer'
                    >
                        Create Studio
                    </button>
                </div>
            </section>
        </Show>
    );
};

export default CreateStudioCard;
