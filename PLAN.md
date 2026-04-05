# Aptus — Documento de Planificación

> Estado: Planificación en curso  
> Fecha: 2026-04-05  
> Mercado objetivo: Perú

---

## 1. Visión General

Aplicación de estudio orientada a estudiantes preuniversitarios que buscan prepararse para los exámenes de admisión a universidades peruanas (UNSA, Católica, y otras). El producto central es un catálogo extenso de preguntas modelo organizadas y filtradas por múltiples criterios.

---

## 2. Roadmap de Versiones

| Versión | Descripción |
|---|---|
| **V1** | Repositorio de preguntas + perfiles de usuario + interacciones + pagos |
| **V2** | Seguimiento molecular del progreso del estudiante (estadísticas avanzadas, rendimiento por área) |
| **V3** | Integración de IA como coach personalizado del estudiante |

---

## 3. Funcionalidades de V1

### 3.1 Catálogo de Preguntas

- Preguntas de opción múltiple con **5 alternativas** (una correcta)
- El contenido es cargado y gestionado exclusivamente por el equipo de desarrollo
- Cada pregunta se organiza por:
  - **Universidad** (UNSA, Católica, etc.)
  - **Materia** (Matemáticas, Física, Historia, etc.)
  - **Año del examen**
  - **Nivel de dificultad** (Fácil, Medio, Difícil)
- El estudiante puede filtrar preguntas por cualquier combinación de estos criterios

### 3.2 Sistema de Dificultad (Híbrido)

- **V1**: el equipo asigna el nivel manualmente al subir cada pregunta
- El modelo de datos guarda desde V1 todas las interacciones por pregunta (% de respuestas correctas, tiempo promedio)
- **V2**: el sistema recalcula la dificultad automáticamente con base en datos reales de usuarios
- Campo de dificultad editable para ajustes manuales posteriores

### 3.3 Modos de Interacción

#### Modo Libre
- El estudiante navega el catálogo y responde preguntas individuales
- Recibe feedback inmediato (correcto / incorrecto)
- Su respuesta queda registrada en su perfil

#### Modo Examen Simulado
- El estudiante selecciona un conjunto de preguntas (por ejemplo: "Examen UNSA 2023 — Matemáticas")
- Resuelve el examen completo
- Al finalizar recibe su puntaje y un resumen de resultados
- Las respuestas quedan registradas en su perfil

### 3.4 Perfil de Usuario

- Registro e inicio de sesión (email/contraseña, posiblemente Google OAuth)
- El perfil almacena **toda la interacción del estudiante** con la app:
  - Preguntas respondidas (correctas e incorrectas)
  - Exámenes simulados realizados con sus puntajes
  - Preguntas marcadas para revisar después
- El estudiante puede volver a cualquier pregunta que respondió previamente

### 3.5 Modelo de Negocio y Pagos

- **7 días de prueba gratuita** al registrarse
- Luego de la prueba, acceso de pago (suscripción mensual)
- Procesador de pagos: **Culqi**
  - Acepta tarjetas de crédito/débito nacionales e internacionales
  - Acepta **Yape** (a implementar cuando esté disponible)
  - Acepta PagoEfectivo
- Integración con recurrencia automática donde sea posible; cobro manual mensual como alternativa para Yape

### 3.6 Gestión de Contenido (Admin)

- Panel de administración mediante **Directus** (self-hosted)
- El equipo de desarrollo sube, edita y organiza preguntas desde Directus
- Directus se conecta directamente a la base de datos PostgreSQL
- No requiere desarrollo de panel admin custom en V1

---

## 4. Plataformas

| Plataforma | Tecnología | Estado |
|---|---|---|
| Web (PWA) | Next.js | V1 — desde el inicio |
| Android | React Native + Expo | V1 — desde el inicio (monorepo) |
| iOS | React Native + Expo | Post-V1 |

### Nota sobre PWA
La app web se construye como **Progressive Web App (PWA)**, lo que permite a usuarios de Android instalarla desde el navegador sin pasar por Play Store. Cubre el segmento de dispositivos de gama baja desde el primer día.

