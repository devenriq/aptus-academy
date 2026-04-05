# Aptus — Claude Context

App de estudio para estudiantes preuniversitarios en Perú. Monorepo con web (Next.js PWA), mobile (Expo) y API (NestJS).

## Estructura del Monorepo

```
aptus/
├── apps/
│   ├── web/        ← Next.js 14+ (PWA)
│   ├── mobile/     ← React Native + Expo (Android primero)
│   └── api/        ← NestJS (Clean/Hexagonal Architecture)
├── packages/
│   ├── shared/     ← tipos TypeScript, schemas Zod, lógica de negocio pura
│   └── ui-tokens/  ← design tokens compartidos (colores, tipografía)
└── turbo.json
```

## Stack

| App               | Tecnología clave                                          |
| ----------------- | --------------------------------------------------------- |
| `apps/web`        | Next.js 14, TypeScript, Tailwind, shadcn/ui, Zustand      |
| `apps/mobile`     | Expo SDK, React Native, Expo Router, NativeWind, Zustand  |
| `apps/api`        | NestJS, TypeScript, TypeORM, Supabase (PostgreSQL + Auth) |
| `packages/shared` | TypeScript, Zod                                           |

## Convenciones Globales

- **TypeScript estricto** en todos los packages (`strict: true`)
- **Zod** para validación — los schemas viven en `packages/shared` y se importan desde web, mobile y api
- **Conventional Commits** — `feat:`, `fix:`, `test:`, `refactor:`, `docs:`
- **TDD obligatorio** — ningún código sin test previo. PRs sin tests son rechazados
- **Nunca** importar desde `apps/` dentro de `packages/`
- **Nunca** importar entre apps directamente — toda lógica compartida va a `packages/shared`

## Git y CI/CD

### Branching Strategy — GitHub Flow

```
feature/{nombre} ──→ PR ──→ main ──→ staging (auto-deploy)
                                └──→ prod (deploy en release tag v*.*.*)
```

- Toda tarea nueva arranca desde `main` en una rama `feature/`
- Ningún código llega a `main` sin PR + review
- Merge a `main` dispara deploy automático a **staging**
- Deploy a **prod** solo con tag de release (`git tag v1.0.0`)

### Ambientes

| Ambiente | Rama/Evento | Propósito |
|---|---|---|
| **local** | rama local del developer | Desarrollo activo, datos de prueba |
| **staging** | merge a `main` | QA, demos, validación pre-prod |
| **prod** | release tag `v*.*.*` | Usuarios reales |

Variables de entorno por ambiente:
- `local` → `.env.local` (nunca commiteado al repo)
- `staging` → panel de Vercel + Railway (entorno staging)
- `prod` → panel de Vercel + Railway (entorno prod)

### GitHub Actions (`.github/workflows/`)

Los workflows son archivos YAML en el repo. GitHub los ejecuta automáticamente.

```
.github/workflows/
├── ci.yml       ← corre en cada PR: lint + tests + build
└── deploy.yml   ← corre en merge a main: deploy a staging
```

**`ci.yml`** — se ejecuta en cada PR:
1. Instala dependencias
2. Corre lint en todos los packages
3. Corre tests unitarios + integración (Jest)
4. Corre tests E2E (Playwright) contra un servidor de preview

**`deploy.yml`** — se ejecuta en merge a `main`:
1. Vercel recibe el deploy de `apps/web` automáticamente (integración nativa)
2. Railway/Render recibe el deploy de `apps/api` via webhook o CLI

---

## Autenticación

Supabase Auth emite JWTs. El guard de NestJS los valida con la clave pública de Supabase.
No modificar este flujo sin revisar `apps/api/src/auth/`.

## Modelo de Negocio

- Trial de 7 días al registrarse
- Suscripción mensual vía Culqi
- El campo `usuario.suscripcion` controla el acceso: `trial | activa | inactiva`
- El guard `SubscriptionGuard` en la API protege los endpoints de contenido

## Estrategia de Testing

### Pirámide de Tests

| Capa | Herramienta | Dónde | Qué testea |
|---|---|---|---|
| Unit — dominio/casos de uso | Jest | `apps/api`, `packages/shared` | Lógica pura, sin framework |
| Unit + Component — web | Jest + React Testing Library | `apps/web` | Componentes React en aislamiento |
| Integration — endpoints | Jest + Supertest | `apps/api` | Endpoints HTTP + base de datos real |
| **E2E — web** | **Playwright** | `apps/web` | Flujos completos en browser real |
| Unit + Component — mobile | Jest + React Native Testing Library | `apps/mobile` | Componentes RN en aislamiento |
| E2E — mobile | Detox | `apps/mobile` | Flujos completos en dispositivo/emulador |

### Rol de Playwright en el proyecto

Playwright cubre la capa E2E de `apps/web`. Complementa a Jest + RTL (que testean componentes en aislamiento). No reemplaza los tests unitarios.

**Flujos que DEBEN tener test Playwright:**
- Registro y login completo
- Navegación y filtrado del catálogo
- Responder una pregunta en Modo Libre
- Completar un Examen Simulado y ver puntaje
- Flujo de suscripción / activación de trial

**Cuándo usar Playwright vs Jest + RTL:**

| Situación | Herramienta |
|---|---|
| Testear que un componente renderiza correctamente | Jest + RTL |
| Testear que un hook retorna el valor correcto | Jest |
| Testear que el usuario puede registrarse y acceder al catálogo | Playwright |
| Testear un flujo que cruza múltiples páginas | Playwright |

### Reglas TDD

- Ningún código de producción sin test previo
- Los tests de casos de uso (`apps/api`) son **siempre unitarios puros** — sin base de datos, sin HTTP
- Los tests Playwright se escriben para flujos críticos, no para cada pantalla
- PRs sin tests correspondientes son rechazados en CI

---

## Referencia

- Plan completo: [PLAN.md](PLAN.md)

## Skills (Auto-load based on context)

Cuando detectes cualquiera de estos contextos, leé el skill correspondiente ANTES de escribir código.

| Contexto                                                                | Leer este archivo                                  |
| ----------------------------------------------------------------------- | -------------------------------------------------- |
| Trabajando en `apps/api/` — NestJS, módulos, casos de uso, repositorios | `.claude/skills/aptus-nestjs/SKILL.md`    |
| Trabajando en `apps/web/` — Next.js, componentes, rutas, PWA            | `.claude/skills/aptus-nextjs/SKILL.md`    |
| Trabajando en `apps/mobile/` — Expo, React Native, NativeWind           | `.claude/skills/aptus-expo/SKILL.md`      |
| Trabajando en `packages/shared/` — tipos, schemas Zod                   | `.claude/skills/aptus-shared/SKILL.md`    |
| Escribiendo tests en cualquier app                                      | `.claude/skills/aptus-testing/SKILL.md`   |
| Configuración de Turborepo, turbo.json, pipelines                       | `.claude/skills/aptus-turborepo/SKILL.md` |
| Supabase — auth, queries, RLS, storage                                  | `.claude/skills/aptus-supabase/SKILL.md`  |
