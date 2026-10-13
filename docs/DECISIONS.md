# AutoPulse – Architecture Decision Records

Each record documents a significant technical decision, the context behind it,
and its trade-offs.

---

## ADR-001: Monorepo Structure

**Context:** The project has a Laravel API and a React frontend developed by a single developer.

**Decision:** Keep both applications in one repository under `backend/` and `frontend/`,
with shared Docker configuration and documentation at the root.

**Consequences:**
- (+) One place for issues, documentation and history; API and UI changes ship in a single pull request.
- (+) A single `docker compose up` starts the entire system.
- (−) CI must detect which application changed to avoid running unnecessary jobs.
- (−) Independent deployment requires separate build pipelines per folder.

---

## ADR-002: Containerized Development Environment

**Context:** Local PHP, PostgreSQL and Redis installations differ across machines and operating systems.

**Decision:** Run all services (PHP-FPM, Nginx, PostgreSQL, Redis, Node) through Docker Compose.

**Consequences:**
- (+) Identical environment for every developer; production-like setup from day one.
- (+) No PHP or PostgreSQL installation required on the host machine.
- (−) File system performance is slower on Windows bind mounts; mitigated by keeping
  `vendor/` and `node_modules/` inside container volumes.

---

## ADR-003: PostgreSQL as Primary Database

**Context:** The domain requires strict data integrity, time-series telemetry data and conditional uniqueness rules.

**Decision:** Use PostgreSQL.

**Consequences:**
- (+) Partial unique indexes enforce "one active assignment per vehicle" at the database level.
- (+) Native `timestamptz`, strong constraint support and advanced indexing (BRIN, partial, composite).
- (+) Aligns with the stack commonly used by target employers.
- (−) Foreign keys are not indexed automatically; indexes must be added explicitly in migrations.

---

## ADR-004: Token-Based Authentication with Laravel Sanctum

**Context:** The API serves a React SPA today and may serve mobile clients or third-party integrations later.
Telematics devices also need machine-to-machine authentication.

**Decision:** Use Sanctum personal access tokens (Bearer tokens) for users.
Devices authenticate with a separate per-vehicle token stored only as a SHA-256 hash.

**Consequences:**
- (+) Stateless, client-agnostic authentication that works for web, mobile and devices.
- (+) Tokens can be individually revoked on logout.
- (−) Tokens stored in browser storage are exposed to XSS attacks. Sanctum's cookie-based
  SPA authentication avoids this for same-domain SPAs. Mitigations: token expiration,
  revocation on logout, and strict input sanitization.

---

## ADR-005: Single-Database Multi-Tenancy

**Context:** Multiple organizations share the platform and must never see each other's data.

**Decision:** Store all tenants in one database. Top-level tables carry an `organization_id`
column, filtered automatically by an Eloquent global scope.

**Consequences:**
- (+) Simple migrations, backups and deployment; one connection pool.
- (+) Standard approach for early-stage SaaS products.
- (−) A missed scope or raw query can leak data across tenants. Mitigated by
  global scopes, Policies and dedicated tenant-isolation tests.

---

## ADR-006: Thin Controllers with Action Classes (No Repository Pattern)

**Context:** Business logic must be testable, reusable and kept out of controllers.

**Decision:** Request flow follows: Form Request (validation) → Controller (HTTP only)
→ Action class (business logic) → Eloquent Model → API Resource (response shape).
Authorization is handled by Policies.

**Consequences:**
- (+) Each Action does one thing (e.g. `AssignDriverToVehicle`) and can be reused from
  controllers, queued jobs and Artisan commands.
- (+) Eloquent already abstracts data access; a Repository layer on top would add
  boilerplate without real benefit for this project.
- (−) Switching away from Eloquent would require changes in Actions. This is an
  accepted trade-off, as such a switch is not planned.

---

## ADR-007: Versioned REST API with Consistent Responses

**Context:** Frontend and future clients need a stable, predictable contract.

**Decision:** All endpoints live under `/api/v1`. Responses use API Resources,
collections are paginated, and errors follow a single JSON structure.

**Consequences:**
- (+) Breaking changes can be introduced in `/api/v2` without affecting existing clients.
- (+) Frontend error handling is written once.
- (−) Slightly more code per endpoint compared to returning models directly.

---

## ADR-008: Asynchronous Processing with Queues

**Context:** Telemetry ingestion and alert generation must not slow down API responses.

**Decision:** Use Laravel queues backed by Redis. Scheduled jobs evaluate maintenance due dates
and license expiries daily.

**Consequences:**
- (+) Device ingest endpoints respond immediately; heavy work runs in the background.
- (+) Failed jobs can be retried automatically.
- (−) Requires a running queue worker and adds Redis as an infrastructure dependency.

---

## ADR-009: Frontend Server State with TanStack Query

**Context:** Most frontend state is data fetched from the API (vehicles, alerts, schedules).

**Decision:** Use TanStack Query for server state, a shared Axios instance for HTTP,
and React Hook Form with Zod for forms. Code is organized by feature, not by file type.

**Consequences:**
- (+) Built-in caching, background refetching, loading and error states.
- (+) No global store needed for API data.
- (−) Additional library to learn compared to plain `useEffect` fetching.

---

## ADR-010: Engineering Workflow

**Context:** The repository is a public portfolio and should reflect professional team practices.

**Decision:**
- Conventional Commits (`feat:`, `fix:`, `docs:`, `chore:`, `refactor:`, `test:`).
- Feature branches merged into `main` through pull requests.
- Automated tests with Pest and code style enforcement with Laravel Pint, run in GitHub Actions CI.

**Consequences:**
- (+) Readable history and reviewable changes.
- (+) Broken code cannot silently reach `main`.
- (−) Slightly slower workflow for a solo developer, accepted for long-term quality.