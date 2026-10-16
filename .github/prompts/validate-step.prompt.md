---
description: "Validate that all success criteria for the current step are met"
agent: code-reviewer
tools: ['search', 'read', 'execute', 'web', 'todo']
---

# Validate Step

Validate the current workspace against the success criteria of a specific exercise step.

Step number (REQUIRED): ${input:step-number:Step number (e.g., 5-0, 5-1)}

## Instructions

1. **Require the step number**
   - If no step number was provided, ask the user for one and stop until it is given.

2. **Find the exercise issue**
   - Use the gh CLI commands in the **Workflow Utilities** section of [copilot-instructions.md](../copilot-instructions.md). The main exercise issue has **"Exercise:"** in its title.

3. **Get the issue with comments**
   ```bash
   gh issue view <issue-number> --comments
   ```

4. **Locate the step**
   - Search the issue body and comments for the heading `# Step {step-number}:`.
   - Extract that step's **Success Criteria** section.

5. **Check each criterion**
   - Create a todo item for each criterion.
   - Verify each one against the actual workspace state: inspect files, run `npm test`, `npm run lint`, or `npm run test:ui` when a criterion requires it, and check `git status` or branches.
   - Base every verdict on evidence such as file paths, command output, or test counts. Do not assume a criterion is met.
   - Do not modify files. This prompt only validates.

## Report

| # | Criterion | Status | Evidence |
|---|-----------|--------|----------|
| 1 | ... | ✅ Met / ❌ Not met / ⚠️ Partial | ... |

Then:
- **Overall:** Step `{step-number}` complete or incomplete.
- **For each incomplete item:** list specific next actions (files to change, commands to run, or prompts such as `/execute-step`, `/create-ui-tests`, `/run-ui-tests`).
- **If everything passes:** suggest `/commit-and-push`.
