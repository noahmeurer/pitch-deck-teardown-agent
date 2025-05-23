#!/bin/bash

# Start Supabase
supabase start

# Create .env.local file in root directory
rm -f .env.local
touch .env.local

# Get Supabase credentials
supabase_url=$(supabase status --output json | jq -r '.API_URL')
supabase_anon_key=$(supabase status --output json | jq -r '.ANON_KEY')
supabase_service_role_key=$(supabase status --output json | jq -r '.SERVICE_ROLE_KEY')

# Write Supabase credentials to .env.local
echo "NEXT_PUBLIC_SUPABASE_URL=$supabase_url" >> .env.local
echo "NEXT_PUBLIC_SUPABASE_ANON_KEY=$supabase_anon_key" >> .env.local
echo "SUPABASE_SERVICE_ROLE_KEY=$supabase_service_role_key" >> .env.local

# Run setup.ts
cd scripts
pnpm dlx tsx setup.ts
