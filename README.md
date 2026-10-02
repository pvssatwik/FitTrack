# Fitness Leaderboard

Web app where users upload fitness tracker exports (or later connect their tracker). It turns them into
organised reports with interactive charts, and adds leaderboards, user comparison and points-based
gamification. Phase 1 trackers: **Google Fitbit Air (Google Health)** and **Ultrahuman Ring**.

Full planning notes: [docs/planning-summary.md](docs/planning-summary.md). Pipeline overview: [docs/architecture.md](docs/architecture.md).

## Stack
React (Vite) · Node.js (Express, TypeScript) · PostgreSQL · pg-boss job queue (in Postgres) · Railway hosting (plain Docker, kept portable).

## Layout
```
apps/
  web/        React frontend: login, upload, dashboard charts, leaderboards
  api/        Express API: auth, direct-upload URLs, metrics, groups, leaderboards
  worker/     Background jobs: upload parsing, weekly points
packages/
  shared/     Common types (MetricSample, job payloads, cross-device metric list)
  parsers/    Vendor adapters -> common (metric, ts, value) shape; validation; safe-unzip rules
  scoring/    Points / streak logic (placeholder values, formula still open)
db/migrations/  Plain SQL migrations
docs/           Planning summary and architecture
```

## Getting started
```bash
cp .env.example .env
npm install
npm run db:up          # Postgres via docker compose
npm run db:migrate
npm run dev:api        # http://localhost:3000/api/health
npm run dev:worker
npm run dev:web        # http://localhost:5173
npm test
```

## Status of the first commit
This is a scaffold, not a working product.

| Piece | State |
|---|---|
| DB schema (users, groups, uploads, samples, daily metrics, points, badges, opt-in) | Written |
| Ultrahuman raw CSV adapter + validation + test | Written, based on the one sample file |
| Direct file upload flow (in-memory parse -> enqueue -> poll) | Implemented (no S3 / external storage needed) |
| Worker `processUpload` | Wired up, download/upsert/aggregate are TODO |
| Auth, metrics, groups, leaderboards routes | Stubs (501) |
| Fitbit / Google Health adapter | Intentionally not written until a real archive's file layout is known |
| Points formula | Placeholder values in `packages/scoring/src/config.ts` |
| Frontend pages | Skeletons, upload page calls the API |

## Open items (from planning)
- Share the folder/file names inside a real Google Health Takeout archive to write the Fitbit adapter.
- Confirm what the Ultrahuman app can export and whether the sample CSV is a slice of a longer export.
- Decide audience (friends / corporate / public), points formula, and whether to keep raw uploads.
- Apply early for Google restricted-scope verification and Ultrahuman partner access (API route, phase 2).
- Privacy: health data, so explicit consent, per-metric opt-in, pseudonyms, deletion, retention policy; review DPDP / GDPR before launch.
