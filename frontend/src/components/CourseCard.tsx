import { useNavigate } from '@solidjs/router';
import { Component, createSignal, onMount } from 'solid-js';
import { supabase } from '~/lib/supabaseClient';
import { Class } from '~/types/class';

const CourseCard: Component<Class> = (props) => {
    const [userID, setUserID] = createSignal<string | null>(null);
    const [enrolledClassIDs, setEnrolledClassIDs] = createSignal<string[]>([]);

    const navigate = useNavigate();

    onMount(async () => {
        // 1. Get authenticated user
        const { data: authData, error: authError } = await supabase.auth.getUser();
        if (authError || !authData.user) {
            console.error('Auth user error', authError);
            navigate('/');
            return;
        }

        const user = authData.user;
        setUserID(user.id);

        // 2. Fetch enrolled class IDs
        const { data: enrolledClasses, error: enrollError } = await supabase
            .from('memberships')
            .select('class_id')
            .eq('user_id', user.id);

        if (enrollError) {
            console.error('Failed to fetch enrolled classes', enrollError);
            return;
        }

        // Store as number array
        setEnrolledClassIDs(enrolledClasses?.map((c) => c.class_id) ?? []);
    });

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

    return (
        <div class='box-border flex h-80 w-fit gap-4 rounded-2xl bg-gray-900 p-5 shadow-lg border-2 border-transparent hover:border-gray-700'>
            {/* Color block */}
            <div class='aspect-square h-full rounded-xl bg-gradient-to-b from-blue-600 to-purple-600 shadow-inner'></div>

            <div class='flex flex-col justify-between w-full'>
                <div class='text-white flex flex-col h-full justify-between'>
                    <div>
                        <h1 class='text-2xl font-extrabold mb-1'>{props.name}</h1>
                        <p class='text-gray-300 mb-4'>{props.description}</p>
                        <hr class='border-gray-700 mb-4' />

                        <div class='flex items-center gap-3 mb-3'>
                            <div class='flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-yellow-300 to-pink-300 font-bold text-gray-900'>
                                {props.teacher_initials}
                            </div>
                            <p class='font-medium text-white'>{props.teacher_name}</p>
                        </div>

                        <p class='text-gray-300 font-medium mb-2'>{props.section}</p>
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
