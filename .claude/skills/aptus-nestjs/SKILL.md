---
name: aptus-nestjs
description: >
  NestJS con Clean/Hexagonal Architecture para el proyecto Aptus.
  Trigger: Cuando se trabaja en apps/api/ — módulos, casos de uso, repositorios, guards, entidades.
license: Apache-2.0
metadata:
  author: gentleman-programming
  version: "1.0"
---

## Cuando Usar

- Crear un nuevo módulo NestJS en `apps/api/`
- Agregar un caso de uso, repositorio, o entidad de dominio
- Crear guards de autenticación o autorización
- Escribir tests de la capa API

## Estructura de un Módulo

Cada módulo sigue Clean Architecture. El dominio no conoce al framework.

```
src/modules/{nombre}/
├── domain/
│   ├── {nombre}.entity.ts          ← Entidad pura, sin decoradores NestJS/TypeORM
│   └── {nombre}.repository.ts      ← Interface del repositorio (puerto)
├── application/
│   └── use-cases/
│       ├── {accion}-{nombre}.use-case.ts
│       └── {accion}-{nombre}.use-case.spec.ts   ← Test unitario
├── infrastructure/
│   ├── {nombre}.typeorm-entity.ts  ← Entidad TypeORM con decoradores
│   ├── {nombre}.typeorm-repository.ts  ← Implementación del repositorio
│   └── {nombre}.controller.ts      ← Controller NestJS
└── {nombre}.module.ts
```

## Reglas Críticas

- **La entidad de dominio NO tiene decoradores** de TypeORM ni NestJS. Es una clase TypeScript pura.
- **Los casos de uso reciben interfaces**, no implementaciones concretas. Inyección por token.
- **Los tests de casos de uso son unitarios puros** — sin base de datos, sin HTTP, sin NestJS.
- **Los tests de controller son de integración** — usan `@nestjs/testing` + Supertest.
- **Cada caso de uso hace UNA sola cosa.** Si hace dos, separarlos.

## Patrón de Caso de Uso

```typescript
// application/use-cases/get-questions.use-case.ts
export class GetQuestionsUseCase {
  constructor(
    private readonly questionRepository: QuestionRepository, // interface
  ) {}

  async execute(filters: GetQuestionsFilters): Promise<Question[]> {
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

## Guard de Autenticación (Supabase JWT)

```typescript
// auth/supabase-auth.guard.ts
// Valida el JWT de Supabase con la clave pública SUPABASE_JWT_SECRET
// Inyecta el usuario en request.user
// Nunca reimplementar — siempre importar de src/auth/
```

## Guard de Suscripción

```typescript
// auth/subscription.guard.ts
// Verifica que usuario.suscripcion === 'activa' | 'trial' (y trial no expirado)
// Aplica en todos los endpoints de contenido (preguntas, exámenes)
```

## Comandos

```bash
# Generar módulo
npx nest g module modules/{nombre}

# Correr tests de la API
cd apps/api && pnpm test

# Correr tests en watch
cd apps/api && pnpm test:watch

# Correr e2e
cd apps/api && pnpm test:e2e
```

## Recursos

- Plan del proyecto: [PLAN.md](../../../WebDev/Work/Freelance/aptus/PLAN.md)
