---
name: aptus-nextjs
description: >
  Next.js 14 con App Router, PWA y convenciones para el proyecto Aptus.
  Trigger: Cuando se trabaja en apps/web/ — páginas, componentes, rutas, layouts, PWA.
license: Apache-2.0
metadata:
  author: gentleman-programming
  version: "1.0"
---

## Cuando Usar

- Crear páginas o layouts en `apps/web/`
- Agregar componentes, hooks o stores del cliente
- Escribir tests de componentes web (Jest + RTL) o E2E (Playwright)

## Estructura de Carpetas

```
apps/web/src/
├── app/
│   ├── (auth)/              ← rutas públicas: login, registro
│   ├── (app)/               ← rutas protegidas con layout de app
│   │   ├── catalogo/
│   │   ├── examen/
│   │   └── perfil/
│   └── layout.tsx
├── components/
│   ├── ui/                  ← shadcn/ui — NO editar manualmente
│   └── {feature}/           ← componentes presentacionales por feature
├── hooks/
├── stores/                  ← Zustand, un store por feature
└── lib/
    └── api/                 ← funciones fetch hacia apps/api
```

## Reglas Críticas

- **Server Components por defecto.** Solo `'use client'` cuando hay eventos, estado o hooks del browser.
- **Nunca acceder a DB desde web.** Todo pasa por `apps/api`.
- **shadcn/ui** para componentes base: `npx shadcn@latest add {componente}`. Nunca editar `components/ui/` a mano.
- **Zustand**: un store por feature, no un store global gigante.
- **Importar tipos y schemas** desde `@aptus/shared`. Nunca redefinirlos en web.

## Patrón Componente + Test

```typescript
// components/catalogo/question-card.tsx
import type { Question } from '@aptus/shared';

interface Props { question: Question }

export function QuestionCard({ question }: Props) {
  return <div>{question.enunciado}</div>;
}

// components/catalogo/question-card.test.tsx
import { render, screen } from '@testing-library/react';
import { QuestionCard } from './question-card';

it('renders question text', () => {
  render(<QuestionCard question={mockQuestion} />);
  expect(screen.getByText(mockQuestion.enunciado)).toBeInTheDocument();
});
```

## Tests E2E con Playwright

```typescript
// e2e/catalogo.spec.ts
import { test, expect } from '@playwright/test';

test('student can filter and answer a question', async ({ page }) => {
  await page.goto('/catalogo');
  await page.selectOption('[data-testid="universidad-filter"]', 'UNSA');
  await expect(page.locator('[data-testid="question-card"]')).toBeVisible();
});
```

## PWA

Configurado via `next-pwa`. No modificar el service worker manualmente — se genera en build.
Manifest en `public/manifest.json`.

## Comandos

```bash
cd apps/web && pnpm dev
cd apps/web && pnpm test
cd apps/web && pnpm test:e2e     # Playwright
npx shadcn@latest add {nombre}
```
