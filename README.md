# Make My Event

Monorepo scaffold for the Make My Event web application.

## Workspaces

- `apps/web` — Next.js and TypeScript frontend
- `apps/api` — Express and TypeScript REST API
- `packages/shared` — small set of shared, non-sensitive application types
- `docs` — product, architecture, database, and API documentation

## Getting started

Install dependencies from the repository root with `npm install`. Then run either workspace with `npm run dev:web` or `npm run dev:api`.

See each app's README for its environment variables. The API currently exposes only a health check; product modules are scaffolded for later implementation.
