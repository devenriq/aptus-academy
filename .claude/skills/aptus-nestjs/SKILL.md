---
name: aptus-nestjs
description: >
  NestJS with Clean/Hexagonal Architecture for the Aptus project.
  Trigger: When working in apps/api/ — modules, use cases, repositories, guards, entities.
license: Apache-2.0
metadata:
  author: gentleman-programming
  version: "1.0"
---

## When to Use

- Creating a new NestJS module in `apps/api/`
- Adding a use case, repository, or domain entity
- Creating authentication or authorization guards
- Writing API layer tests

## Module Structure

Each module follows Clean Architecture. The domain has no knowledge of the framework.

```
src/modules/{name}/
├── domain/
│   ├── {name}.entity.ts              ← Pure entity, no NestJS/TypeORM decorators
│   └── {name}.repository.ts          ← Repository interface (port)
├── application/
│   └── use-cases/
│       ├── {action}-{name}.use-case.ts
│       └── {action}-{name}.use-case.spec.ts   ← Unit test
├── infrastructure/
│   ├── {name}.typeorm-entity.ts      ← TypeORM entity with decorators
│   ├── {name}.typeorm-repository.ts  ← Repository implementation
│   └── {name}.controller.ts          ← NestJS controller
└── {name}.module.ts
```

## Critical Rules

- **Domain entity has NO decorators** from TypeORM or NestJS. It is a pure TypeScript class.
- **Use cases receive interfaces**, not concrete implementations. Injected by token.
- **Use case tests are pure unit tests** — no database, no HTTP, no NestJS.
- **Controller tests are integration tests** — use `@nestjs/testing` + Supertest.
- **Each use case does ONE thing.** If it does two, split them.

## Use Case Pattern

```typescript
// application/use-cases/get-questions.use-case.ts
export class GetQuestionsUseCase {
  constructor(
    private readonly questionRepository: QuestionRepository,
  ) {}

  async execute(filters: QuestionFilters): Promise<Question[]> {
    return this.questionRepository.findByFilters(filters);
  }
}

// application/use-cases/get-questions.use-case.spec.ts
describe('GetQuestionsUseCase', () => {
  it('should return filtered questions', async () => {
    const mockRepo: QuestionRepository = {
      findByFilters: jest.fn().mockResolvedValue([mockQuestion]),
    };
    const useCase = new GetQuestionsUseCase(mockRepo);
    const result = await useCase.execute({ universityId: '1' });
    expect(result).toHaveLength(1);
  });
});
```

## Authentication Guard (Supabase JWT)

```typescript
// auth/supabase-auth.guard.ts
// Validates Supabase JWT using SUPABASE_JWT_SECRET
// Injects authenticated user into request.user
// Never re-implement — always import from src/auth/
```

## Subscription Guard

```typescript
// auth/subscription.guard.ts
// Verifies user.subscription === 'active' | 'trial' (and trial not expired)
// Applied to all content endpoints (questions, exams)
```

## Commands

```bash
npx nest g module modules/{name}
cd apps/api && pnpm test
cd apps/api && pnpm test:watch
cd apps/api && pnpm test:e2e
```
