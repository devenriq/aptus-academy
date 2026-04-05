---
name: aptus-shared
description: >
  Conventions for packages/shared — TypeScript types and Zod schemas shared between web, mobile and API.
  Trigger: When working in packages/shared/ or when adding reusable types/schemas.
license: Apache-2.0
metadata:
  author: gentleman-programming
  version: "1.0"
---

## When to Use

- Adding a new domain type
- Adding a Zod validation schema
- Moving pure logic repeated in more than one app

## Critical Rules

- **Pure TypeScript only** — no imports from React, NestJS, Next.js, or any framework.
- **Zod for all schemas** — single source of truth for validation across web, mobile and api.
- **Infer types from Zod**, do not duplicate them:
  ```typescript
  export const QuestionSchema = z.object({ ... });
  export type Question = z.infer<typeof QuestionSchema>;
  ```
- **Never import from `apps/`** inside this package.
- Everything exported must be in `src/index.ts`.

## Entity Pattern

```typescript
// domain/question.ts
import { z } from 'zod';

export const DifficultySchema = z.enum(['easy', 'medium', 'hard']);

export const QuestionSchema = z.object({
  id: z.string().uuid(),
  statement: z.string().min(1),
  year: z.number().int().min(2000),
  difficulty: DifficultySchema,
  subjectId: z.string().uuid(),
  options: z.array(OptionSchema).length(5),
  correctOptionId: z.string().uuid(),
});

export type Question = z.infer<typeof QuestionSchema>;
```

## How to Consume in Other Apps

```typescript
import { type Question, QuestionSchema } from '@aptus/shared';

const question = QuestionSchema.parse(rawData);
```

## Commands

```bash
cd packages/shared && pnpm test
cd packages/shared && pnpm build
```
