# Copilot Instructions

## Project Overview

This is a **Next.js 16.2.6 personal portfolio** site exported as static HTML (`output: 'export'`). It uses React 19.2.6, TypeScript 5, and Tailwind CSS v4.

---

## Architecture

The codebase follows a layered architecture with SOLID principles:

```
src/
├── app/              # Next.js App Router (layout, page, globals.css, robots.ts, sitemap.ts, icon.tsx, apple-icon.tsx, opengraph-image.tsx, twitter-image.tsx)
├── assets/           # Static assets (SVG icons: email, linkedin, github — light & dark variants)
├── components/       # UI components organized by Atomic Design
│   ├── atoms/        # WebsiteCard.tsx, WebsiteSlide.tsx
│   ├── molecules/    # N8NWorkflow.tsx
│   └── organisms/    # Header, Footer, About, Projects, LowCodeProjects, WebsiteProjects
├── factories/        # ServiceFactory — dependency injection container
├── helpers/          # Pure utility functions and static data
│   ├── pageData.ts   # buildPageData() — orchestrates data fetching
│   ├── strings.ts    # capitalizeFirstLetter()
│   ├── userdata.ts   # userData const (username, profileName, siteUrl, contact)
│   ├── websitedata.ts # websiteProjects array
│   └── websiteCardAnimation.ts # Animation constants and keyframe builder for WebsiteCard
├── interfaces/       # TypeScript interfaces for all data shapes
│   ├── index.ts      # IData (top-level page data shape; header.title is a string literal type)
│   ├── about.ts      # IAboutProps
│   ├── actions.ts    # IGetGithubRawFileProps
│   ├── footer.ts     # IFooterProps (username, profileName, contact), IContactItem, IContact, UserDataContact
│   ├── github.ts     # IGithubUserData, IGithubUserRepo
│   ├── header.ts     # IHeaderProps
│   ├── low-code-projects.ts  # ILowCodeProject, ILowCodeProjectsProps
│   ├── projects.ts   # IProjectsProps
│   ├── services.ts   # IGithubApiService, ILowCodeApiService, IGithubRepository, ILowCodeRepository, IApiResult<T>, IApiError, IErrorResponse, IGithubDataResponse
│   └── website-projects.ts  # IWebsiteProject, IWebsiteProjectsProps, IWebsiteSlideProps
├── lib/              # Next.js server actions (thin wrappers over repositories)
├── repositories/     # Data access layer (GithubRepository, LowCodeRepository)
├── services/         # API clients (GithubApiService, LowCodeApiService)
├── testUtils.ts      # Shared mock data: mockGithubUser, mockGithubRepo, mockLowCodeProject
└── types/            # Global type declarations (svg.d.ts)
```

### Data Flow

```
page.tsx → helpers/pageData.ts (buildPageData) → lib/actions.ts → ServiceFactory → Repository → ApiService → external API
```

- **`helpers/pageData.ts`**: `buildPageData(username, profileName)` — uses `Promise.allSettled` to call `getGithubData` and `getGithubRawFile` in parallel, then shapes the `IData` object. Dynamically adds nav sections (`About`, `Website Projects`, `Projects`, `Contact`) based on what data is available.
- **`lib/actions.ts`**: Server actions — `getGithubData`, `getGithubUserData`, `getGithubUserRepos`, `getGithubRawFile`, `getLowCodeProjects`. Thin wrappers over `ServiceFactory`.
- **`factories/serviceFactory.ts`**: Singleton factory that lazily instantiates and caches repository instances. Supports `setGithubRepository`, `setLowCodeRepository`, and `reset()` for test injection.
- **`repositories/dataRepositories.ts`**: `GithubRepository`, `LowCodeRepository` — implement repository interfaces; orchestrate API calls and error handling.
- **`services/apiServices.ts`**: `GithubApiService` (fetches `api.github.com` and `raw.githubusercontent.com`), `LowCodeApiService` — implement API service interfaces; handle raw HTTP calls.

---

## Component Conventions

- Components live in `src/components/` under `atoms/`, `molecules/`, or `organisms/`.
- Each component receives a typed props interface from `src/interfaces/` (exception: `N8NWorkflow` uses a local `IN8NWorkflowProps`).
- Default exports only — no named component exports.
- Use `"use client"` directive only when browser APIs or client-side state are required:
  - `atoms/WebsiteCard.tsx` — ResizeObserver, IntersectionObserver, CSS animations
  - `atoms/WebsiteSlide.tsx` — ResizeObserver, iframe load key state
  - `molecules/N8NWorkflow.tsx` — client rendering
  - `organisms/WebsiteProjects.tsx` — scroll tracking, dynamic import of `WebsiteSlide`
  - `organisms/Footer.tsx` — `window.matchMedia` for dark mode detection
