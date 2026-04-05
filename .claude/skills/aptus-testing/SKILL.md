---
name: aptus-testing
description: >
  Estrategia TDD completa para Aptus — Jest, React Testing Library, Playwright y Detox.
  Trigger: Cuando se escriben tests en cualquier app del monorepo.
license: Apache-2.0
metadata:
  author: gentleman-programming
  version: "1.0"
---

## Cuando Usar

- Escribir cualquier tipo de test en el proyecto
- Decidir qué herramienta usar para un test específico
- Configurar un nuevo tipo de test

## La Regla de Oro

**Ningún código de producción sin un test previo que falle.** El flujo es siempre: test rojo → código mínimo → test verde → refactor.

## Qué Herramienta Usar

| Situación | Herramienta |
|---|---|
| Lógica de negocio pura (caso de uso, utilidad) | Jest |
| Componente React web en aislamiento | Jest + React Testing Library |
| Componente React Native en aislamiento | Jest + React Native Testing Library |
| Endpoint NestJS (con DB real de test) | Jest + Supertest |
| Flujo completo en browser (web) | Playwright |
| Flujo completo en dispositivo (mobile) | Detox |

## Tests Unitarios — Casos de Uso NestJS

```typescript
// SIEMPRE unitarios puros — sin NestJS, sin DB, sin HTTP
describe('GetQuestionsUseCase', () => {
  it('should return questions filtered by university', async () => {
    const repo = { findByFilters: jest.fn().mockResolvedValue([mockQ]) };
    const useCase = new GetQuestionsUseCase(repo);
    const result = await useCase.execute({ universityId: 'unsa' });
    expect(repo.findByFilters).toHaveBeenCalledWith({ universityId: 'unsa' });
    expect(result).toHaveLength(1);
  });
});
```

## Tests de Componente — React (RTL)

```typescript
// Testear comportamiento, no implementación
it('shows correct feedback after answering', async () => {
  render(<QuestionCard question={mockQuestion} />);
  await userEvent.click(screen.getByText('Opción A'));
  expect(screen.getByText('Correcto')).toBeInTheDocument();
});
```

## Tests E2E — Playwright (flujos críticos web)

```typescript
// e2e/auth.spec.ts
test('user can register and access catalog', async ({ page }) => {
  await page.goto('/register');
  await page.fill('[name="email"]', 'test@aptus.pe');
  await page.fill('[name="password"]', 'SecurePass123');
  await page.click('[type="submit"]');
  await expect(page).toHaveURL('/catalogo');
});
```

**Flujos que DEBEN tener test Playwright:**
- Registro completo + acceso al catálogo
- Filtrar preguntas y responder en Modo Libre
- Completar un Examen Simulado y ver puntaje
- Flujo de activación de trial / suscripción

## Reglas

- Tests de casos de uso = **cero dependencias externas** (mock todo)
- Tests de integración (Supertest) = **base de datos de test real**, nunca mock de DB
- Tests Playwright = **ambiente de staging** en CI, localhost en local
- Nunca testear detalles de implementación — testear comportamiento observable
- Un `describe` por clase/componente, un `it` por comportamiento

## Comandos

```bash
# API
cd apps/api && pnpm test              # unit + integration
cd apps/api && pnpm test:e2e          # e2e API

# Web
cd apps/web && pnpm test              # Jest + RTL
cd apps/web && pnpm test:e2e          # Playwright

# Mobile
cd apps/mobile && pnpm test           # Jest + RNTL

# Monorepo completo
pnpm test                             # corre todos via Turborepo
```
