---
name: aptus-nextjs
description: >
  Next.js 14 with App Router, PWA and conventions for the Aptus project.
  Trigger: When working in apps/web/ — pages, components, routes, layouts, PWA.
license: Apache-2.0
metadata:
  author: gentleman-programming
  version: "1.0"
---

## When to Use

- Creating pages or layouts in `apps/web/`
- Adding components, hooks or client stores
- Writing web component tests (Jest + RTL) or E2E tests (Playwright)

## Folder Structure

```
apps/web/src/
├── app/
│   ├── (auth)/              ← public routes: login, register
│   ├── (app)/               ← protected routes with app layout
│   │   ├── catalog/
│   │   ├── exam/
│   │   └── profile/
│   └── layout.tsx
├── components/
│   ├── ui/                  ← shadcn/ui — DO NOT edit manually
│   └── {feature}/           ← presentational components per feature
├── hooks/
├── stores/                  ← Zustand, one store per feature
└── lib/
    └── api/                 ← fetch functions toward apps/api
```

## Critical Rules

- **Server Components by default.** Only add `'use client'` when there are events, state or browser hooks.
- **Never access the DB from web.** Everything goes through `apps/api`.
- **shadcn/ui** for base components: `npx shadcn@latest add {component}`. Never edit `components/ui/` manually.
- **Zustand**: one store per feature, not one giant global store.
- **Import types and schemas** from `@aptus/shared`. Never redefine them in web.

## Component + Test Pattern

```typescript
// components/catalog/question-card.tsx
import type { Question } from '@aptus/shared';

interface Props { question: Question }

export function QuestionCard({ question }: Props) {
  return <div>{question.statement}</div>;
}

// components/catalog/question-card.test.tsx
import { render, screen } from '@testing-library/react';
import { QuestionCard } from './question-card';

it('renders question statement', () => {
  render(<QuestionCard question={mockQuestion} />);
  expect(screen.getByText(mockQuestion.statement)).toBeInTheDocument();
});
```

## E2E Tests with Playwright

```typescript
// e2e/catalog.spec.ts
test('student can filter and answer a question', async ({ page }) => {
  await page.goto('/catalog');
  await page.selectOption('[data-testid="university-filter"]', 'UNSA');
  await expect(page.locator('[data-testid="question-card"]')).toBeVisible();
});
```

## Commands

```bash
cd apps/web && pnpm dev
cd apps/web && pnpm test
cd apps/web && pnpm test:e2e
npx shadcn@latest add {name}
```
