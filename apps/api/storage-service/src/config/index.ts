import { config } from 'dotenv';
import { join } from 'path';

// Load environment variables from .env.local in the root directory
config({ path: join(__dirname, '..', '..', '..', '..', '..', '.env.local') });

// Validate required environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    throw new Error('Required environment variables are not set. Please check NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
}

export default {
    port: process.env.PORT || 3001,
    supabaseUrl,
    supabaseKey,
}