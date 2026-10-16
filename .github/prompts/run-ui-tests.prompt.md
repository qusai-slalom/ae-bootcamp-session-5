---
description: "Run UI tests and summarize failures"
agent: test-engineer
tools: ['read', 'execute', 'todo']
---

# Run UI Tests

Install Playwright dependencies, run the UI test suite, and summarize the results.

## Instructions

1. **Install browser dependencies (REQUIRED first step)**
   ```bash
   npm run test:ui:install --workspace=frontend
   ```
   - This step is mandatory on Ubuntu/Linux. It runs `playwright install --with-deps chromium`.
   - Run it again after every container rebuild.
   - The script already includes a limited automatic fix for the common Ubuntu Yarn apt-key issue, followed by one retry.
   - Do **NOT** search for packages yourself or attempt broader OS troubleshooting beyond that automatic fix.
   - **If the install still fails:** stop immediately and report an **environment blocker** with the failing command and the key error lines. Do **not** run the Playwright tests.

2. **Make sure the app is running**
   - The backend and frontend must both be available. Playwright's `webServer` config starts `npm run start` from the repo root and reuses a server that is already running.
   - If the servers need to be started manually, run `npm start` from the repo root.

3. **Run the UI tests**
   ```bash
   npm run test:ui
   ```

4. **Summarize the results**
   - Report the total, passed, failed, skipped, and flaky counts.
   - For each failure, give the test name, the key error line, and the trace or screenshot path if available.

5. **Classify each failure** into one likely root cause:

   | Category | Typical signals |
   |----------|-----------------|
   | **Application code** | Wrong API response, UI not updating after a correct action, console exceptions |
   | **Test code** | Selector not found or strict-mode violation, missing wait or race, data collision, wrong expectation |
   | **Environment** | `ECONNREFUSED`, port in use, browsers missing, `webServer` timeout |

Do not fix code in this prompt. Recommend the next step for each failure:
- **Test defects:** run `/create-ui-tests` again or fix the test with `test-engineer`.
- **Application defects:** hand off to `tdd-developer` with `/execute-step`.
- **Environment issues:** give the exact remediation command.

## Report

| Test | Result | Category | Key evidence | Recommended action |
|------|--------|----------|--------------|--------------------|

End with:
- **All tests pass:** `/validate-step {step-number}`
- **Any test fails:** the blocking items to address first
