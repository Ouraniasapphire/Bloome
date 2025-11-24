import ProfileContext from '~/context/ProfileContext';

type Props = {
    heroURL: any;
    name: any;
    description: any;
    teacher_name: any;
    room: any;
    section: any;
    teacher_initials: any;
    colorID: number;
};

const DummyStudioCardtemp = (props: Props) => {
    return (
        <div class='box-border flex h-80 w-fit gap-4 rounded-2xl  p-5  border-2 border-gray-200 bg-white dark:bg-gray-900 dark:border-gray-700'>
            {/* Color block */}
            <div class='aspect-square h-full rounded-xl'>
                <img
                    src={
                        props.heroURL ||
                        'https://ksilnlvowovhdaevcdfh.supabase.co/storage/v1/object/public/class-hero/Placeholder-image.png'
                    }
                    alt='Hero'
                    class='w-full h-full object-cover rounded-xl'
                />
            </div>

            <div class='flex flex-col justify-between w-full'>
                <div class=' flex flex-col h-full justify-between'>
                    <div>
                        <h1 class='text-2xl font-extrabold mb-1 text-gray-800 dark:text-gray-100'>
                            {props.name || 'Title'}
                        </h1>
                        <p class='text-gray-800 dark:text-gray-100'>
                            {props.description || 'Description'}
                        </p>
                        <hr class='border-gray-700 mb-4' />

                        <div class='flex items-center gap-3 mb-3'>
                            <ProfileContext colorID={props.colorID || 1}>
                                {props.teacher_initials || '??'}
                            </ProfileContext>
                            <p class='font-medium text-gray-800 dark:text-gray-100'>
                                {props.teacher_name || 'Name'}
                            </p>
                        </div>

                        <div class='mt-1 flex justify-between w-full'>
                            <span class='font-medium text-gray-800 dark:text-gray-100'>
                                {props.section || 'Semester / Section'}
                            </span>
                            <span class='font-medium text-gray-800 dark:text-gray-100'>
                                {props.room || 'Room'}
                            </span>
                        </div>

                        <hr class='border-gray-700' />
                    </div>

                    <div class='flex gap-3 mt-4'>
                        <button class='flex-1 rounded-lg bg-gradient-to-b from-blue-600 to-purple-600 px-5 py-2 text-lg font-semibold text-gray-100 transition-colors hover:from-blue-700 hover:to-purple-700'>
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

const DummyStudioCard = (props: Props) => {
    return (
        <div class="flex flex-col md:flex-row gap-4 rounded-2xl p-4 border-2 border-gray-200 bg-white dark:bg-gray-900 dark:border-gray-700 w-full max-w-md md:max-w-3xl mx-auto transition-all duration-300">
            {/* Hero image */}
            <div class="w-full md:w-48 aspect-square rounded-xl overflow-hidden">
                <img
                    src={
                        props.heroURL ||
                        "https://ksilnlvowovhdaevcdfh.supabase.co/storage/v1/object/public/class-hero/Placeholder-image.png"
                    }
                    alt="Hero"
                    class="w-full h-full object-cover"
                />
            </div>

            {/* Card content */}
            <div class="flex flex-col justify-between flex-1">
                <div>
                    <h1 class="text-xl md:text-2xl font-extrabold mb-1 text-gray-800 dark:text-gray-100 transition-all duration-300">
                        {props.name || "Title"}
                    </h1>
                    <p class="text-gray-700 dark:text-gray-300 transition-all duration-300">{props.description || "Description"}</p>
                    <hr class="border-gray-300 dark:border-gray-700 my-3" />

                    <div class="flex items-center gap-3 mb-3">
                        <ProfileContext colorID={props.colorID || 1}>
                            {props.teacher_initials || "??"}
                        </ProfileContext>
                        <p class="font-medium text-gray-800 dark:text-gray-100 transition-all duration-300">
                            {props.teacher_name || "Name"}
                        </p>
                    </div>

                    <div class="flex justify-between mb-2">
                        <span class="font-medium text-gray-800 dark:text-gray-100 transition-all duration-300">
                            {props.section || "Semester / Section"}
                        </span>
                        <span class="font-medium text-gray-800 dark:text-gray-100 transition-all duration-300">
                            {props.room || "Room"}
                        </span>
                    </div>
                    <hr class="border-gray-300 dark:border-gray-700" />
                </div>

                <div class="flex flex-col sm:flex-row gap-2 mt-4 transition-all duration-300">
                    <button class="flex-1 rounded-lg bg-gradient-to-b from-blue-600 to-purple-600 px-4 py-2 text-lg font-semibold text-gray-100 transition-all duration-300 hover:from-blue-700 hover:to-purple-700">
                        View Studio
                    </button>
                    <button class="rounded-lg border-2 border-gray-200 px-4 py-2 text-lg font-semibold text-gray-800 dark:text-gray-100 transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-800">
                        ⚙️
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DummyStudioCard;
