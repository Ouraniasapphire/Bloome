import { useNavigate } from '@solidjs/router';
import { Component, createSignal, onMount, createEffect } from 'solid-js';
import { supabase } from '~/lib/supabaseClient';
import { Class } from '~/types/class';
import getAuthUser from '~/utils/getAuthUser';
import ProfileContext from '~/context/ProfileContext';

type CourseCardProps = Class & {colorID: number};

const CourseCard: Component<CourseCardProps> = (props) => {
    const [userID, setUserID] = createSignal<string | null>(null);
    const [enrolledClassIDs, setEnrolledClassIDs] = createSignal<string[]>([]);
    const navigate = useNavigate();

    onMount(async () => {
        try {
            const authUser = await getAuthUser();
            if (!authUser) {
                navigate('/');
                return;
            }
            const user = authUser.user_metadata;
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

    const heroURL = props.hero_url?.trim();

    return (
        <div class='box-border flex h-80 w-fit gap-4 rounded-2xl  p-5 shadow-xl border-2 border-gray-200 bg-white dark:bg-gray-900 dark:border-gray-700'>
            {/* Color block */}
            <div class='aspect-square h-full rounded-xl'>
                <img src={heroURL} alt='Hero' class='w-full h-full object-cover rounded-xl' />
            </div>

            <div class='flex flex-col justify-between w-full'>
                <div class=' flex flex-col h-full justify-between'>
                    <div>
                        <h1 class='text-2xl font-extrabold mb-1 text-gray-800 dark:text-gray-100'>
                            {props.name}
                        </h1>
                        <p class='text-gray-800 dark:text-gray-100'>{props.description}</p>
                        <hr class='border-gray-700 mb-4' />

                        <div class='flex items-center gap-3 mb-3'>
                            
                                <ProfileContext colorID={props.colorID || 1}>
                                    {props.teacher_initials || '??'}
                                </ProfileContext>
                            

                            <p class='font-medium text-gray-800 dark:text-gray-100'>
                                {props.teacher_name || 'Unknown'}
                            </p>
                        </div>

                        <div class='mt-1 flex justify-between w-full'>
                            <span class='font-medium text-gray-800 dark:text-gray-100'>
                                {props.section || ''}
                            </span>
                            <span class='font-medium text-gray-800 dark:text-gray-100'>
                                {props.room || ''}
                            </span>
                        </div>

                        <hr class='border-gray-700' />
                    </div>

                    <div class='flex gap-3 mt-4'>
                        <button
                            class='flex-1 rounded-lg bg-gradient-to-b from-blue-600 to-purple-600 px-5 py-2 text-lg font-semibold text-gray-100 transition-colors hover:from-blue-700 hover:to-purple-700'
                            onClick={goToStudio}
                        >
                            View Studio
                        </button>
                        <button class='rounded-lg border-2 border-gray-200 px-5 py-2 text-lg font-semibold text-gray-100 hover:bg-gray-800'>
                            ⚙️
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseCard;