### Mobile desde el inicio
La app mobile (Android) se desarrolla en paralelo con la web desde el primer sprint, dentro del mismo monorepo. Comparten tipos, schemas de validación y lógica de negocio pura a través del paquete `packages/shared`.

---

## 5. Stack Tecnológico

### Estructura del Repositorio (Monorepo — Turborepo)

```
aptus/
├── apps/
│   ├── web/          ← Next.js (PWA)
│   ├── mobile/       ← React Native + Expo
│   └── api/          ← NestJS
├── packages/
│   ├── shared/       ← tipos TypeScript, schemas Zod, lógica de negocio pura
│   └── ui-tokens/    ← design tokens compartidos (colores, tipografía)
└── turbo.json
```

### Web (`apps/web`)
| Tecnología | Rol |
|---|---|
| Next.js 14+ + TypeScript | Framework web / PWA |
| Tailwind CSS + shadcn/ui | Sistema de diseño y componentes |
| Zustand | Estado global del cliente |
| React Hook Form + Zod | Formularios y validación |

### Mobile (`apps/mobile`)
| Tecnología | Rol |
|---|---|
| React Native + Expo + TypeScript | Framework mobile (Android / iOS) |
| Expo Router | Navegación basada en archivos |
| NativeWind | Tailwind para React Native |
| Zustand | Estado global (compartido con web via `packages/shared`) |

### API (`apps/api`)
| Tecnología | Rol |
|---|---|
| NestJS + TypeScript | API REST |
| Supabase Auth | Autenticación (email/contraseña, Google OAuth) |
| Supabase (PostgreSQL) | Base de datos + Storage |
| TypeORM | ORM para acceso a datos |
| Directus (self-hosted) | Panel de gestión de contenido |
| Culqi SDK | Procesamiento de pagos |

### Shared (`packages/shared`)
| Contenido | Descripción |
|---|---|
| Tipos de dominio | `Question`, `User`, `Exam`, etc. |
| Schemas Zod | Validación compartida entre web, mobile y API |
| Utilidades puras | Funciones sin dependencias de framework |

### Infraestructura
| Servicio | Qué hostea | Costo estimado |
|---|---|---|
| Vercel | Next.js | Gratis (plan hobby / starter) |
| Railway o Render | NestJS + Directus | ~$10–20/mes |
| Supabase | PostgreSQL + Auth | Gratis hasta cierto volumen |
| Culqi | — | Comisión por transacción |

**Costo de infraestructura en V1: prácticamente $0 hasta escalar.**

---

## 6. Modelo de Datos (Entidades Principales)

```
Universidad
  ├── id
  ├── nombre
  └── Materias[]

Materia
  ├── id
  ├── nombre
  ├── universidadId
  └── Preguntas[]

Pregunta
  ├── id
  ├── enunciado
  ├── año
  ├── dificultad (fácil | medio | difícil)
  ├── materiaId
  ├── Opciones[] (5)
  └── opcionCorrectaId

Opcion
  ├── id
  ├── texto
  └── preguntaId

Usuario
  ├── id
  ├── email
  ├── nombre
  ├── suscripcion (activa | trial | inactiva)
  ├── fechaFinTrial
  └── Interacciones[]

Interaccion
  ├── id
  ├── usuarioId
  ├── preguntaId
  ├── opcionSeleccionadaId
  ├── esCorrecta
  ├── tiempoRespuesta (segundos)
  └── creadoEn

ExamenSimulado
  ├── id
  ├── usuarioId
  ├── filtrosUsados (universidad, materia, año)
  ├── puntaje
  ├── totalPreguntas
  └── Interacciones[]
```

---

## 7. Módulos de la Aplicación (V1)

1. **Auth** — registro, login, recuperación de contraseña, trial de 7 días
2. **Catálogo** — listado y filtrado de preguntas
3. **Modo Libre** — responder pregunta individual con feedback
4. **Modo Examen** — simulacro con puntaje final
5. **Perfil** — historial de interacciones, preguntas guardadas
6. **Pagos** — integración Culqi, gestión de suscripción
7. **Admin (Directus)** — CRUD de universidades, materias, preguntas

