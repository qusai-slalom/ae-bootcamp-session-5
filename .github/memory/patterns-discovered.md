# Patterns Discovered

Reusable code patterns found during development. Check this file before writing new code, and add an entry when the same fix or approach appears more than once.

This file is **committed to git** and grows over time. Update existing entries instead of adding near-copies.

---

## Template

```markdown
## Pattern: <Name>

- **Context:** <Where/when this applies>
- **Problem:** <What goes wrong without this pattern>
- **Solution:** <The approach to use>

**Example:**

<code block showing before/after>

- **Related Files:** <relative links>
- **Discovered:** <YYYY-MM-DD, session name>
```

---

## Pattern: Service Initialization: Empty Array vs Null

- **Context:** Initializing in-memory collections (data stores, caches, lists) in backend services or frontend state.
- **Problem:** Initializing a collection as `null` forces every consumer to null-check. Missed checks cause runtime errors such as `TypeError: Cannot read properties of null (reading 'find')`. API responses also return `null` where clients expect `[]`.
- **Solution:** Initialize collections to an empty array (`[]`). An empty collection is a valid state, and array methods (`find`, `filter`, `map`, `push`) work on it without guards.

**Example:**

```javascript
// Bad: every handler must guard against null
let todos = null;
app.get('/api/todos', (req, res) => res.json(todos)); // returns null
const todo = todos.find((t) => t.id === id);          // TypeError

// Good: empty array is a safe default
let todos = [];
let nextId = 1;
app.get('/api/todos', (req, res) => res.json(todos)); // returns []
const todo = todos.find((t) => t.id === id);          // undefined -> 404 path
```

The same applies to React state: prefer `useState([])` over `useState(null)` for lists.

- **Related Files:** [`packages/backend/src/app.js`](../../packages/backend/src/app.js), [`packages/backend/__tests__/app.test.js`](../../packages/backend/__tests__/app.test.js)
- **Discovered:** 2026-10-16, Backend GET /api/todos Fix

---

## Pattern: Fetch Response Error Handling for React Query

- **Context:** Any `queryFn` / `mutationFn` that uses `fetch`.
- **Problem:** `fetch` only rejects on network failure. 4xx/5xx responses resolve normally, so React Query reports success and `isError`/`onError` never fire.
- **Solution:** Route every response through a helper that throws when `!response.ok`, preferring the API's `{ error }` message. Render `isError` (query) and the first failed mutation's `error.message` in an MUI `<Alert>` (has `role="alert"`, easy to assert).

**Example:**

```javascript
const parseResponse = async (response) => {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || `Request failed with status ${response.status}`);
  }
  return data;
};

queryFn: async () => parseResponse(await fetch('/api/todos')),
```

Use relative URLs (`/api/todos`) so the CRA `proxy` in `package.json` forwards to the backend.

- **Related Files:** [`packages/frontend/src/App.js`](../../packages/frontend/src/App.js), [`packages/frontend/src/__tests__/App.test.js`](../../packages/frontend/src/__tests__/App.test.js)
- **Discovered:** 2026-10-16, Step 5-3 Frontend Feature Completion