- Props interfaces are prefixed with `I` and named `I<ComponentName>Props` (e.g., `IHeaderProps`).

### Current Page Rendering (`page.tsx`)

```tsx
<Header />        // sticky nav with dynamic sections
<About />         // rendered only if aboutUserData is non-empty
<WebsiteProjects /> // always rendered; scroll-based iframe slideshow
<Projects />      // rendered only if repos.length > 0
<Footer />        // contact section with dark-mode-aware icons
```

- `Footer` is rendered as `<Footer {...userData} />` — it receives `username`, `profileName`, and `contact` directly from the `userData` const, not from `IData`.
- `About` renders README.md content via `dangerouslySetInnerHTML`; styled with the `.about-content` CSS class.
- `LowCodeProjects` organism exists but is **not** rendered in `page.tsx`.

---

## TypeScript Conventions

- All interfaces are prefixed with `I` (e.g., `IGithubRepository`, `IApiResult<T>`).
- Prefer interfaces over types for object shapes.
- Use `as const` for immutable static data (e.g., `userData` in `helpers/userdata.ts`).
- Generic `IApiResult<T>` wraps all API responses: `{ data?: T; error?: IApiError }`.
- Return `IErrorResponse` (`{ error: IApiError }`) on failure; check with `"error" in result`.
- `IGithubDataResponse` is the return type of `getGithubData` — merges `IGithubUserData` fields with a `repos` array and an optional `error`.
- `IData.header.title` is typed as a string literal `"Thiago Pereira"` (not a plain `string`).

---

## Styling

- Tailwind CSS v4 with the `tw:` prefix (configured via `@import 'tailwindcss' prefix(tw)` in `globals.css` and `prefix: "tw-"` in `tailwind.config.ts`).
- All Tailwind utility classes must use the `tw:` prefix — e.g., `tw:flex`, `tw:px-4`.
- Responsive variants follow the pattern `tw:lg:grid-cols-3`, `tw:sm:flex-row`.
- No CSS Modules; global styles are in `src/app/globals.css`.
- CSS custom properties (design tokens) defined in `:root` with dark-mode overrides via `@media (prefers-color-scheme: dark)`:
  - `--background`, `--foreground`, `--muted`
  - `--card-bg`, `--card-border`, `--card-shadow`, `--card-shadow-hover`
  - `--accent-start`, `--accent-end`
  - `--header-bg`, `--header-border`
- Global CSS utility classes (defined in `globals.css`, **not** Tailwind):
  - `.gradient-text` — accent gradient applied to text via `background-clip`
  - `.portfolio-card` — frosted-glass card style with hover lift effect
  - `.section-heading` — styled `h2` with underline accent
  - `.lang-badge` — language pill badge used in `Projects`
  - `.about-content` — typography and link styles for rendered README.md HTML
- Fonts: Geist Sans (`--font-geist-sans`) and Geist Mono (`--font-geist-mono`) loaded as local fonts in `layout.tsx`.

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
- Path alias `@/` maps to `src/`; `@/icons/*` maps to `src/assets/icons/*`.
- Jest is configured via `jest.config.js` using `nextJest` with `babel-jest` transform (`next/babel` preset). Coverage excludes `*.d.ts`, fonts, and assets.

### Running Tests

```bash
yarn test                # run once
yarn test:watch          # watch mode
yarn test:coverage       # with coverage report
yarn test:ci             # CI mode (--passWithNoTests)
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
ServiceFactory.setLowCodeRepository(mockRepo);
// ... run test ...
ServiceFactory.reset();
```

### Static User Data

Personal data (username, contact links, icons) is centralized in `src/helpers/userdata.ts` as a `const` object. Update this file to change portfolio content.

Website project list is in `src/helpers/websitedata.ts`. The `LowCodeProjects` organism exists but is not currently rendered in `page.tsx`.

---

## Commands

```bash
yarn dev      # development server (Turbopack)
yarn build    # production build (static export)
yarn serve    # serve static output (./out) locally
yarn lint     # tsc --noEmit && ESLint (use yarn lint:ci for --max-warnings=0)
yarn test     # Jest
```
