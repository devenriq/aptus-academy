---
name: aptus-turborepo
description: >
  Configuración y convenciones del monorepo Aptus con Turborepo.
  Trigger: Cuando se configura turbo.json, se agregan packages, o se trabaja con el pipeline del monorepo.
license: Apache-2.0
metadata:
  author: gentleman-programming
  version: "1.0"
---

## Cuando Usar

- Modificar `turbo.json` o pipelines de build/test
- Agregar un nuevo package a `packages/`
- Configurar dependencias entre apps/packages
- Debuggear por qué un comando no corre en el orden esperado

## Estructura del Monorepo

```
aptus/
├── apps/
│   ├── web/          ← Next.js (depende de @aptus/shared)
│   ├── mobile/       ← Expo (depende de @aptus/shared)
│   └── api/          ← NestJS (depende de @aptus/shared)
├── packages/
│   ├── shared/       ← @aptus/shared (sin dependencias internas)
│   └── ui-tokens/    ← @aptus/ui-tokens (sin dependencias internas)
├── turbo.json
├── package.json      ← workspace root
└── pnpm-workspace.yaml
```

## Reglas Críticas

- **`packages/` nunca importa desde `apps/`** — el flujo de dependencias es unidireccional.
- **`packages/shared` se buildea primero** — las apps dependen de él.
- Usar **pnpm workspaces** para gestión de dependencias.
- Agregar dependencias internas como: `"@aptus/shared": "workspace:*"`

## turbo.json base

```json
{
  "$schema": "https://turbo.build/schema.json",
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "dist/**"]
    },
    "test": {
      "dependsOn": ["^build"],
      "outputs": ["coverage/**"]
    },
    "test:e2e": {
      "dependsOn": ["^build"]
    },
    "lint": {},
    "dev": {
      "cache": false,
      "persistent": true
    }
  }
}
```

`"dependsOn": ["^build"]` significa: buildear las dependencias primero.

## Agregar un Nuevo Package

```bash
mkdir packages/nuevo-package
cd packages/nuevo-package
pnpm init
# Nombre en package.json: "@aptus/nuevo-package"
```

Luego en el `package.json` de la app que lo consume:
```json
{ "dependencies": { "@aptus/nuevo-package": "workspace:*" } }
```

## Comandos

```bash
pnpm dev              # corre todas las apps en paralelo
pnpm build            # build completo respetando dependencias
pnpm test             # tests en todos los packages
pnpm lint             # lint en todos los packages

# Solo una app:
pnpm --filter @aptus/web dev
pnpm --filter @aptus/api test
```
