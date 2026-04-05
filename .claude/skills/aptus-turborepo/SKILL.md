---
name: aptus-turborepo
description: >
  Configuration and conventions for the Aptus monorepo with Turborepo.
  Trigger: When configuring turbo.json, adding packages, or working with the monorepo pipeline.
license: Apache-2.0
metadata:
  author: gentleman-programming
  version: "1.0"
---

## When to Use

- Modifying `turbo.json` or build/test pipelines
- Adding a new package to `packages/`
- Configuring dependencies between apps/packages
- Debugging pipeline execution order

## Monorepo Structure

```
aptus/
├── apps/
│   ├── web/          ← Next.js (depends on @aptus/shared)
│   ├── mobile/       ← Expo (depends on @aptus/shared)
│   └── api/          ← NestJS (depends on @aptus/shared)
├── packages/
│   ├── shared/       ← @aptus/shared (no internal deps)
│   └── ui-tokens/    ← @aptus/ui-tokens (no internal deps)
├── turbo.json
└── pnpm-workspace.yaml
```

## Critical Rules

- **`packages/` never imports from `apps/`** — unidirectional dependency flow.
- **`packages/shared` builds first** — apps depend on it.
- Add internal dependencies as: `"@aptus/shared": "workspace:*"`

## turbo.json Base

```json
{
  "$schema": "https://turbo.build/schema.json",
  "pipeline": {
    "build": { "dependsOn": ["^build"], "outputs": [".next/**", "dist/**"] },
    "test": { "dependsOn": ["^build"], "outputs": ["coverage/**"] },
    "test:e2e": { "dependsOn": ["^build"] },
    "lint": {},
    "dev": { "cache": false, "persistent": true }
  }
}
```

## Adding a New Package

```bash
mkdir packages/new-package && cd packages/new-package && pnpm init
# Set name in package.json: "@aptus/new-package"
```

In consuming app's `package.json`:
```json
{ "dependencies": { "@aptus/new-package": "workspace:*" } }
```

## Commands

```bash
pnpm dev
pnpm build
pnpm test
pnpm lint
pnpm --filter @aptus/web dev
pnpm --filter @aptus/api test
```
