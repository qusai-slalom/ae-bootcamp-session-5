# Copilot Instructions: TODO Application

## Project Context

- Full-stack TODO application with a **React** frontend and an **Express** backend
- Focus on iterative, feedback-driven development
- Current phase: **Backend stabilization and frontend feature completion**

## Documentation References

Consult these documents before making changes. They describe how the project is built and tested:

- [docs/project-overview.md](../docs/project-overview.md) - Architecture, tech stack, and structure
- [docs/testing-guidelines.md](../docs/testing-guidelines.md) - Test patterns and standards
- [docs/workflow-patterns.md](../docs/workflow-patterns.md) - Development workflow guidance

## Development Principles

- **Test-Driven Development**: Follow the Red-Green-Refactor cycle
- **Incremental Changes**: Make small, testable modifications
- **Systematic Debugging**: Use test failures as guides to the root cause
- **Validation Before Commit**: All tests pass and there are no lint errors

## Testing Scope

This project uses unit tests, integration tests, and UI end-to-end tests:

- **Backend**: Jest + Supertest for API testing (`packages/backend/__tests__/`)
- **Frontend**: React Testing Library for component unit/integration tests (`packages/frontend/src/__tests__/`)
- **UI testing**: Playwright for critical user journey automation (`packages/frontend/tests/ui/`)
- **Manual browser testing**: Exploratory validation and visual checks
- **Reason**: Combine fast feedback (unit/integration) with end-to-end quality confidence (UI tests)

### Testing Approach by Context

- **Backend API changes**: Write Jest tests FIRST, then implement (RED-GREEN-REFACTOR)
- **Frontend component features**: Write React Testing Library tests FIRST for component behavior, then implement (RED-GREEN-REFACTOR). Follow with manual browser testing for full UI flows.
- This is true TDD: test first, then write code to pass the test

## Workflow Patterns

Follow these development workflows:

1. **TDD Workflow**: Write/fix tests → Run → Fail → Implement → Pass → Refactor
2. **Code Quality Workflow**: Run lint → Categorize issues → Fix systematically → Re-validate
3. **Integration Workflow**: Identify issue → Debug → Test → Fix → Verify end-to-end
4. **UI Testing Workflow**: Define critical journeys → Create UI tests → Run → Debug failures → Validate coverage

## Agent Usage

Use the specialized agent that matches the task:

| Agent | Use for | Boundaries |
|-------|---------|------------|
| `tdd-developer` | Implementation and unit/integration TDD cycles | Do NOT create or run Playwright UI tests in this mode |
| `code-reviewer` | Addressing lint errors and code quality improvements | Focus on quality fixes, not new features |
| `test-engineer` | All Playwright UI test authoring/execution, failure triage, and isolation checks | Owns the UI test suite |

## Memory System

- **Persistent Memory**: This file (`.github/copilot-instructions.md`) contains foundational principles and workflows
- **Working Memory**: [.github/memory/](memory/README.md) directory contains discoveries and patterns
- During active development, take notes in [.github/memory/scratch/working-notes.md](memory/scratch/working-notes.md) (not committed)
- At end of session, summarize key findings into [.github/memory/session-notes.md](memory/session-notes.md) (committed)
- Document recurring code patterns in [.github/memory/patterns-discovered.md](memory/patterns-discovered.md) (committed)
- Reference these files when providing context-aware suggestions

## Workflow Utilities

GitHub CLI commands for workflow automation (available to all modes):

```bash
# List open issues
gh issue list --state open

# Get issue details
gh issue view <issue-number>

# Get issue with comments
gh issue view <issue-number> --comments
```

- The main exercise issue has **"Exercise:"** in its title
- Steps are posted as comments on the main issue
- Use these commands when the `/execute-step` or `/validate-step` prompts are invoked

## Git Workflow

- Use **conventional commits**: `feat:`, `fix:`, `chore:`, `docs:`, `test:`, `refactor:`, etc.
  - Example: `feat: add delete button to todo items`
- Feature branches: `feature/<descriptive-name>`
- Always stage all changes before committing:

  ```bash
  git add .
  git commit -m "<type>: <description>"
  ```

- Push to the correct branch:

  ```bash
  git push origin <branch-name>
  ```
