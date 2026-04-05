---
name: aptus-expo
description: >
  React Native with Expo Router and NativeWind for the Aptus project.
  Trigger: When working in apps/mobile/ — screens, navigation, native components.
license: Apache-2.0
metadata:
  author: gentleman-programming
  version: "1.0"
---

## When to Use

- Creating screens or navigation in `apps/mobile/`
- Adding React Native components, hooks or mobile stores
- Configuring builds with EAS
- Writing mobile component tests (Jest + RNTL) or E2E tests (Detox)

## Folder Structure

```
apps/mobile/
├── app/
│   ├── (auth)/
│   │   ├── login.tsx
│   │   └── register.tsx
│   ├── (app)/
│   │   ├── catalog/
│   │   ├── exam/
│   │   └── profile/
│   └── _layout.tsx
├── components/
│   └── {feature}/
├── hooks/
├── stores/
└── lib/
    └── api/
```

## Critical Rules

- **Expo Router** for all navigation — file-based, same as Next.js App Router.
- **NativeWind** for styles — same Tailwind syntax, but in React Native.
- **Never** use `StyleSheet.create` — everything via NativeWind classes.
- **Import types and schemas** from `@aptus/shared`. Never redefine them.
- Target audience is **low-end Android** — avoid heavy animations, use aggressive lazy loading.

## Screen + Test Pattern

```typescript
// app/(app)/catalog/index.tsx
import { View, Text } from 'react-native';

export default function CatalogScreen() {
  return (
    <View className="flex-1 p-4">
      <Text className="text-xl font-bold">Catalog</Text>
    </View>
  );
}

// components/catalog/question-card.test.tsx
import { render, screen } from '@testing-library/react-native';

it('renders question statement', () => {
  render(<QuestionCard question={mockQuestion} />);
  expect(screen.getByText(mockQuestion.statement)).toBeTruthy();
});
```

## EAS Builds

```json
{
  "build": {
    "development": { "developmentClient": true, "distribution": "internal" },
    "preview": { "distribution": "internal" },
    "production": {}
  }
}
```

## Commands

```bash
cd apps/mobile && pnpm start
cd apps/mobile && pnpm test
eas build --profile preview
eas build --profile production
eas update --branch staging
```
