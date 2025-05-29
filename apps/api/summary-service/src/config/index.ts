import { config } from 'dotenv';
import { join } from 'path';

// Load environment variables from .env.local in the root directory
config({ path: join(__dirname, '..', '..', '..', '..', '..', '.env.local') });

// Validate required environment variables
const geminiApiKey = process.env.GEMINI_API_KEY;

if (!geminiApiKey) {
    throw new Error('Required environment variables are not set. Please check GEMINI_API_KEY');
}

export default {
    port: process.env.NEXT_PUBLIC_SUMMARY_SERVICE_PORT || 3003,
    geminiApiKey,
}