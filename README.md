# Pitch-Deck Analysis Agent

A platform for analyzing and providing feedback on pitch decks using AI.

## Prerequisites

- [Docker](https://www.docker.com/get-started) (required for Supabase local development)
- [Supabase CLI](https://supabase.com/docs/guides/cli/getting-started) 
- [pnpm](https://pnpm.io/installation)
- [jq](https://stedolan.github.io/jq/) (for JSON parsing in setup script)
- [Google AI Studio API Key](https://makersuite.google.com/app/apikey) (for Gemini AI)

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
   - Create a `.env.local` file with required environment variables
   - Create the required "pitch-decks" storage bucket

3. **Configure API Keys**:
   After running the setup script, you need to add your Gemini API key:
   - Open `.env.local` in the root directory
   - Find the line starting with `GEMINI_API_KEY=`
   - Add your Gemini API key after the equals sign
   - Save the file

4. **Verify setup**:
   - Supabase Studio should be available at http://localhost:54323
   - The database will include the vector extension for AI embeddings
   - A "pitch-decks" storage bucket will be configured for PDF uploads

## Development

After running the setup script, your local development environment is ready. The Supabase instance will include:
- PostgreSQL database with vector extensions enabled
- Storage bucket for pitch deck PDFs
- Authentication and API endpoints

The application consists of multiple services that need to be started in a specific order:

1. **Start the Summary Service**:
   ```bash
   cd apps/api/summary-service
   pnpm dev
   ```

2. **Start the Storage Service** (in a new terminal):
   ```bash
   cd apps/api/storage-service
   pnpm dev
   ```

3. **Start the Web Client** (in a new terminal):
   ```bash
   cd apps/web
   pnpm dev
   ```

The web application will be available at http://localhost:3000

### Managing Supabase

To stop the Supabase instance:
```bash
supabase stop
```

To restart it later:
```bash
supabase start
```
