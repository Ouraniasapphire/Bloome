import { useNavigate } from '@solidjs/router';
import { Component, createSignal, onMount, createEffect } from 'solid-js';
import { supabase } from '~/lib/supabaseClient';
import { Class } from '~/types/class';

const CourseCard: Component<Class> = (props) => {
    const [userID, setUserID] = createSignal<string | null>(null);
    const [enrolledClassIDs, setEnrolledClassIDs] = createSignal<string[]>([]);
    const navigate = useNavigate();

    // 1️⃣ Fetch user and enrolled classes on mount
    onMount(async () => {
        try {
            const { data: authData, error: authError } = await supabase.auth.getUser();
            if (authError || !authData.user) {
                console.error('Auth user error', authError);
                navigate('/');
                return;
            }

            const user = authData.user;
            setUserID(user.id);

            const { data: enrolledClasses, error: enrollError } = await supabase
                .from('memberships')
                .select('class_id')
                .eq('user_id', user.id);

            if (enrollError) {
                console.error('Failed to fetch enrolled classes', enrollError);
                return;
            }

            setEnrolledClassIDs(enrolledClasses?.map((c) => c.class_id) ?? []);
        } catch (err) {
            console.error('Unexpected error fetching user or memberships', err);
        }
    });

    // 2️⃣ Navigate to studio if enrolled
    const goToStudio = () => {
        const uid = userID();
        if (!uid) {
            alert('User not loaded yet!');
            return;
        }

        if (enrolledClassIDs().includes(props.id)) {
            navigate(`/${uid}/${props.id}/studio`);
        } else {
            alert('You are not enrolled in this class!');
        }
    };

    // 3️⃣ Reactive logging for hero_url
    createEffect(() => {
        console.log(props.teacher_name, props.teacher_initials);
    });

    // 4️⃣ Fallback hero URL
    const heroURL = props.hero_url?.trim() || '/default.png';

    return (
        <div class='box-border flex h-80 w-fit gap-4 rounded-2xl  p-5 shadow-md border-2 border-gray-200 bg-white dark:bg-gray-900 dark:border-gray-700'>
            {/* Color block */}
            <div class='aspect-square h-full rounded-xl'>
                <img src={heroURL} alt='Hero' class='w-full h-full object-cover rounded-xl' />
            </div>

            <div class='flex flex-col justify-between w-full'>
                <div class=' flex flex-col h-full justify-between'>
                    <div>
                        <h1 class='text-2xl font-extrabold mb-1 text-black dark:text-white'>
                            {props.name}
                        </h1>
                        <p class='text-black dark:text-white'>{props.description}</p>
                        <hr class='border-gray-700 mb-4' />

                        <div class='flex items-center gap-3 mb-3'>
                            <div class='flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-yellow-300 to-pink-300 font-bold text-gray-900'>
                                {props.teacher_initials || '??'}
                            </div>
                            <p class='font-medium text-black dark:text-white'>
                                {props.teacher_name || 'Unknown'}
                            </p>
                        </div>

                        <p class=' font-medium mb-2 text-black dark:text-white'>
                            {props.section || ''}
                        </p>
                        <hr class='border-gray-700' />
                    </div>

                    <div class='flex gap-3 mt-4'>
                        <button
                            class='flex-1 rounded-lg bg-gradient-to-b from-blue-600 to-purple-600 px-5 py-2 text-lg font-semibold text-white transition-colors hover:from-blue-700 hover:to-purple-700'
                            onClick={goToStudio}
                        >
                            View Studio
                        </button>
                        <button class='rounded-lg border-2 border-gray-600 px-5 py-2 text-lg font-semibold text-white hover:bg-gray-800'>
                            ⚙️
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseCard;
