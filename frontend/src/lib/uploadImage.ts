import { supabase } from '~/lib/supabaseClient';

export async function uploadImage(file: File): Promise<string | null> {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `uploads/${fileName}`;

    const { error } = await supabase.storage
        .from('class-hero') // your bucket name
        .upload(filePath, file);

    if (error) {
        console.error('Upload failed:', error);
        return null;
    }

    const { data } = supabase.storage.from('class-hero').getPublicUrl(filePath);
    return data.publicUrl;
}
