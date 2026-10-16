# Session Notes

Summaries of completed development sessions. Each entry turns the important parts of `scratch/working-notes.md` into a short record for future reference.

This file is **committed to git** as a historical record. Add new sessions at the top.

---

## Template

```markdown
## Session: <Short descriptive name> - <YYYY-MM-DD>

### What Was Accomplished
- <Completed task or feature>
- <Tests fixed / added>

### Key Findings and Decisions
- **Finding:** <What was discovered and where>
- **Decision:** <What was chosen> - *Why:* <reasoning, alternatives rejected>

### Outcomes
- Tests: <passing/total, or which suites are green>
- Lint: <clean / remaining issues>
- Follow-ups: <open items for next session>
- Patterns added: <links to entries in patterns-discovered.md, if any>
```

---

## Session: Step 5-3 Frontend Feature Completion - 2026-10-16

### What Was Accomplished
- Implemented delete, edit (inline Save/Cancel), calculated stats, empty state, relative API URL, and query/mutation error alerts in [`packages/frontend/src/App.js`](../../packages/frontend/src/App.js)
- Added 10 RTL tests (written first, RED confirmed) in [`packages/frontend/src/__tests__/App.test.js`](../../packages/frontend/src/__tests__/App.test.js)
- Replaced the example Google smoke spec with 5 Playwright POM tests in [`packages/frontend/tests/ui/`](../../packages/frontend/tests/ui/)

### Key Findings and Decisions
- **Finding:** `fetch` does not reject on 4xx/5xx, so React Query never saw errors.
- **Decision:** Shared `parseResponse` helper throws on `!response.ok`, using the backend's `{ error }` message. *Why:* one place for error semantics across query and all mutations.
- **Decision:** Added `aria-label`s to icon buttons/checkboxes. *Why:* accessibility and role-based selectors in RTL and Playwright.
- **Decision:** UI tests seed via backend API with per-test unique title prefixes and clean up in a fixture. *Why:* backend state is shared in-memory; parallel runs must not collide.

### Outcomes
- Tests: frontend 11/11, backend 15/15, UI 5/5 (15/15 with `--repeat-each=3 --workers=4`)
- Lint: clean
- Follow-ups (deferred UI journeys): empty-state and stats E2E (covered by RTL), mutation-error E2E
- Patterns added: [Fetch Response Error Handling for React Query](patterns-discovered.md#pattern-fetch-response-error-handling-for-react-query)

---

## Session: Backend GET /api/todos Fix - 2026-10-16 (Example)

### What Was Accomplished
- Fixed the failing `GET /api/todos` test in [`packages/backend/__tests__/app.test.js`](../../packages/backend/__tests__/app.test.js)
- Initialized the in-memory store and ID counter in [`packages/backend/src/app.js`](../../packages/backend/src/app.js)

### Key Findings and Decisions
- **Finding:** `todos` was initialized as `null`, so `GET` returned `null` instead of `[]`, and `todos.find()` in the toggle/delete handlers threw `TypeError`.
- **Decision:** Initialize `todos = []` instead of adding null checks in every handler. *Why:* one fix at the source removes a whole class of errors; null guards would have been repeated everywhere.
- **Decision:** Uncommented `let nextId = 1` so the upcoming POST implementation can generate IDs.

### Outcomes
- Tests: `GET /api/todos` test passing; POST/PUT/DELETE tests still failing (expected; not yet implemented)
- Lint: `unusedDebugFlag` warning still present; deferred to the lint session
- Follow-ups: Implement `POST /api/todos` next using TDD
- Patterns added: [Service Initialization: Empty Array vs Null](patterns-discovered.md#pattern-service-initialization-empty-array-vs-null)
