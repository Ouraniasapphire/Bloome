import { Component, createSignal, onMount, For, Show } from 'solid-js';
import { loadClassData } from '~/utils/loadClassData';
import type { ClassData } from '~/utils/loadClassData';
import CourseCard from '~/components/Studio/StudioCard';
import getAuthUser from '~/utils/getAuthUser';
import fetchMemberships from '~/utils/fetchMemberships';

const CourseView: Component = () => {
    const [classes, setClasses] = createSignal<ClassData[]>([]);
    const [loading, setLoading] = createSignal(true);
    const [authUserId, setAuthUserId] = createSignal<string | null>(null);

    onMount(async () => {
        // Get the current authenticated user
        const authData = await getAuthUser();
        if (!authData) {
            return;
        }

        const userId = authData?.id;
        setAuthUserId(userId);

        // Load all classes
        const result = await loadClassData();
        if (!result) {
            setLoading(false);
            return;
        }

        let userClasses = result.classes;

        // Fetch memberships based on the users
        const memberships = await fetchMemberships({ id: userId });

        const studentClassIds = memberships?.map((m) => m.class_id) || [];

        // ✅ Filter classes where user is either the teacher or a member
        userClasses = userClasses.filter(
            (cls) => cls.teacher_id === userId || studentClassIds.includes(cls.id)
        );

        setClasses(userClasses);
        setLoading(false);
    });

    return (
        <main class='min-h-screen w-full p-8 text-gray-800 dark:text-gray-100'>
            <h1 class='text-3xl font-bold mb-6'>My Courses</h1>

            <Show when={!loading()} fallback={<p class='text-gray-400'>Loading your courses...</p>}>
                <div class='flex flex-wrap gap-6'>
                    <For each={classes()}>
                        {(cls) => (
                            <CourseCard
                                id={cls.id}
                                name={cls.name}
                                description={cls.description}
                                hero_url={cls.hero_url}
                                section={cls.section}
                                teacher_id={cls.teacher_id}
                                teacher_name={cls.teacher_name}
                                room={cls.room}
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
