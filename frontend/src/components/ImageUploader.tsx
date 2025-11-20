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
        <div class='flex items-center w-full justify-center'>
            {/* Button */}
            <label class='px-6 py-3 leading-none flex text-xl shadow-xl items-center justify-center w-full bg-gray-600 hover:bg-gray-700 text-gray-100 cursor-pointer transition rounded-full'>
                <span class='truncate'>{fileName()}</span>
                <input type='file' accept='image/*' onChange={handleUpload} class='hidden' />
            </label>
        </div>
    );
}