---

## 8. Lo que NO entra en V1

- Seguimiento estadístico avanzado por área o materia (V2)
- Recomendaciones personalizadas (V2)
- Coach con IA (V3)
- App nativa iOS (posterior a Android)
- Tablero de rankings o gamificación
- Contenido multimedia en preguntas (imágenes, fórmulas renderizadas) — a evaluar

---

## 9. Autenticación

### Estrategia
**Supabase Auth** como capa de autenticación principal.

- Incluido en Supabase — sin servicio adicional ni costo extra
- Soporta email/contraseña y Google OAuth
- Emite JWTs validados en NestJS mediante un guard propio
- Open source y self-hosteable si en algún momento se requiere salir de Supabase Cloud

```
Usuario → Supabase Auth → JWT → NestJS Guard → API protegida
```

### Flujo de autenticación
1. Registro con email/contraseña → verificación de email
2. Login → JWT de Supabase
3. Cada request a la API lleva el JWT en el header `Authorization`
4. NestJS Guard valida el JWT con la clave pública de Supabase
5. El trial de 7 días se gestiona como campo en la tabla `Usuario`

### Alternativa registrada
Si en algún momento se requiere control total sin Supabase: migrar a JWT custom en NestJS con `@nestjs/passport` + `@nestjs/jwt`. El contrato de la API no cambia.

---

## 10. Estrategia de Testing (TDD)

El proyecto se construye con orientación **Test-First** desde el primer commit. Ningún código de producción se escribe sin un test previo que lo justifique.

### Stack de testing por capa

| Capa | Herramienta | Tipo |
|---|---|---|
| `apps/api` (NestJS) | Jest + Supertest | Unit + Integration + E2E |
| `apps/web` (Next.js) | Jest + React Testing Library + Playwright | Unit + Component + E2E |
| `apps/mobile` (Expo) | Jest + React Native Testing Library + Detox | Unit + Component + E2E |
| `packages/shared` | Jest | Unit puro |

### Arquitectura que habilita TDD
Se aplica **Clean Architecture / Hexagonal** en la capa de API: el core de negocio (casos de uso, entidades) está completamente aislado del framework NestJS. Esto hace que la lógica de negocio sea trivialmente testeable sin levantar un servidor.

### Reglas del proyecto
- Todo PR debe incluir tests para el código nuevo
- Cobertura mínima definida por módulo (a determinar antes del primer sprint)
- CI rechaza PRs que bajen la cobertura establecida

---

## 11. Decisiones Técnicas Registradas

| Decisión | Alternativa descartada | Motivo |
|---|---|---|
| Nombre: **Aptus** | Ingresa, Admítico | Limpio, profesional, del latín *aptus* (apto, preparado). Escala a otros países de LATAM. |
| Monorepo con Turborepo | Repos separados | Mobile entra desde el inicio; compartir tipos y lógica requiere un solo repositorio |
| Mobile desde V1 | Mobile post-lanzamiento | El público objetivo es mayormente Android; presencia mobile temprana reduce deuda técnica futura |
| Supabase Auth | Keycloak, JWT custom | Incluida en Supabase sin costo extra; open source y self-hosteable; suficiente para V1-V3 |
| Clean Architecture en API | CRUD directo con NestJS | TDD requiere lógica de negocio desacoplada del framework para ser testeable sin servidor |
| Supabase en lugar de Firebase | Firebase / Firestore | Los datos son relacionales; queries complejas con múltiples filtros son dolorosas en NoSQL |
| Directus en lugar de Sanity | Sanity CMS | Sanity es para contenido editorial; Directus conecta directamente a PostgreSQL — un solo origen de datos |
| Culqi en lugar de Stripe | Stripe | Mercado peruano; soporte nativo de Yape y métodos de pago locales |
| Dificultad híbrida | Solo manual / Solo automático | Manual en V1 con datos listos para auto-cálculo en V2 |
