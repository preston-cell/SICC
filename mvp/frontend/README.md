# Frontend

The frontend is built with **Next.js 16** (App Router) and **React 19**, using **Tailwind CSS 4** for styling and **Framer Motion** for animations.

## Where to find frontend code

| Directory | Contents |
|-----------|----------|
| [`../app/`](../app/) | Next.js App Router pages, layouts, and page-level components |
| [`../app/components/`](../app/components/) | UI component library (40+ components) |
| [`../components/`](../components/) | Shared components (intake navigation, progress indicators) |
| [`../public/`](../public/) | Static assets |

## Key pages

| Route | File | Purpose |
|-------|------|---------|
| `/` | `app/page.tsx` | Landing page |
| `/intake/*` | `app/intake/` | 5-step intake wizard + guided mode |
| `/analysis/[id]` | `app/analysis/` | Gap analysis results, preparation tools |
| `/documents/generate/[id]` | `app/documents/generate/` | Document generation |
| `/documents/upload/[id]` | `app/documents/upload/` | Document upload and AI review |

## Authentication

Clerk middleware (`middleware.ts`) protects intake, analysis, and document routes. The app gracefully degrades to anonymous session mode if Clerk is not configured.
