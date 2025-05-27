import { createClient } from "@supabase/supabase-js";
import { config } from 'dotenv';
import { join } from 'path';

// Load .env.local from the root directory
config({ path: join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Server-side Supabase client with admin permissions
const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false,
    },
});
console.log('Supabase client created');

// Creates a new bucket called "pitch-decks"
async function createBucket() {
    console.log('Creating pitch-decks bucket...');
    
    const { data, error } = await supabase.storage.createBucket('pitch-decks', {
        public: true,
        allowedMimeTypes: ['application/pdf'],
        fileSizeLimit: 15 * 1024 * 1024, // 15MB
    });

    if (error) {
        if (error.message.includes('already exists')) {
            console.log('✅ Bucket "pitch-decks" already exists')
            return;
        } else {
            console.error("❌ Unexpected error creating bucket:", error);
            process.exit(1);
        }
    }

    console.log(`✅ Bucket created: ${data.name}`);
}

createBucket();