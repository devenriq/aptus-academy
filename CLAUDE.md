# Aptus — Claude Context

Study app for pre-university students in Peru. Monorepo with web (Next.js PWA), mobile (Expo) and API (NestJS).

## Language Rule

**ALL code, comments, variable names, file content, commit messages, PR descriptions, and documentation must be written in English. No exceptions.**

## Monorepo Structure

```
aptus/
├── apps/
│   ├── web/        ← Next.js 14+ (PWA)
│   ├── mobile/     ← React Native + Expo (Android first)
│   └── api/        ← NestJS (Clean/Hexagonal Architecture)
├── packages/
│   ├── shared/     ← TypeScript types, Zod schemas, pure business logic
│   └── ui-tokens/  ← shared design tokens (colors, typography)
└── turbo.json
```

## Stack

| App               | Key Technologies                                          |
| ----------------- | --------------------------------------------------------- |
| `apps/web`        | Next.js 14, TypeScript, Tailwind, shadcn/ui, Zustand      |
| `apps/mobile`     | Expo SDK, React Native, Expo Router, NativeWind, Zustand  |
| `apps/api`        | NestJS, TypeScript, TypeORM, Supabase (PostgreSQL + Auth) |
| `packages/shared` | TypeScript, Zod                                           |

## Global Conventions

- **Strict TypeScript** across all packages (`strict: true`)
- **Zod** for validation — schemas live in `packages/shared`, imported from web, mobile and api
- **Conventional Commits** — `feat:`, `fix:`, `test:`, `refactor:`, `docs:`
- **TDD mandatory** — no production code without a prior failing test. PRs without tests are rejected
- **Never** import from `apps/` inside `packages/`
- **Never** import directly between apps — all shared logic goes to `packages/shared`

## Git & CI/CD

### Branching Strategy — GitHub Flow

```
feature/{name} ──→ PR ──→ main ──→ staging (auto-deploy)
                               └──→ prod (deploy on release tag v*.*.*)
```

- Every new task starts from `main` in a `feature/` branch
- No code reaches `main` without PR + review
- Merge to `main` triggers automatic deploy to **staging**
- Deploy to **prod** only on release tag (`git tag v1.0.0`)

### Environments

| Environment | Branch/Event       | Purpose                          |
|-------------|--------------------|---------------------------------|
| **local**   | developer's branch | Active development, test data    |
| **staging** | merge to `main`    | QA, demos, pre-prod validation   |
| **prod**    | release tag `v*.*.*` | Real users                     |

Environment variables per environment:
- `local` → `.env.local` (never committed to repo)
- `staging` → Vercel + Railway panel (staging environment)
- `prod` → Vercel + Railway panel (prod environment)

### GitHub Actions (`.github/workflows/`)

Workflows are YAML files in the repo. GitHub executes them automatically.

```
.github/workflows/
├── ci.yml       ← runs on every PR: lint + tests + build
└── deploy.yml   ← runs on merge to main: deploy to staging
```

**`ci.yml`** — runs on every PR:
1. Install dependencies
2. Run lint across all packages
3. Run unit + integration tests (Jest)
4. Run E2E tests (Playwright) against a preview server

**`deploy.yml`** — runs on merge to `main`:
1. Vercel receives `apps/web` deploy automatically (native integration)
2. Railway/Render receives `apps/api` deploy via webhook or CLI

---

## Authentication

Supabase Auth issues JWTs. The NestJS guard validates them using Supabase's public key.
Do not modify this flow without reviewing `apps/api/src/auth/`.

## Business Model

- 7-day free trial on sign up
- Monthly subscription via Culqi
- `user.subscription` field controls access: `trial | active | inactive`
- `SubscriptionGuard` in the API protects content endpoints

## Testing Strategy

### Testing Pyramid

| Layer | Tool | Where | What it tests |
|---|---|---|---|
| Unit — domain/use cases | Jest | `apps/api`, `packages/shared` | Pure logic, no framework |
| Unit + Component — web | Jest + React Testing Library | `apps/web` | React components in isolation |
| Integration — endpoints | Jest + Supertest | `apps/api` | HTTP endpoints + real database |
| **E2E — web** | **Playwright** | `apps/web` | Full flows in real browser |
| Unit + Component — mobile | Jest + React Native Testing Library | `apps/mobile` | RN components in isolation |
| E2E — mobile | Detox | `apps/mobile` | Full flows on device/emulator |

### Playwright's Role

Playwright covers the E2E layer of `apps/web`. It complements Jest + RTL (which test components in isolation). It does not replace unit tests.

**Flows that MUST have a Playwright test:**
- Full register and login flow
- Catalog navigation and filtering
- Answering a question in Free Mode
- Completing a Mock Exam and viewing the score
- Subscription / trial activation flow

**When to use Playwright vs Jest + RTL:**

| Situation | Tool |
|---|---|
| Testing a component renders correctly | Jest + RTL |
| Testing a hook returns the correct value | Jest |
| Testing a user can register and access the catalog | Playwright |
| Testing a flow that spans multiple pages | Playwright |

### TDD Rules

- No production code without a prior failing test
- Use-case tests (`apps/api`) are **always pure unit tests** — no database, no HTTP
- Playwright tests are written for critical flows, not every screen
- PRs without corresponding tests are rejected in CI

---

## Reference

- Full plan: [PLAN.md](PLAN.md)

## Skills (Auto-load based on context)

When you detect any of these contexts, read the corresponding skill BEFORE writing any code.

| Context                                                              | Read this file                                     |
| -------------------------------------------------------------------- | -------------------------------------------------- |
| Working in `apps/api/` — NestJS, modules, use cases, repositories   | `.claude/skills/aptus-nestjs/SKILL.md`    |
| Working in `apps/web/` — Next.js, components, routes, PWA           | `.claude/skills/aptus-nextjs/SKILL.md`    |
| Working in `apps/mobile/` — Expo, React Native, NativeWind          | `.claude/skills/aptus-expo/SKILL.md`      |
| Working in `packages/shared/` — types, Zod schemas                  | `.claude/skills/aptus-shared/SKILL.md`    |
| Writing tests in any app                                             | `.claude/skills/aptus-testing/SKILL.md`   |
| Turborepo config, turbo.json, pipelines                              | `.claude/skills/aptus-turborepo/SKILL.md` |
| Supabase — auth, queries, RLS, storage                               | `.claude/skills/aptus-supabase/SKILL.md`  |
