export const config = {
    frontendPort: process.env.NEXT_PUBLIC_FRONTEND_PORT || 3000,
    backendPort: process.env.NEXT_PUBLIC_BACKEND_PORT || 3001,
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
    supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    // Derive the backend URL from the port
    backendUrl: `http://localhost:${process.env.NEXT_PUBLIC_BACKEND_PORT}/api`,
} as const;

export type Config = typeof config;