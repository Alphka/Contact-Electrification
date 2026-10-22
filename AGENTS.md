# Contact Electrification

A single-page Next.js (App Router) site, deployed on Vercel, that computes **contact electrification**: the user sets N bodies (2–26, labeled A–Z) with initial charges, then a sequence of contacts (each a comma-separated list of letters such as `A, B, C`). For each contact it shows the resulting charge as an exact fraction of `q`, plus the total charge. The UI is translated into English (default) and Brazilian Portuguese.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Commands

Package manager is **pnpm** (`packageManager` pins 12.x; `engines` requires Node `>=22.22.2`).

```bash
pnpm dev        # next dev
pnpm build      # next build
pnpm lint       # eslint (cached) + cspell over the whole repo
pnpm lint:fix   # eslint --fix only (does NOT run cspell)
pnpm tsc        # next typegen && tsc — type-check (noEmit); also regenerates messages/*.d.json.ts
pnpm test       # jest (next/jest, jsdom)
pnpm test src/app/helpers/calculate.test.ts   # a single file
pnpm test -t "keeps repeating fractions"     # a single test by name
```

CI (`.github/workflows/ci.yml`) runs lint, tsc, test and build on pushes to `main` and on pull requests.

## Architecture

- **Routing and i18n (next-intl):** `src/app/[locale]/layout.tsx` is the root layout (it renders `<html lang>`). Locales are `en` (default) and `pt-BR`, configured in `src/i18n/routing.ts` with `localePrefix: "always"` (`/` redirects to `/en`) and `localeDetection: false`, so the locale only changes through the route. `src/proxy.ts` (Next 16's replacement for `middleware.ts`) applies the routing; `src/i18n/request.ts` reads the locale from `next/root-params`, so `setRequestLocale` is not needed.
- **Not found:** there is no `global-not-found`. The layout never calls `notFound()`: for an unknown locale segment (e.g. `/foo.txt`, which the proxy matcher skips because of the dot) it falls back to the default locale, and `[locale]/page.tsx` calls `notFound()` instead. `[locale]/[...rest]/page.tsx` turns every other unknown path into `notFound()`, so `[locale]/not-found.tsx` renders every 404 inside the layout, translated. A `notFound()` thrown by the root layout would skip it and show Next's unstyled default page.
- **Messages** live in `messages/{en,pt-BR}.json` (camelCase namespaces). The next-intl plugin (`next.config.ts`) generates `messages/*.d.json.ts` declarations for both files and precompiles the messages at build time (`experimental.messages.precompile`), so load them through next-intl (`getTranslations`/`useTranslations`) rather than reading the JSON imports directly. `en.json` is the source of the `AppConfig` types (`src/typings/next-intl.d.ts`), so translation keys and ICU arguments are type-checked. Numeric arguments use `{name, number}`. `messages/messages.test.ts` fails if the locales drift apart in keys or arguments.
- **Cache Components** (`cacheComponents` + `partialPrefetching`) are on; both locale pages are rendered statically at build time via `generateStaticParams`.
- **Calculator** (`src/app/components/Calculator.tsx`, the only `"use client"` entry) keeps the raw input strings in state and calls `calculate()` on submit. `InputList` is the shared list UI for bodies and contacts (Enter → next input, creating one at the end; Shift+Enter → previous; focus moves to a sibling on removal). The bodies count grows while typing but only shrinks when committed (blur, Enter, or `QUANTITY_COMMIT_DELAY` ms after the last valid keystroke), so typing `20` over `5` does not discard bodies.
- **Calculation** (`src/app/helpers/calculate.ts`) is pure: it parses charges (`parseCharge`) and contacts (`parseContact`), applies contacts in order (the touching bodies share their summed charge equally and later contacts see the updated charges) and returns every contact result plus the conserved total. All arithmetic uses **fraction.js** (`BigInt` rationals), so results are exact; `parseCharge` builds the fraction itself because fraction.js does not parse scientific notation (`2e-3`). Invalid input throws `InputError` (`src/app/entities/`) with a message key from `Errors`, the offending field (focused by the UI) and its ICU values.
- **Results** render each charge as native **MathML** (`Charge.tsx`, typings in `src/typings/mathml.d.ts`); no math library is needed because every browser in `browserslist` supports MathML Core.

### Path aliases (tsconfig)

`@app/*` → `src/app/*`, `@components/*`, `@entities/*`, `@helpers/*`, `@i18n/*` → `src/i18n/*`, `@testing/*` → `src/testing/*`. next/jest resolves them while compiling, but `jest.mock()` paths are not rewritten, so mock with relative paths.

### Testing

Jest via `next/jest` (`jest.config.ts`). next-intl is ESM-only, so `transformIgnorePatterns` lets it and its `@formatjs` dependencies be transformed. Render components that use translations with `@testing/renderWithIntl` (English messages).

### Styling

Tailwind CSS **v4**, configured CSS-first (no `tailwind.config`): `globals.css` imports `tailwindcss` and keeps custom rules inside `@layer base` / `@layer components` so utilities still win. Validation colors use the `user-valid:` / `user-invalid:` variants. react-toastify v11 injects its own CSS, so it must not be imported. The UI is dark-only.

## Code conventions (enforced by ESLint — `eslint.config.ts`)

- Tabs, LF, double quotes, **no semicolons**.
- No space between control keywords and parens, and none before function parens: `if(x){`, `}else{`, `for(...)`, `function Foo(){`, `}catch(error){`.
- Interfaces must be PascalCase prefixed with `I` (`IInputListItem`); interface members are ordered by `ordering-conventions/interface-member-order`, and `@apply` classes in CSS by `ordering-conventions/tailwind-apply-class-order`. Run `pnpm lint:fix` rather than hand-sorting.
- Type-only imports use `import type`; Tailwind classes are also linted (`eslint-plugin-better-tailwindcss`).
- Values Next.js reads statically (e.g. `config.matcher` in `proxy.ts`) must be plain literals; `String.raw` breaks the build with "Invalid segment configuration export", so `unicorn/prefer-string-raw` is off for `src/proxy.ts`.
- next-intl's top-level factories (`createMiddleware`, `getRequestConfig`, the plugin) are exempted from `unicorn/no-top-level-side-effects` with `eslint-disable-next-line` comments.
- cspell checks English **and** pt-BR; add legitimate unknown words to `.cspell.json` → `words`.
