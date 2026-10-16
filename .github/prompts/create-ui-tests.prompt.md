---
description: "Create UI tests for required critical user journeys"
agent: test-engineer
tools: ['search', 'read', 'edit', 'execute', 'todo']
---

# Create UI Tests

Create or update Playwright UI tests for the critical user journeys.

Journeys (optional): ${input:journeys:Comma-separated journeys (leave blank for default: create, edit, toggle, delete, error-state)}

## Scope

- If no journeys were provided, use the default set: **create, edit, toggle, delete, and core error-state handling**.
- **HARD LIMIT:** create at most **5** Playwright tests in this run (target 3-5 in total).
- Include **at least 1 error-path test** within that total (e.g., API unavailable or a server error mocked with `page.route`).
- If there are more than 5 candidate scenarios, choose the **5 with the highest risk** and list the rest as deferred. Do not create more tests.

## Instructions

1. **Inspect** the real UI markup in `packages/frontend/src/App.js` and the API routes in `packages/backend/src/app.js` before writing selectors.
2. **Apply the Page Object Model** under `packages/frontend/tests/ui/`:
   - Put reusable selectors and interactions in page objects (e.g., `pages/todo-page.js`) and fixtures.
   - Keep spec files focused on the scenario and its assertions. Do not use raw selectors in specs.
   - Do not repeat selectors or interaction flows across tests.
3. **Selectors and waits**
   - Prefer `getByRole`, `getByLabel`, `getByText`. Use `getByTestId` only as a last resort.
   - Use web-first assertions and state-based waits. Never use `waitForTimeout`.
4. **Isolation**
   - Use unique test data for each test. Set up and clean up through the API, or mock with `page.route`.
   - Do not share state between tests, and do not depend on the order tests run in.
5. **Verify the test count before finishing**
   - Count the `test(...)` / `it(...)` cases you created or updated in `packages/frontend/tests/ui/`.
   - If the count is above 5, reduce it to 5 or fewer before you report.
   - Do not describe the work as "small scope" if the final authored count is greater than 5.

Do not run the full suite here. Running tests is the job of `/run-ui-tests`.

## Report

- **Files changed:** list of page objects, fixtures, and specs
- **Test count:** N (must be ≤ 5)
- **Scenarios covered:** table of test name → journey → happy path or error path
- **Deferred scenarios:** any candidates not implemented, with a short reason
- **Next:** `/run-ui-tests`
