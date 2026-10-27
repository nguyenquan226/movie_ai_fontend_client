# ChillFlix Frontend

Next.js App Router frontend for ChillFlix.

## Local development

Use Node.js 20 and npm:

```bash
npm ci
cp .env.example .env.local
npm run dev
```

Set the API and Socket.IO URLs in `.env.local` to the corresponding backend services.

## Quality checks

```bash
npm run lint
npm run typecheck
npm audit --audit-level=high
npm run build
```

GitHub Actions runs these checks for pull requests and pushes to `master`. The workflow also builds a Vercel preview for same-repository pull requests and deploys production after a successful push to `master`.

## Vercel deployment setup

Create or link the ChillFlix project in Vercel, then add these GitHub repository secrets:

- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

Configure these environment variables in the Vercel project for both Preview and Production:

- `NEXT_PUBLIC_API_BACKEND_URL`
- `NEXT_PUBLIC_SOCKET_BACKEND_URL`
- `NEXT_PUBLIC_CHAT_SOCKET`
- `NEXT_PUBLIC_APP_URL`

The `NEXT_PUBLIC_*` values are embedded in the browser bundle during build, so set them in Vercel before the first deployment. Do not put credentials or private backend secrets in these variables.

After pushing the repository to GitHub, protect `master` and require the `quality` job to pass before merging. Preview deployments are skipped for pull requests from forks because GitHub does not expose repository secrets to those workflows.
