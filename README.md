# Spiral Thirsty - Drink Finder App

A Next.js application for finding and displaying cocktail recipes, built as part of Spiral's take-home coding challenge.

## Tech Stack

- **Next.js 14** (App Router)
- **TypeScript** (strict mode)
- **React 18**
- **Chakra UI** (UI components - to be added)
- **@tanstack/react-query** (data fetching - to be added)
- **Vitest** (unit/integration testing)
- **Playwright** (E2E testing)
- **Prettier** (code formatting)
- **Husky** (Git hooks)
- **ESLint** (Linting)

## Prerequisites

- **Node.js** 18+ (latest LTS recommended)
- **pnpm** (recommended) or npm
  - Install pnpm: `npm install -g pnpm`
  - Verify installation: `pnpm --version`

## Setup Instructions

1. **Clone the repository** (if applicable):

   ```bash
   git clone <repository-url>
   cd spiral-thirsty
   ```

2. **Install dependencies**:

   ```bash
   pnpm install
   ```

3. **Install Playwright browsers** (required for e2e tests):

   ```bash
   pnpm exec playwright install chromium
   ```

4. **Run the development server**:

   ```bash
   pnpm run dev
   ```

5. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## Available Scripts

### Development

- `pnpm run dev` - Start development server
- `pnpm run build` - Build for production
- `pnpm run start` - Start production server

### Code Quality

- `pnpm run lint` - Run ESLint
- `pnpm run format` - Format all files with Prettier
- `pnpm run format:check` - Check formatting without modifying files

### Testing

- `pnpm run test` - Run unit/integration tests in watch mode (Vitest)
- `pnpm run test:ui` - Run tests with Vitest UI
- `pnpm run test:run` - Run tests once (for CI/pre-commit)
- `pnpm run test:e2e` - Run Playwright E2E tests
- `pnpm run test:e2e:ui` - Run Playwright tests with UI

## Git Hooks (Husky)

This project uses Husky to run quality checks before commits. The pre-commit hook will automatically:

1. **Format code** - Run Prettier on staged files
2. **Lint code** - Run ESLint checks
3. **Run unit tests** - If test files changed (`.test.ts`, `.spec.ts`, or files in `e2e/` or `src/tests/`)
4. **Run E2E tests** - If code files changed (app, src, components, etc.)

All checks must pass before a commit is allowed. This ensures code quality, consistent formatting, and that all tests pass before code is committed.

To bypass the hook (not recommended):

```bash
git commit --no-verify
```

## Testing

### Unit/Integration Tests (Vitest)

Unit and integration tests are located in `src/tests/` and use Vitest.

**Current test coverage:**

- API integration tests (`src/tests/api.test.ts`) - 20 tests covering:
  - `searchDrinks` function
  - `getDrinkById` function
  - Helper functions and type guards
  - Response structure validation
  - Edge case handling

**Run tests:**

```bash
# Watch mode (development)
pnpm run test

# Run once
pnpm run test:run

# With UI
pnpm run test:ui
```

### E2E Tests (Playwright)

E2E tests are located in the `e2e/` directory and use Playwright.

**Setup** (first time only):

```bash
# Install Playwright browsers
pnpm exec playwright install chromium
```

**Run tests locally**:

```bash
# Run tests headless
pnpm run test:e2e

# Run tests with UI
pnpm run test:e2e:ui
```

The Playwright configuration automatically starts the dev server before running tests.

## Project Structure

```
spiral-thirsty/
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── src/
│   ├── app/               # App router pages (to be moved)
│   ├── components/        # React components (to be added)
│   ├── hooks/             # React hooks (to be added)
│   ├── lib/               # Utility functions
│   │   └── api.ts         # API integration
│   ├── types/             # TypeScript type definitions
│   │   └── cocktail.ts    # Cocktail API types
│   └── tests/             # Unit/integration tests
│       └── api.test.ts    # API integration tests
├── e2e/                   # E2E tests
│   └── home.spec.ts       # Home page tests
├── docs/
│   ├── initial-files/     # Original project specification PDFs
│   │   ├── Spiral Coding Challenge 2025-2026.pdf
│   │   └── Spiral Take-home Project Plan (thirsty App).pdf
│   └── planning/          # Planning documentation (see below)
├── .husky/                # Git hooks
│   └── pre-commit         # Pre-commit hook
├── playwright.config.ts   # Playwright configuration
├── vitest.config.ts       # Vitest configuration
├── .prettierrc.json       # Prettier configuration
└── package.json           # Dependencies and scripts
```

## Recent Changes

### API Integration

- Created comprehensive TypeScript type models for TheCocktailDB API
- Implemented API integration layer (`src/lib/api.ts`)
- Added 20 API integration tests verifying response structure and type safety

### Testing Infrastructure

- Set up Vitest for unit/integration testing
- Enhanced pre-commit hook with intelligent test execution
- Tests run automatically based on what files changed

### Code Quality

- Added Prettier for automatic code formatting
- Configured lint-staged to format only staged files
- All code is automatically formatted before commit

## Documentation

### Project Specifications

The original project specifications are available in `docs/initial-files/`:

- **Spiral Coding Challenge 2025-2026.pdf** - Official challenge specification
- **Spiral Take-home Project Plan (thirsty App).pdf** - Execution plan and requirements

### Planning Documentation

For detailed information about project setup, decisions, and reasoning, see the [planning documentation](./docs/planning/README.md).

The planning docs include:

- Documentation philosophy and approach (`.cursorrules` and planning docs)
- Initial setup and package manager decisions
- Git hooks and Husky configuration
- E2E testing setup with Playwright
- API integration and type models
- Testing infrastructure and pre-commit enhancements

## Development Notes

- The project uses TypeScript with strict mode enabled
- ESLint is configured with Next.js recommended rules
- Pre-commit hooks ensure code quality, formatting, and tests before commits
- Code is automatically formatted with Prettier
- Tests verify functionality at both unit and E2E levels

## License

Private project for Spiral coding challenge.
