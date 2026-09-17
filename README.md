# Gym Track

A mobile-first workout tracker built with Next.js, PostgreSQL, Drizzle, and shadcn/ui. It supports private username/password accounts, append-only body measurements with BMI trends, daily steps and activity calories, grouped strength/bodyweight/cardio sessions, workout-specific progress charts, and user-scoped workout CSV exports.

The workout planner starts with Strength or Cardio. Strength sessions can combine back, legs, shoulders, biceps, triceps, and chest. Each selected zone recalls exercises and values from its most recent prior session; the user checks completed work, edits actual results, and saves every checked exercise in one transaction. With no history, exercises are added directly under a selected zone rather than sourced from a canonical library. Existing pre-session workout rows remain readable as legacy entries.

## Stack

- Next.js 16 App Router and React 19
- PostgreSQL with Drizzle ORM
- Signed HTTP-only sessions with `jose`; passwords hashed with `bcryptjs`
- shadcn/ui Base components, Tailwind CSS v4, and Recharts
- Installable PWA manifest, offline fallback, and static-asset service worker
- Vercel-compatible server actions and route handlers

## Local setup

Requires Node.js 20.9 or newer and PostgreSQL 16+.

1. Install dependencies:

	```powershell
	npm install
	```

2. Start the included local PostgreSQL service, or use any managed PostgreSQL database:

	```powershell
	docker compose up -d
	```

3. Create `.env.local` from `.env.example`. For the included database, use:

	```dotenv
	DATABASE_URL="postgresql://postgres:postgres@localhost:5432/workout_tracker"
	AUTH_SECRET="replace-with-at-least-32-random-characters"
	```

	Generate a secure secret with:

	```powershell
	node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
	```

4. Start the app:

	```powershell
	npm run dev
	```

Open `http://localhost:3000`. Register a user, then enter age, height, and weight to create the first BMI point.

## Database commands

```powershell
npm run db:generate  # generate SQL after schema changes
npm run db:migrate   # apply committed migrations
npm run db:push      # push schema directly during local prototyping
npm run db:push:ci   # non-interactive schema push used only by CI
```

## Automatic schema sync

The `Sync database schema` GitHub Actions workflow runs whenever the Drizzle schema or its configuration changes on `main`. It validates the TypeScript schema and pushes it directly to PostgreSQL, so deployed schema changes do not require a manual migration command.

Create a GitHub environment named `production`, then add its `DATABASE_URL` secret using the production PostgreSQL connection string. The workflow is serialized so two schema updates cannot run against the database concurrently. It can also be started manually from the Actions tab.

The CI command uses Drizzle's `--force` option to stay non-interactive. Review schema changes before merging because destructive changes can drop or truncate production data.

## Vercel deployment

1. Create a pooled PostgreSQL database through Neon, Supabase, Vercel Marketplace, or another PostgreSQL provider.
2. Add `DATABASE_URL` and a 32+ character `AUTH_SECRET` to the Vercel project for Production, Preview, and Development as appropriate.
3. Add the production `DATABASE_URL` to the GitHub `production` environment for automatic schema synchronization.
4. Import the repository into Vercel. The default framework and build settings are sufficient. Schema changes merged to `main` are pushed by GitHub Actions.

The database client is created lazily, so `next build` does not need a live database connection. Use a pooled connection string for serverless production traffic.

## PWA behavior

The production build registers `/sw.js` over HTTPS. The worker caches only static assets and the offline page. Authenticated pages and `/api/*` responses are always fetched from the network and are never placed in the service-worker cache.

## Validation

```powershell
npm run lint
npm run typecheck
npm run build
```
