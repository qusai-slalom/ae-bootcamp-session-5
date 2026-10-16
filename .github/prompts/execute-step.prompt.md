---
description: "Execute instructions from the current GitHub Issue step"
agent: tdd-developer
tools: ['search', 'read', 'edit', 'execute', 'web', 'todo']
---

# Execute Step

Execute the latest step from the exercise GitHub Issue.

Issue number (optional): ${input:issue-number:Issue number (leave blank to auto-detect the exercise issue)}

## Instructions

1. **Find the issue**
   - If an issue number was provided above, use it.
   - Otherwise, find the exercise issue with the gh CLI commands in the **Workflow Utilities** section of [copilot-instructions.md](../copilot-instructions.md). The main exercise issue has **"Exercise:"** in its title.

2. **Get the issue with comments**
   ```bash
   gh issue view <issue-number> --comments
   ```

3. **Find the latest step**
   - Steps are posted as comments that start with `# Step X-Y:`.
   - Use the **most recent** step comment. Record its step number for the final handoff.

4. **Plan and execute activities**
   - Create a todo item for each `:keyboard: Activity:` section in that step.
   - Execute the activities in order, marking each todo as completed when it is done.
   - Follow the TDD workflow and the **Testing Scope** in the project instructions: write Jest / React Testing Library tests first, then implement.
   - Consult [.github/memory/](../memory/README.md) for existing patterns and decisions, and record findings in `scratch/working-notes.md`.

## Scope Boundaries

- **Do NOT** create or run Playwright UI tests in this prompt.
- Playwright UI work is handed off to `/create-ui-tests` and `/run-ui-tests`, which automatically switch to the `test-engineer` agent.
- **Do NOT** commit or push. That is the job of `/commit-and-push`.

## Completion

Stop after all activities are complete. Summarize what was done, then give the next commands **in this order**:

- **If the step requires UI workflow** (mentions Playwright, UI tests, or end-to-end journeys):
  1. `/create-ui-tests`
  2. `/run-ui-tests`
  3. `/validate-step {step-number}`
- **If UI workflow is not required:**
  1. `/validate-step {step-number}`

Never recommend `/validate-step` before the required UI prompts.
