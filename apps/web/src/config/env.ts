export const config = {
    frontendPort: process.env.NEXT_PUBLIC_FRONTEND_PORT || 3000,
    storageServicePort: process.env.NEXT_PUBLIC_STORAGE_SERVICE_PORT || 3001,
    ragServicePort: process.env.NEXT_PUBLIC_RAG_SERVICE_PORT || 3002,
    summaryServicePort: process.env.NEXT_PUBLIC_SUMMARY_SERVICE_PORT || 3003,
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
    supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    // Service URLs
    storageServiceUrl: `http://localhost:${process.env.NEXT_PUBLIC_STORAGE_SERVICE_PORT || 3001}/api`,
    ragServiceUrl: `http://localhost:${process.env.NEXT_PUBLIC_RAG_SERVICE_PORT || 3002}/api`,
    summaryServiceUrl: `http://localhost:${process.env.NEXT_PUBLIC_SUMMARY_SERVICE_PORT || 3003}/api`,
} as const;

export type Config = typeof config;