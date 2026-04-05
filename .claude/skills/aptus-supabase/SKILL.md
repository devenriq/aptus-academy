---
name: aptus-supabase
description: >
  Supabase integration (Auth + PostgreSQL) for the Aptus project.
  Trigger: When working with authentication, Supabase queries, RLS, or storage.
license: Apache-2.0
metadata:
  author: gentleman-programming
  version: "1.0"
---

## When to Use

- Configuring or modifying authentication (Supabase Auth + NestJS guard)
- Writing PostgreSQL queries via TypeORM
- Configuring Row Level Security (RLS)
- Working with Supabase Storage

## Auth Architecture

```
apps/web / apps/mobile
  → login via Supabase Auth SDK
  → receives JWT

apps/api (NestJS)
  → SupabaseAuthGuard validates JWT with SUPABASE_JWT_SECRET
  → injects user into request.user
  → SubscriptionGuard verifies active subscription or valid trial
```

## NestJS Auth Guard

```typescript
// src/auth/supabase-auth.guard.ts
// Validates JWT with Supabase public key
// Required env vars: SUPABASE_URL, SUPABASE_JWT_SECRET
// Injects: request.user = { id, email, ... }
// Never re-implement — import from src/auth/
```

Apply in controllers:
```typescript
@UseGuards(SupabaseAuthGuard)
@UseGuards(SupabaseAuthGuard, SubscriptionGuard)
```

## Required Environment Variables

```bash
# apps/api
SUPABASE_URL=
SUPABASE_JWT_SECRET=
DATABASE_URL=

# apps/web / apps/mobile
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

## TypeORM Entity Pattern

```typescript
// infrastructure/question.typeorm-entity.ts
@Entity('questions')
export class QuestionTypeOrmEntity {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column() statement: string;
  @Column() year: number;
  @Column({ type: 'enum', enum: ['easy', 'medium', 'hard'] })
  difficulty: string;
}
```

## Row Level Security (RLS)

```sql
-- Users can only see their own interactions
CREATE POLICY "users_own_interactions"
ON interactions FOR ALL
USING (auth.uid() = user_id);
```

## Commands

```bash
supabase start
supabase db push
supabase gen types
```
