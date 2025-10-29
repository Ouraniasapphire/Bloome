import { createSignal } from 'solid-js';
import { uploadImage } from '~/lib/uploadImage';

interface Props {
    onUpload: (url: string) => void;
}

export default function ImageUploader(props: Props) {
    const [preview, setPreview] = createSignal<string>('');
    const [fileName, setFileName] = createSignal('No file chosen');

    async function handleUpload(e: Event) {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (!file) {
            setFileName('No file chosen');
            setPreview('');
            return;
        }

        setFileName(file.name);

        const url = await uploadImage(file);
        if (url) {
            setPreview(url);
            props.onUpload(url);
        }
    }

    return (
        <div class='flex items-center gap-4 w-full md:w-auto'>
            {/* Button */}
            <label class='inline-flex items-center bg-gray-600 hover:bg-gray-700 text-white cursor-pointer transition font-semibold px-6 py-3 rounded-lg'>
                <span class='truncate max-w-xs'>{fileName()}</span>
                <input type='file' accept='image/*' onChange={handleUpload} class='hidden' />
            </label>

            {/* Preview */}
            {preview() && (
                <div class='w-24 h-24 rounded-lg overflow-hidden border border-gray-300 shadow-sm flex-shrink-0'>
                    <img
                        src={preview()}
                        alt='Preview'
                        class='w-full h-full object-cover transition-transform hover:scale-105'
                    />
                </div>
            )}
        </div>
    );
}
