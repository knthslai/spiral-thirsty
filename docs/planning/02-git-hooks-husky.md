# Git Hooks Setup - Husky

## Overview
Configured Husky to automate code quality checks before commits.

## Decision: Husky for Git Hooks

**Why Husky?**
- Industry standard for git hooks in Node.js projects
- Easy to configure and maintain
- Works seamlessly with npm/bun scripts
- Version 9.x provides modern, simple setup

## Implementation Steps

### 1. Installation
- Added `husky` as dev dependency
- Ran `husky init` to set up `.husky` directory
- Added `prepare` script to `package.json` to auto-initialize Husky

### 2. Pre-commit Hook Configuration
Created `.husky/pre-commit` hook that runs:
1. **Linting** (`bun run lint`) - Always runs
   - Ensures code follows ESLint rules
   - Catches syntax errors and style issues early
   - Fast execution, runs on every commit

2. **E2E Tests** (`bun run test:e2e`) - Conditionally runs
   - Only runs when code-related files change
   - Verifies application functionality
   - Ensures no regressions before commit
   - Automatically starts dev server via Playwright config
   - **Smart detection:** Checks staged files against code patterns:
     - `app/`, `src/`, `components/`, `lib/`, `hooks/`, `types/`, `theme/`
     - Files with `.tsx`, `.ts`, `.jsx`, `.js` extensions
     - Config files: `next.config`, `playwright.config`, `package.json`
   - Skips tests for documentation, config-only, or non-code changes

### 3. Hook Behavior
- Both checks must pass for commit to succeed
- Provides clear feedback on what failed
- Can be bypassed with `--no-verify` (not recommended)

## Reasoning

**Why run tests on pre-commit?**
- Prevents broken code from entering the repository
- Catches issues immediately when context is fresh
- Encourages TDD practices
- Reduces CI/CD failures

**Why conditional e2e test execution?**
- Optimizes commit speed - only runs tests when code changes
- Documentation-only commits don't trigger expensive test runs
- Config-only changes skip tests unless config affects runtime
- Better developer experience - faster commits for non-code changes
- Still ensures code quality - tests always run for actual code changes

**Trade-offs:**
- ⚠️ Tests take ~3-5 seconds when code changes (optimized from always running)
- ✅ Faster commits for documentation/config changes
- ✅ Higher code quality for code changes
- ✅ Fewer broken builds in CI
- ✅ Better developer experience overall

## Files Modified
- `.husky/pre-commit` - Pre-commit hook script
- `package.json` - Added `prepare` script

## Future Considerations
- Husky v10 will deprecate current hook format
- May need to migrate to new format in future
- Consider adding pre-push hook for additional checks

