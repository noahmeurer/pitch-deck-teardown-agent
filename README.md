# Pitch-Deck Analysis Agent

A platform for analyzing and providing feedback on pitch decks using AI.

## Prerequisites

- [Docker](https://www.docker.com/get-started) (required for Supabase local development)
- [Supabase CLI](https://supabase.com/docs/guides/cli/getting-started) 
- [pnpm](https://pnpm.io/installation)
- [jq](https://stedolan.github.io/jq/) (for JSON parsing in setup script)

## Setup (macOS)

1. **Install dependencies**:
   ```bash
   # Install pnpm
   npm install -g pnpm
   
   # Install Supabase CLI
   brew install supabase/tap/supabase
   
   # Install jq (if not already installed)
   brew install jq
   
   # Install project dependencies
   pnpm install
   ```

2. **Run the setup script**:
   ```bash
   bash scripts/setup.sh
   ```
   
   This script will:
   - Start the local Supabase instance
   - Create a `.env.local` file with Supabase credentials
   - Create the required "pitch-decks" storage bucket

3. **Verify setup**:
   - Supabase Studio should be available at http://localhost:54323
   - The database will include the vector extension for AI embeddings
   - A "pitch-decks" storage bucket will be configured for PDF uploads

## Development

After running the setup script, your local development environment is ready. The Supabase instance will include:
- PostgreSQL database with vector extensions enabled
- Storage bucket for pitch deck PDFs
- Authentication and API endpoints

To stop the Supabase instance:
```bash
supabase stop
```

To restart it later:
```bash
supabase start
```
