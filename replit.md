# Workspace

## Overview

ISKCON Purposes App — a mobile-first spiritual community app for ISKCON's 7 Purposes & Community Building. Members can browse the 7 purposes, read their descriptions, see admin-proposed activities, and share messages for each purpose.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)
- **Frontend**: React + Vite + Tailwind CSS
- **Fonts**: EB Garamond (serif), Nunito (sans)

## Graphic Charter

Warm parchment theme matching the Canva design:
- Background: warm cream parchment (`hsl(38 52% 86%)`)
- Foreground: dark maroon (`hsl(14 72% 16%)`)
- Primary accent: deep orange-saffron (`hsl(26 68% 42%)`)
- Fonts: EB Garamond serif + Nunito sans-serif
- Hero: `Slide1_1774929889490.png` (served from `public/slide-header.png`)

## The 7 Purposes

Organized as Roots (1–3) and Fruits (4–7):
1. Simple Living — Roots (green)
2. Community — Roots (blue)
3. Holy Place — Roots (stone)
4. Accessing — Fruits (amber)
5. Learning — Fruits (amber dark)
6. Applying — Fruits (orange)
7. Sharing — Fruits (red-brown)

## Structure

```text
artifacts-monorepo/
├── artifacts/
│   ├── api-server/         # Express API server
│   └── iskcon-app/         # React + Vite frontend (previewPath: /)
├── lib/
│   ├── api-spec/           # OpenAPI spec + Orval codegen config
│   ├── api-client-react/   # Generated React Query hooks
│   ├── api-zod/            # Generated Zod schemas from OpenAPI
│   └── db/                 # Drizzle ORM schema + DB connection
├── scripts/                # Utility scripts
├── pnpm-workspace.yaml
├── tsconfig.base.json
├── tsconfig.json
└── package.json
```

## Database Schema

Tables in `lib/db/src/schema/purposes.ts`:
- `purposes` — The 7 ISKCON purposes (id, number, title, shortDescription, fullDescription, icon)
- `activities` — Admin-proposed activities per purpose (id, purposeId, title, description, authorName, createdAt)
- `messages` — Member messages per purpose (id, purposeId, content, authorName, createdAt)

## API Routes

All routes under `/api/`:
- `GET /purposes` — List all 7 purposes
- `GET /purposes/:id` — Get a purpose
- `GET /purposes/:id/activities` — List activities for a purpose
- `POST /purposes/:id/activities` — Create an activity (admin)
- `DELETE /purposes/:id/activities/:actId` — Delete an activity
- `GET /purposes/:id/messages` — List messages for a purpose
- `POST /purposes/:id/messages` — Post a message (member)
- `DELETE /purposes/:id/messages/:msgId` — Delete a message

## Key Scripts

- `pnpm --filter @workspace/api-server run dev` — API server dev
- `pnpm --filter @workspace/iskcon-app run dev` — Frontend dev
- `pnpm --filter @workspace/db run push` — Push DB schema
- `pnpm --filter @workspace/api-spec run codegen` — Regenerate API hooks
