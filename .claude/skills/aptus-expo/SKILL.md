---
name: aptus-expo
description: >
  React Native con Expo Router y NativeWind para el proyecto Aptus.
  Trigger: Cuando se trabaja en apps/mobile/ — pantallas, navegación, componentes nativos.
license: Apache-2.0
metadata:
  author: gentleman-programming
  version: "1.0"
---

## Cuando Usar

- Crear pantallas o navegación en `apps/mobile/`
- Agregar componentes React Native, hooks o stores mobile
- Configurar builds con EAS
- Escribir tests de componentes mobile (Jest + RNTL) o E2E (Detox)

## Estructura de Carpetas

```
apps/mobile/
├── app/                     ← Expo Router (file-based routing)
│   ├── (auth)/
│   │   ├── login.tsx
│   │   └── register.tsx
│   ├── (app)/
│   │   ├── catalogo/
│   │   ├── examen/
│   │   └── perfil/
│   └── _layout.tsx
├── components/
│   └── {feature}/
├── hooks/
├── stores/                  ← Zustand (mismo patrón que web)
└── lib/
    └── api/                 ← fetch hacia apps/api
```

## Reglas Críticas

- **Expo Router** para toda la navegación — file-based, igual que Next.js App Router.
- **NativeWind** para estilos — misma sintaxis de Tailwind, pero en React Native.
- **Nunca** usar `StyleSheet.create` — todo via NativeWind clases.
- **Importar tipos y schemas** desde `@aptus/shared`. Nunca redefinirlos.
- **Mismo Zustand store** que web cuando sea posible — la lógica vive en `packages/shared`.
- El público objetivo es **Android de gama baja** — evitar animaciones pesadas, lazy load agresivo.

## Patrón Pantalla + Test

```typescript
// app/(app)/catalogo/index.tsx
import { View, Text } from 'react-native';
import type { Question } from '@aptus/shared';

export default function CatalogoScreen() {
  return (
    <View className="flex-1 p-4">
      <Text className="text-xl font-bold">Catálogo</Text>
    </View>
  );
}

// components/catalogo/question-card.test.tsx
import { render, screen } from '@testing-library/react-native';
import { QuestionCard } from './question-card';

it('renders question text', () => {
  render(<QuestionCard question={mockQuestion} />);
  expect(screen.getByText(mockQuestion.enunciado)).toBeTruthy();
});
```

## Builds con EAS

```json
// eas.json
{
  "build": {
    "development": { "developmentClient": true, "distribution": "internal" },
    "preview": { "distribution": "internal" },
    "production": {}
  }
}
```

- `development` → Expo Go / development build local
- `preview` → APK interno para staging (OTA updates)
- `production` → Play Store / App Store

## Comandos

```bash
cd apps/mobile && pnpm start          # Expo dev server
cd apps/mobile && pnpm test           # Jest + RNTL
eas build --profile preview           # Build de staging
eas build --profile production        # Build de prod
eas update --branch staging           # OTA update a staging
```
