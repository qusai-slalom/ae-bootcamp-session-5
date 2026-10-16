---
description: "Analyze changes, generate commit message, and push to feature branch"
tools: ['read', 'execute', 'todo']
---

# Commit and Push

Commit all current changes and push them to the feature branch provided by the user.

Branch name (REQUIRED): ${input:branch-name:Feature branch name (e.g., feature/add-delete-button)}

## Instructions

1. **Confirm the branch name**
   - If no branch name was provided, ask the user for one and **stop until it is given**.
   - Never use `main` (or any branch other than the one the user provided).

2. **UI test gate**
   - If the current step requires UI workflow, either `/run-ui-tests` must have passed earlier in this chat, or you must run `npm run test:ui` now and it must pass.
   - If UI tests fail, stop and report. Do not commit.

3. **Analyze changes**
   ```bash
   git status
   git diff
   git diff --staged
   ```

4. **Generate a commit message**
   - Use conventional commit format as described in the **Git Workflow** section of [copilot-instructions.md](../copilot-instructions.md) (`feat:`, `fix:`, `test:`, `docs:`, `chore:`, `refactor:`).
   - Write a concise subject line (≤ 72 chars) that describes the main change. Add a short body if multiple areas changed.

5. **Switch to the branch**
   - If the branch exists: `git checkout <branch-name>`
   - If it does not: `git checkout -b <branch-name>`

6. **Stage, commit, and push**
   ```bash
   git add .
   git commit -m "<type>: <description>"
   git push origin <branch-name>
   ```

## Report

Report the branch, the commit hash and message, and the push result. If any command fails, show the key error lines and stop.
