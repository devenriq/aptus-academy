---
name: aptus-testing
description: >
  Full TDD strategy for Aptus — Jest, React Testing Library, Playwright and Detox.
  Trigger: When writing tests in any app of the monorepo.
license: Apache-2.0
metadata:
  author: gentleman-programming
  version: "1.0"
---

## When to Use

- Writing any type of test in the project
- Deciding which tool to use for a specific test
- Configuring a new test type

## The Golden Rule

**No production code without a prior failing test.** Flow: red → minimal code → green → refactor.

## Which Tool to Use

| Situation | Tool |
|---|---|
| Pure business logic (use case, utility) | Jest |
| React web component in isolation | Jest + React Testing Library |
| React Native component in isolation | Jest + React Native Testing Library |
| NestJS endpoint (with real test DB) | Jest + Supertest |
| Full flow in browser (web) | Playwright |
| Full flow on device (mobile) | Detox |

## Unit Tests — NestJS Use Cases

```typescript
describe('GetQuestionsUseCase', () => {
  it('should return questions filtered by university', async () => {
    const repo = { findByFilters: jest.fn().mockResolvedValue([mockQ]) };
    const useCase = new GetQuestionsUseCase(repo);
    const result = await useCase.execute({ universityId: 'unsa' });
    expect(result).toHaveLength(1);
  });
});
```

## Component Tests — React (RTL)

```typescript
it('shows correct feedback after answering', async () => {
  render(<QuestionCard question={mockQuestion} />);
  await userEvent.click(screen.getByText('Option A'));
  expect(screen.getByText('Correct!')).toBeInTheDocument();
});
```

## E2E Tests — Playwright

```typescript
test('user can register and access catalog', async ({ page }) => {
  await page.goto('/register');
  await page.fill('[name="email"]', 'test@aptus.pe');
  await page.fill('[name="password"]', 'SecurePass123');
  await page.click('[type="submit"]');
  await expect(page).toHaveURL('/catalog');
});
```

**Flows that MUST have a Playwright test:**
- Full registration + catalog access
- Filter questions and answer in Free Mode
- Complete a Mock Exam and view score
- Trial activation / subscription flow

## Rules

- Use case tests = zero external dependencies (mock everything)
- Integration tests (Supertest) = real test database, never mock the DB
- Playwright tests = staging environment in CI, localhost locally
- Never test implementation details — test observable behavior

## Commands

```bash
cd apps/api && pnpm test
cd apps/web && pnpm test
cd apps/web && pnpm test:e2e
cd apps/mobile && pnpm test
pnpm test                    # full monorepo via Turborepo
```
