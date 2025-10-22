import { Component, createSignal, onMount, For, Show } from 'solid-js';
import { loadClassData } from '~/utils/loadClassData';
import type { ClassData } from '~/utils/loadClassData';
import CourseCard from '~/components/CourseCard';
import { supabase } from '~/lib/supabaseClient';

const CourseView: Component = () => {
    const [classes, setClasses] = createSignal<ClassData[]>([]);
    const [loading, setLoading] = createSignal(true);
    const [authUserId, setAuthUserId] = createSignal<string | null>(null);

    onMount(async () => {
        // ✅ Get the current authenticated user
        const { data: authData, error } = await supabase.auth.getUser();
        if (error || !authData?.user) {
            console.error('No authenticated user:', error);
            setLoading(false);
            return;
        }

        const userId = authData.user.id;
        setAuthUserId(userId);

        // ✅ Load all classes
        const result = await loadClassData();
        if (!result) {
            setLoading(false);
            return;
        }

        let userClasses = result.classes;

        // ✅ Fetch class IDs where the user is a student
        const { data: memberships, error: membershipError } = await supabase
            .from('memberships')
            .select('class_id')
            .eq('user_id', userId);

        if (membershipError) {
            console.error('Error fetching memberships:', membershipError);
        }

        const studentClassIds = memberships?.map((m) => m.class_id) || [];

        // ✅ Filter classes where user is either the teacher or a member
        userClasses = userClasses.filter(
            (cls) => cls.teacher_id === userId || studentClassIds.includes(cls.id)
        );

        setClasses(userClasses);
        setLoading(false);
    });

    return (
        <main class='min-h-screen bg-gray-950 p-8 text-white'>
            <h1 class='text-3xl font-bold mb-6'>My Courses</h1>

            <Show when={!loading()} fallback={<p class='text-gray-400'>Loading your courses...</p>}>
                <div class='flex flex-wrap gap-6'>
                    <For each={classes()}>
                        {(cls) => (
                            <CourseCard
                                id={cls.id}
                                name={cls.name}
                                description={cls.description}
                                section={cls.section}
                                teacher_id={cls.teacher_id}
                                teacher_name={cls.teacher_name}
                                teacher_initials={cls.teacher_initials}
                            />
                        )}
                    </For>

                    <Show when={classes().length === 0}>
                        <p class='text-gray-400'>You’re not enrolled in any courses yet.</p>
                    </Show>
                </div>
            </Show>
        </main>
    );
};

export default CourseView;
