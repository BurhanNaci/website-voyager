# Environment Setup for Voyager Manager Portal

## Required Environment Variables

Create a `.env.local` file in the root directory with the following configuration:

```bash
# Voyager Backend API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8080

# Optional: For development debugging
NEXT_PUBLIC_DEBUG_API=true
```

## Backend Requirements

Make sure the Voyager backend is running on `http://localhost:8080` with the following configuration:

- LLM agents enabled: `ENABLE_LLM_AGENTS=true`
- Provider: `LLM_PROVIDER=openai` (or `anthropic`)
- API key: `OPENAI_API_KEY` or `ANTHROPIC_API_KEY`
- SMS copy LLM: `ENABLE_LLM_SMS=true`

## API Documentation

- Swagger UI: http://localhost:8080/docs
- Backend Integration Guide: See `Backend Integration Guide.md`

## Quick Start

1. Create `.env.local` file with the API URL
2. Start the backend server on port 8080
3. Run `npm run dev` to start the frontend
4. The frontend will automatically connect to the backend API

## Available API Functions

The API client is available in `src/lib/api-client.ts` with the following modules:

- `voyagerApi.recommendations` - User and segment recommendations
- `voyagerApi.notifications` - Campaign management and approvals
- `voyagerApi.system` - Health checks and statistics

Example usage:
```typescript
import { voyagerApi } from '@/lib/api-client';

// Get user options
const options = await voyagerApi.recommendations.fetchUserOptions(295);

// Get pending approvals
const approvals = await voyagerApi.notifications.fetchPendingApprovals();
```
