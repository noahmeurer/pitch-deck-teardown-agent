import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';
import config from '../config';


// Create a Supabase client with the service role key
export const supabase = createClient(config.supabaseUrl, config.supabaseKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false,
    },
});

export async function uploadToSupabase(file: Express.Multer.File) {
    return supabase
        .storage
        .from('pitch-decks')
        .upload(
            `files/${file.originalname}`,
            file.buffer,
            {
                contentType: file.mimetype,
                upsert: true,
            }
        )
}

// Generates a unique file name
export const generateUniqueFileName = (originalName: string) => {
    const randomString = uuidv4();
    const nameWithoutExtension = originalName.substring(0, originalName.lastIndexOf('.'));
    const extension = originalName.split('.').pop()?.toLowerCase();
    return `${randomString}-${nameWithoutExtension}.${extension}`;
}