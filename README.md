# Spiral Thirsty - Drink Finder App

A Next.js application for finding and displaying cocktail recipes, built as part of Spiral's take-home coding challenge.

## Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **React 18**
- **Playwright** (E2E testing)
- **Husky** (Git hooks)
- **ESLint** (Linting)

## Prerequisites

- Bun (latest version recommended)
  - Install from [bun.sh](https://bun.sh) or run: `curl -fsSL https://bun.sh/install | bash`
  - After installation, restart your terminal or run: `source ~/.zshrc` (for zsh) or `source ~/.bashrc` (for bash)
  - Verify installation: `bun --version`

## Setup Instructions

1. **Clone the repository** (if applicable):
   ```bash
   git clone <repository-url>
   cd spiral-thirsty
   ```

2. **Install dependencies**:
   ```bash
   bun install
   ```

3. **Install Playwright browsers** (required for e2e tests):
   ```bash
   bunx playwright install chromium
   ```

4. **Run the development server**:
   ```bash
   bun run dev
   ```

5. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## Available Scripts

- `bun run dev` - Start development server
- `bun run build` - Build for production
- `bun run start` - Start production server
- `bun run lint` - Run ESLint
- `bun run test:e2e` - Run Playwright E2E tests
- `bun run test:e2e:ui` - Run Playwright tests with UI

## Git Hooks (Husky)

This project uses Husky to run quality checks before commits. The pre-commit hook will automatically run:
1. `bun run lint` - ESLint checks
2. `bun run test:e2e` - E2E tests

Both checks must pass before a commit is allowed. This ensures code quality and that all tests pass before code is committed.

To bypass the hook (not recommended):
```bash
git commit --no-verify
```

## E2E Testing

E2E tests are located in the `e2e/` directory and use Playwright.

**Setup** (first time only):
```bash
# Install Playwright browsers
bunx playwright install chromium
```

**Run tests locally**:
```bash
# Run tests headless
bun run test:e2e

# Run tests with UI
bun run test:e2e:ui
```

The Playwright configuration automatically starts the dev server before running tests.

## Project Structure

```
spiral-thirsty/
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── e2e/                   # E2E tests
│   └── home.spec.ts       # Home page tests
├── .husky/                # Git hooks
│   └── pre-commit         # Pre-commit hook
├── playwright.config.ts    # Playwright configuration
└── package.json           # Dependencies and scripts
```

## Development Notes

- The project uses TypeScript with strict mode enabled
- ESLint is configured with Next.js recommended rules
- Pre-commit hooks ensure code quality before commits
- E2E tests verify basic functionality

## License

Private project for Spiral coding challenge.

