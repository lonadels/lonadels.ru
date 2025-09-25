# Project Guidelines

## Project Overview
lonadels.ru is a Next.js web application with internationalization, Prisma ORM, and Tailwind CSS. It is container-ready via Docker and uses GitHub Actions for CI. The project stores schema and migrations for a relational database (via Prisma) and serves localized content from the messages directory. The codebase lives under src and follows a modular structure with components and i18n utilities.

Key technologies:
- Next.js (TypeScript)
- Prisma ORM (schema.prisma, migrations/)
- Tailwind CSS (tailwind.config.js, postcss.config.mjs)
- ESLint (eslint.config.mjs)
- Docker/Docker Compose (Dockerfile, docker-compose.yml, docker/)
- GitHub Actions CI (.github/workflows/workflow.yml)

## Repository Layout
- src/ — application source code
  - components/ — reusable UI components
  - i18n/ — locale configuration (locales.ts), request helpers, set-locale
  - lib/ — shared utilities (e.g., overlay.ts)
- messages/ — localization message catalogs
- prisma: schema.prisma and migrations/ — database schema and history
- public/ — static assets
- configuration: next.config.ts, tsconfig.json, tailwind.config.js, postcss.config.mjs, eslint.config.mjs
- infra: Dockerfile, docker-compose.yml, docker/ (container-related), .github/workflows/

## How Junie Should Work on This Project
- Scope: Prefer the smallest possible change that satisfies the issue.
- Tests: No dedicated test suite is present. Do not add or run tests unless explicitly requested in an issue.
- Build/Run checks: If an issue affects runtime behavior, run a local build only when asked. Otherwise, avoid long builds to keep CI fast.
- Code style: Follow existing patterns; use TypeScript, keep imports sorted when convenient, and maintain concise, readable code. Avoid introducing new dependencies unless necessary.
- i18n: When touching user-facing text, consider the messages/ structure and existing locale handling in src/i18n/.
- Database: If changing Prisma models, update schema.prisma, run prisma generate, and create a migration only when the issue requires DB changes.

## Local Development (optional)
- Node.js and pnpm/npm installed.
- Copy .env.example to .env if applicable; ensure database connection string is set for Prisma when needed.
- Install deps: npm install
- Dev server: npm run dev
- Build: npm run build; Start: npm start
- Docker: docker-compose up uses the provided Dockerfile and compose config.

## CI
- GitHub Actions workflow at .github/workflows/workflow.yml runs lint/build on push/PR (adjust as needed).

## Submission Checklist for Junie
- Keep diffs minimal and focused.
- Update docs when you change behavior or structure.
- Update README when changes affect usage, setup, developer workflow, or documentation to ensure information is supplemented/edited as necessary.
- If you change API endpoints or their behavior, update the OpenAPI specification (public\\openapi.json) and ensure the API docs route reflects the changes.
- If you modify config or infra, mention it in the status update.
- If you introduce or change environment variables, update .env.example and README (setup section) to reflect the new vars.
- Prisma: when models change, update schema.prisma, run `npx prisma generate`, and create a migration only if required (`npx prisma migrate dev --name <change>`); commit new files in migrations\\.
- i18n: when adding/renaming user-facing text, keep messages\\*.json in sync across locales; when adding a locale, create messages\\<locale>.json and include it in SUPPORTED in src\\i18n\\request.ts.
- API docs route: ensure src\\app\\api\\docs\\route.ts serves the latest public\\openapi.json after any spec changes.
- If npm scripts or build tooling change (package.json), adjust .github\\workflows accordingly and update README commands.
- If Dockerfile or docker-compose.yml change, update README (run/build instructions) and mention it in the status update.
