# Contact Electrification

A single-page Next.js (App Router) site, deployed on Vercel, that computes **contact electrification**: the user sets N bodies (2–26, labeled A–Z) with initial charges, then a sequence of contacts (each a comma-separated list of letters such as `A, B, C`). For each contact it prints the resulting charge as an exact fraction of `q`, plus the total charge. All user-facing text is in Brazilian Portuguese (`lang="pt-BR"`).

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Commands

Package manager is **pnpm** (`packageManager` pins 12.x; `engines` requires Node `^22.18 || ^23.5 || >=24`).

```bash
pnpm dev        # next dev
pnpm build      # next build
pnpm lint       # eslint (cached) + cspell over the whole repo
pnpm lint:fix   # eslint --fix only (does NOT run cspell)
pnpm tsc        # next typegen && tsc — type-check (noEmit)
```

There is no test suite or test runner configured.

## Architecture

- **All state and the calculation live in [src/app/page.tsx](src/app/page.tsx)** (a `"use client"` component). It owns `bodiesList`, `contactsList` and `results`, and passes `add*/modify*/remove*` callbacks down to the list components. `layout.tsx` is the only server component (metadata, fonts, toast container, Vercel Analytics, Google Analytics).
- `components/Bodies` and `components/Contacts` share the same shape: `index.tsx` declares the `I*Info` / `I*Props` interfaces and renders the list plus keyboard navigation (Enter → next input, creating one at the end; Shift+Enter → previous); the item component (`Body.tsx` / `Contact.tsx`) validates its own input via the HTML `pattern` attribute + `checkValidity()` and reports back through `modify*` with an `error` flag. Each item carries a stable `uuid` id and a `createRef()` input ref stored in state.
- **Calculation (`handleSubmit`)**: contacts are processed in order; a contact's result is the sum of its participants' charges divided by the participant count, and every participant's charge is then *replaced* by that result, so later contacts see the updated values. The result is kept as a `Fraction` on the body (`fraction` field) so subsequent contacts reuse the exact value instead of a rounded decimal. Body charges are strings like `-3.5q` / `1e-3` (the `q` suffix is optional and stripped).
- **Floating-point precision** is handled by the helpers rather than plain arithmetic: `sum` and `divide` use `transformNumbers`/`getExponential` to scale both operands to integers before operating, and `Fraction` (in `src/app/entities/`) normalizes sign, scales to integers, and reduces by the GCD (`findDivisor`). Use these helpers for any charge arithmetic.
- Errors during calculation are thrown and surfaced with `react-toastify` (`toast.error`); validation failures return early.

### Path aliases (tsconfig)

`@app/*` → `src/app/*`, `@components/*`, `@entities/*`, `@helpers/*`.

### Styling

Tailwind CSS **v4**, configured CSS-first (no `tailwind.config`): `globals.css` imports `tailwindcss` and react-toastify's CSS; PostCSS uses `@tailwindcss/postcss`. CSS modules (`components/styles.module.css`) must start with `@reference "../globals.css"` to use `@apply`. Class strings are composed with `twMerge`/`twJoin` from `tailwind-merge`. The UI is dark-only.

## Code conventions (enforced by ESLint — `eslint.config.ts`)

- Tabs, LF, double quotes, **no semicolons**.
- No space between control keywords and parens, and none before function parens: `if(x){`, `}else{`, `for(...)`, `function Foo(){`, `}catch(error){`.
- Interfaces must be PascalCase prefixed with `I` (`IBodyInfo`); interface members are ordered by `ordering-conventions/interface-member-order`, and `@apply` classes in CSS by `ordering-conventions/tailwind-apply-class-order`. Run `pnpm lint:fix` rather than hand-sorting.
- Type-only imports use `import type`; Tailwind classes are also linted (`eslint-plugin-better-tailwindcss`).
- cspell checks English **and** pt-BR; add legitimate unknown words to `.cspell.json` → `words`.
