---
name: aptus-supabase
description: >
  Integración de Supabase (Auth + PostgreSQL) en el proyecto Aptus.
  Trigger: Cuando se trabaja con autenticación, queries a Supabase, RLS, o storage.
license: Apache-2.0
metadata:
  author: gentleman-programming
  version: "1.0"
---

## Cuando Usar

- Configurar o modificar autenticación (Supabase Auth + NestJS guard)
- Escribir queries a PostgreSQL via TypeORM
- Configurar Row Level Security (RLS)
- Trabajar con Supabase Storage

## Arquitectura de Auth

```
apps/web / apps/mobile
  → login via Supabase Auth SDK
  → recibe JWT

apps/api (NestJS)
  → SupabaseAuthGuard valida el JWT con SUPABASE_JWT_SECRET
  → inyecta usuario en request.user
  → SubscriptionGuard verifica suscripcion activa o trial vigente
```

## Guard de Auth en NestJS

```typescript
// src/auth/supabase-auth.guard.ts
// Valida JWT con la clave pública de Supabase
// Variables requeridas: SUPABASE_URL, SUPABASE_JWT_SECRET
// Inyecta: request.user = { id, email, ... }
// Nunca reimplementar — importar de src/auth/
```

Aplicar en controllers:
```typescript
@UseGuards(SupabaseAuthGuard)          // solo autenticación
@UseGuards(SupabaseAuthGuard, SubscriptionGuard)  // auth + suscripción activa
```

## Variables de Entorno Requeridas

```bash
# apps/api
SUPABASE_URL=
SUPABASE_JWT_SECRET=
DATABASE_URL=            # connection string de Supabase PostgreSQL

# apps/web / apps/mobile
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

## TypeORM + Supabase PostgreSQL

TypeORM se conecta a la DB de Supabase via `DATABASE_URL`.
Las entidades TypeORM son distintas de las entidades de dominio — viven en `infrastructure/`.

```typescript
// infrastructure/question.typeorm-entity.ts
@Entity('questions')
export class QuestionTypeOrmEntity {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column() enunciado: string;
  @Column() anio: number;
  @Column({ type: 'enum', enum: ['facil', 'medio', 'dificil'] })
  dificultad: string;
  // ...
}
```

## Row Level Security (RLS)

RLS se configura en el panel de Supabase o via migraciones SQL.
Política base para `interactions`: el usuario solo ve sus propias interacciones.

```sql
CREATE POLICY "users_own_interactions"
ON interactions FOR ALL
USING (auth.uid() = usuario_id);
```

## Comandos

```bash
# Supabase CLI local
supabase start           # levanta Supabase localmente (PostgreSQL + Auth + Studio)
supabase db push         # aplica migraciones a staging/prod
supabase gen types       # genera tipos TypeScript desde el schema de la DB
```
