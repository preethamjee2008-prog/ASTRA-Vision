# ASTRA Vision

ASTRA Vision is a transparent aerospace computer-vision workspace for reviewing aircraft and defense imagery with evidence-backed classification.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/astra-vision/src/` — React shell, mission pages, processing HUD, result panels, and theme.
- `artifacts/api-server/src/services/vision.ts` — catalog-aware image analysis service.
- `artifacts/astra-vision/public/dataset/` — credited reference catalog and source images.
- `lib/api-spec/openapi.yaml` — source of truth for health, model, evaluation, catalog, history, and analysis contracts.

## Architecture decisions

- Analysis completion is driven by a parsed API response; the frontend never uses a timer to decide when results are ready.
- The starter dataset has image-level labels but no bounding-box annotations, so the UI keeps spatial detection and Grad-CAM explicitly unavailable.
- Exact names are shown only with catalog evidence; otherwise the active model response remains at the supported class level.
- Evaluation metrics remain null / not evaluated until a held-out model run exists.

## Product

Users can upload and analyze an image, inspect confidence and top predictions, trace catalog references, review the server audit trail, and understand model scope and evaluation limitations.

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- Run `pnpm --filter @workspace/api-spec run codegen` after changing `lib/api-spec/openapi.yaml`.
- The frontend build expects workflow-provided `PORT` and `BASE_PATH`; use the managed ASTRA Vision workflow for previews.
- Multipart OpenAPI schemas generate a `Blob` type in `@workspace/api-zod`, so its TypeScript lib includes `dom`.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
