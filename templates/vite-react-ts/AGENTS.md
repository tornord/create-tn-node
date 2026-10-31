# AGENTS.md

This file provides guidance to coding agents (Claude Code, Codex, Cursor, Copilot, etc.) when working with code in this repository.

`.cursorrules` and `.github/copilot-instructions.md` predate this file and are partly out of date (they still ask for `target: esnext`, ESLint 9 and `npx tsx`). When they disagree with this file, follow this file.

## Commands

```bash
npm run dev          # Vite dev server
npm run build        # tsc + vite build → dist/
npm test             # vitest --run (single pass, no watch)
npm run lint         # eslint .
npm run server       # Express server via tsx (node --import=tsx/esm server/index.ts)
```

Run a single test file:
```bash
npx vitest --run src/scaleLinear.test.ts
```

`npm run build` invokes `tsc` on the root `tsconfig.json`, which has `"files": []` and only project references — it type-checks nothing. Type-check the projects explicitly:

```bash
npx tsc -p tsconfig.app.json --noEmit   # src/, common/
npx tsc -p tsconfig.node.json --noEmit  # vite.config.ts, server/, common/
```

The app project currently reports two `TS6133` unused-`React` import errors (in `src/App.tsx` and `src/main.tsx`); `npm run build` does not surface them.

## Architecture

**Frontend**: React 19 + Vite 8. Entry point is `src/main.tsx`, which renders an `@emotion/react` `Global` component with inline `css` styles (font, body reset) before `<App />`. `src/App.tsx` is a single `@emotion/styled` component containing an animated SVG heart.

**Backend**: Express 5 in `server/index.ts`. Serves `dist/` statically, uses `cors()` and `express.json()`, mounts a router at `/api` with a `POST /search` stub, answers unknown `/api` routes with 404 JSON, and falls back to `dist/index.html` via `app.get("/*path")`. It exports `app` so `server/index.test.ts` can drive it with supertest, and only calls `app.listen` when run directly (`import.meta.main`). No `__dirname` — use ES module `import.meta.url` patterns instead. `dotenv` is a dependency but is not imported anywhere; environment variables and secrets belong in `.env`.

**Shared code**: `common/` holds framework-free TypeScript re-exported from `common/index.ts`, intended for use by both the React app and the server (currently only tests consume it).

**Vite**: `vite.config.ts` holds both the Vite and the Vitest config. Build output is `dist/` with `emptyOutDir: false` and sourcemaps enabled.

**TypeScript**: Composite project — `tsconfig.json` references `tsconfig.app.json` (for `src/` and `common/`) and `tsconfig.node.json` (for `vite.config.ts`, `server/`, `common/`, `scripts/`). Target is `ES2020`. Both projects pin `types: ["vitest/globals"]`. Strict mode, `noUnusedLocals`, `noUnusedParameters`, and `noFallthroughCasesInSwitch` are all enforced.

TypeScript 7 ships no compiler API, so `typescript` is installed as an npm alias for `@typescript/typescript6` (provides the TS 6 API that `typescript-eslint` imports, plus a `tsc6` binary). TypeScript 7 itself is installed under the `@typescript/native` alias, which supplies the `tsc` binary — so `npx tsc -v` reports 7.x while lint tooling sees 6.x. Don't "fix" either alias; dropping the TS 6 API alias breaks `npm run lint`.

**Testing**: Vitest 5 with `globals: true`; tests are discovered as `{src,common,server,scripts}/**/*.test.[jt]s` with a 3 s timeout. Only `setupVitest.ts` is wired in (`test.setupFiles` in `vite.config.ts`); it sets `NODE_ENV=test` and `TZ=Europe/Stockholm` and exposes `after`/`before` globals. `testSetup.ts` is not referenced by any config and imports `@testing-library/react` and `@testing-library/jest-dom`, neither of which is installed — React Testing Library matchers and auto-cleanup are therefore not active. Tests live next to source files.

**ESLint**: Config is `eslint.config.mjs` (ESM flat config, exports an array). It layers `@eslint/js` recommended and `typescript-eslint` recommended on top of one another, then adds project rules (among others: `@typescript-eslint/no-shadow`, `no-loop-func`, `no-unused-vars` allowing `_`-prefixed names, `eqeqeq`, `sort-imports`, `no-console`, `no-var`, `prefer-const`, `semi`, `quotes`). Note: `@typescript-eslint/no-explicit-any` is **on** (error) — it is not skipped, and `react/react-in-jsx-scope` is irrelevant because `eslint-plugin-react` and `eslint-plugin-react-hooks` are installed but never registered. `@stylistic/eslint-plugin` is registered as `stylistic` without any stylistic rules being used. Skips `dist/`, `lib/`, `storybook-static/`, `public/`, `ml/` and `scripts/CryptoJS.js`.

**Formatting**: `prettier` is not installed, but `.prettierrc` records the intended style: `printWidth: 120`, `arrowParens: "always"`, `trailingComma: "es5"`, double quotes.

## Key Conventions

- **Styling**: Always use `@emotion/styled` for component styles. Use `css` template literal from `@emotion/react` for CSS-in-JS outside components. Never use `.css` files and avoid using the `css` prop on React components.
- **SVG components**: Use `viewBox="0 0 120 120"` as the standard format.
- **Node built-ins**: Always use the `node:` prefix (e.g. `node:path`, `node:fs`).
- **Storybook**: Not set up in this repo; if stories are added, co-locate them with the component.
- **Server tests**: Use `supertest` against the exported `app`.
- **Strings**: Double quotes (Prettier default).
- **Missing `@types`**: Install missing type packages directly. `@types/node` currently resolves only transitively (via `@types/express`/`@types/cors`) — add it to `devDependencies` if code relies on it; `jsdom` is already a devDependency.
- **package.json**: `"type": "module"` is set — use ESM throughout. `.npmrc` sets `legacy-peer-deps=true`.
- **Node version**: 24 (see `.nvmrc`).
