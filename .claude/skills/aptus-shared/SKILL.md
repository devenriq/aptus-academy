---
name: aptus-shared
description: >
  Convenciones para packages/shared — tipos TypeScript y schemas Zod compartidos entre web, mobile y API.
  Trigger: Cuando se trabaja en packages/shared/ o se necesita agregar tipos/schemas reutilizables.
license: Apache-2.0
metadata:
  author: gentleman-programming
  version: "1.0"
---

## Cuando Usar

- Agregar un tipo de dominio nuevo
- Agregar un schema Zod de validación
- Mover lógica pura que se repite en más de una app

## Reglas Críticas

- **Solo TypeScript puro** — sin imports de React, NestJS, Next.js, ni cualquier framework.
- **Zod para todos los schemas** — son la fuente de verdad de validación para web, mobile y api.
- **Inferir tipos desde Zod**, no duplicarlos:
  ```typescript
  export const QuestionSchema = z.object({ ... });
  export type Question = z.infer<typeof QuestionSchema>;
  ```
- **Nunca importar desde `apps/`** dentro de este package.
- Todo lo que se exporte debe estar en `src/index.ts`.

## Estructura

```
packages/shared/src/
├── domain/
│   ├── question.ts      ← schema + tipo Question
│   ├── user.ts          ← schema + tipo User
│   ├── exam.ts          ← schema + tipo ExamenSimulado
│   └── interaction.ts   ← schema + tipo Interaccion
├── validation/
│   └── filters.ts       ← schemas de filtros (universidad, materia, año, dificultad)
└── index.ts             ← re-exporta todo
```

## Patrón de Entidad

```typescript
// domain/question.ts
import { z } from 'zod';

export const DifficultySchema = z.enum(['facil', 'medio', 'dificil']);

export const OptionSchema = z.object({
  id: z.string().uuid(),
  texto: z.string().min(1),
});

export const QuestionSchema = z.object({
  id: z.string().uuid(),
  enunciado: z.string().min(1),
  anio: z.number().int().min(2000),
  dificultad: DifficultySchema,
  materiaId: z.string().uuid(),
  opciones: z.array(OptionSchema).length(5),
  opcionCorrectaId: z.string().uuid(),
});

export type Question = z.infer<typeof QuestionSchema>;
export type Difficulty = z.infer<typeof DifficultySchema>;
```

## Cómo Consumir en Otras Apps

```typescript
// En apps/web, apps/mobile o apps/api:
import { type Question, QuestionSchema } from '@aptus/shared';

// Validar datos que llegan de la API:
const question = QuestionSchema.parse(rawData);
```

## Comandos

```bash
cd packages/shared && pnpm test
cd packages/shared && pnpm build
```
