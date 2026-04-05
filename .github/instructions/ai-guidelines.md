---
description: Describe when these instructions should be loaded
# applyTo: 'Describe when these instructions should be loaded' # when provided, instructions will automatically be added to the request context when the pattern matches an attached file
---
Provide project context and architecture notes that AI should follow when generating code, answering questions, or reviewing changes.

## Basic Architecture (Layer Based, Lean)
This project uses a lean, layer-based structure (not feature-based).

### Root
- .env: environment variables
- docker-compose.yml: local development bootstrap
- src/: main application code
- tests/: test code and test setup

## src/
### configs/
- App-level configuration files live here.
- Note: database config remains in database/connection.ts.

### constants/
- Holds critical constants that have meaningful system impact.
- Minor constants can be placed inside utils when local/reusable.

### utils/
- Reusable app-layer helpers.
- Current usage is light and may grow over time.

### controllers/
- HTTP handler layer.
- Parses/validates request input (with schemas/types), calls services, and formats HTTP responses.

### middlewares/
- Cross-cutting HTTP concerns (error handling, auth checks, permission checks, session, security, etc.).

### routes/
- Route registration and endpoint wiring.
- Connects URL paths to controllers and middlewares.

### services/
- Application/business logic layer.
- Orchestrates repository calls, transaction calls, and domain rules.

### types/
- App-layer types/interfaces.
- Intended for controller/service/route contracts.

### app.ts
- Express app composition (middleware and routes).

### server.ts
- Runtime startup entrypoint.
- Starts HTTP server and handles process lifecycle concerns.

## src/database/ (Database Subsystem)
This is treated as its own internal subsystem/layer.

### connection.ts
- Database connection setup.
- Note: DB config remains here even though app configs are under src/configs.

### index.ts
- DB-layer exports/aggregation entrypoint.

### migrations/
- Raw SQL migration files applied by script.
- Current approach is SQL-first; may shift toward Kysely later.

### queries/
- SQL query builders grouped by entity.
- Current approach uses manual string-based SQL construction.
- queries/base.queries.ts may evolve to reduce complexity over time.

### repositories/
- Entity-level data-access operations.
- No business logic in repositories.
- Repositories may throw errors; services handle orchestration.

### transactions/
- Transactional operations that combine multiple repository operations.
- Acts as a middle layer between repositories and services.
- Services call transaction functions when atomic multi-step DB work is required.

### types/
- Database/internal schema-driven types.
- Primarily used inside database/.
- Can be used in app layer when practical to avoid duplication.

### seeds/
- Seed code exists but is currently old and not a focus.
- Planned to be updated later.

### utils/
- DB-layer reusable utilities.
- Current usage is relatively low but available for shared DB helpers.

## tests/
### api/
- API/integration-style tests.

### helpers/
- Test helper utilities.

### setup-db.sh
- Test database setup script.

### setup.ts
- Test runtime setup/bootstrap.

## Current Direction Notes
- Structure is intentionally lean and layer-first.
- configs/constants/utils are still evolving and not heavily populated yet.
- SQL is manually composed today; migration toward Kysely is a possible future direction.
- tests/ is slightly backdated and expected to improve after major feature work.