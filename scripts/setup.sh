#!/bin/bash

# Start Supabase
supabase start

# Create .env.local file in root directory
rm -f .env.local
touch .env.local

# Create .env.local file in apps/web directory
rm -f apps/web/.env.local
touch apps/web/.env.local

# Get Supabase credentials
supabase_url=$(supabase status --output json | jq -r '.API_URL')
supabase_anon_key=$(supabase status --output json | jq -r '.ANON_KEY')
supabase_service_role_key=$(supabase status --output json | jq -r '.SERVICE_ROLE_KEY')

# Write Supabase credentials to root .env.local
echo "NEXT_PUBLIC_SUPABASE_URL=$supabase_url" >> .env.local
echo "NEXT_PUBLIC_SUPABASE_ANON_KEY=$supabase_anon_key" >> .env.local
echo "SUPABASE_SERVICE_ROLE_KEY=$supabase_service_role_key" >> .env.local

# Add port configurations to root .env.local
echo "NEXT_PUBLIC_FRONTEND_PORT=3000" >> .env.local
echo "NEXT_PUBLIC_BACKEND_PORT=3001" >> .env.local

# Write the same environment variables to apps/web/.env.local
echo "NEXT_PUBLIC_SUPABASE_URL=$supabase_url" >> apps/web/.env.local
echo "NEXT_PUBLIC_SUPABASE_ANON_KEY=$supabase_anon_key" >> apps/web/.env.local
echo "NEXT_PUBLIC_FRONTEND_PORT=3000" >> apps/web/.env.local
echo "NEXT_PUBLIC_BACKEND_PORT=3001" >> apps/web/.env.local

# Run setup.ts
cd scripts
pnpm dlx tsx setup.ts
