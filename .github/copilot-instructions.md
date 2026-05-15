# Copilot Instructions

## Project Overview

This is a **Next.js 15 personal portfolio** site exported as static HTML (`output: 'export'`). It uses React 19, TypeScript 5, and Tailwind CSS v4.

---

## Architecture

The codebase follows a layered architecture with SOLID principles:

```
src/
├── app/              # Next.js App Router (layout, page, global styles)
├── assets/           # Static assets (SVG icons)
├── components/       # UI components organized by Atomic Design
│   ├── atoms/        # Smallest reusable UI primitives
│   ├── molecules/    # Composed atoms (e.g., N8NWorkflow)
│   └── organisms/    # Full sections (Header, Footer, About, Projects, LowCodeProjects)
├── factories/        # ServiceFactory — dependency injection container
├── helpers/          # Pure utility functions and static data (userdata, strings)
├── interfaces/       # TypeScript interfaces for all data shapes
├── lib/              # Next.js server actions (thin wrappers over repositories)
├── repositories/     # Data access layer (GithubRepository, LowCodeRepository)
├── services/         # API clients (GithubApiService, LowCodeApiService)
└── types/            # Global type declarations (.d.ts files)
```

### Data Flow

```
page.tsx → lib/actions.ts → ServiceFactory → Repository → ApiService → external API
```

- **`lib/actions.ts`**: Server actions — entry points consumed by page components.
- **`factories/serviceFactory.ts`**: Singleton factory that wires services into repositories. Supports `set*` and `reset()` methods for test injection.
- **`repositories/`**: Implement repository interfaces; orchestrate API calls and error handling.
- **`services/`**: Implement API service interfaces; handle raw HTTP calls.

---

## Component Conventions

- Components live in `src/components/` under `atoms/`, `molecules/`, or `organisms/`.
- Each component receives a typed props interface from `src/interfaces/`.
- Default exports only — no named component exports.
- Use `"use client"` directive only when browser APIs or client-side state are required (e.g., `N8NWorkflow.tsx`).
- Props interfaces are prefixed with `I` and named `I<ComponentName>Props` (e.g., `IHeaderProps`).

---

## TypeScript Conventions

- All interfaces are prefixed with `I` (e.g., `IGithubRepository`, `IApiResult<T>`).
- Prefer interfaces over types for object shapes.
- Use `as const` for immutable static data (e.g., `userData` in `helpers/userdata.ts`).
- Generic `IApiResult<T>` wraps all API responses: `{ data?: T; error?: IApiError }`.
- Return `IErrorResponse` (`{ error: IApiError }`) on failure; check with `"error" in result`.

---

## Styling

- Tailwind CSS v4 with the `tw:` prefix (configured in `tailwind.config.ts`).
- All Tailwind utility classes must use the `tw:` prefix — e.g., `tw:flex`, `tw:px-4`.
- Responsive variants follow the pattern `tw:lg:grid-cols-3`.
- No CSS Modules; global styles are in `src/app/globals.css`.

---

## Testing

- **Framework**: Jest 30 + React Testing Library 16.
- **Test location**: `src/**/__tests__/` directories, co-located with source modules.
- **File naming**: `<ComponentName>.test.tsx` or `<module>.test.ts`.
- **Coverage thresholds**: branches ≥ 85%, functions ≥ 85%, lines ≥ 95%, statements ≥ 95%.
- Use `screen.getByRole`, `screen.getByText`, etc. — prefer semantic queries.
- Use `expect(element).toBeTruthy()` and attribute assertions (`.getAttribute()`).
- Shared mock data lives in `src/testUtils.ts` (e.g., `mockGithubUser`, `mockGithubRepo`).
- Use `ServiceFactory.set*` / `ServiceFactory.reset()` to inject mock repositories in tests.
- Path alias `@/` maps to `src/`.

### Running Tests

```bash
yarn test                # run once
yarn test:watch      # watch mode
yarn test:coverage   # with coverage report
yarn test:ci         # CI mode (--passWithNoTests)
```

---

## Key Patterns

### Error Handling

Always return structured errors — never throw from services or repositories:

```ts
return { error: { message: "...", status: 400 } };
```

Check errors with:

```ts
if ("error" in result && result.error) { ... }
```

### Dependency Injection

Use `ServiceFactory` to obtain repository instances. For tests, inject mocks via:

```ts
ServiceFactory.setGithubRepository(mockRepo);
// ... run test ...
ServiceFactory.reset();
```

### Static User Data

Personal data (username, contact links, icons) is centralized in `src/helpers/userdata.ts` as a `const` object. Update this file to change portfolio content.

---

## Commands

```bash
yarn dev      # development server (Turbopack)
yarn build    # production build (static export)
yarn lint     # ESLint
yarn test         # Jest
```
