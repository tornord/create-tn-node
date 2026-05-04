# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

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

## Architecture

**Frontend**: React 19 + Vite 8. Entry point is `src/main.tsx`, which renders a `Global` emotion styles component before `<App />`. Global styles (font, resets) live inline in `main.tsx` using `@emotion/react`'s `Global`.

**Backend**: Express server in `server/`, started with `tsx` (`node --import=tsx/esm`). No `__dirname` — use ES module `import.meta.url` patterns instead.

**TypeScript**: Composite project — `tsconfig.json` references `tsconfig.app.json` (for `src/` and `common/`) and `tsconfig.node.json` (for `vite.config.ts` and `server/`). Target is `ES2020`. Strict mode, `noUnusedLocals`, `noUnusedParameters`, and `noFallthroughCasesInSwitch` are all enforced.

**Testing**: Vitest with `globals: true`. Two setup files: `setupVitest.ts` sets `NODE_ENV=test` and `TZ=Europe/Stockholm`; `testSetup.ts` extends `expect` with React Testing Library matchers and runs `cleanup()` after each test. Tests live next to source files (`*.test.ts` / `*.test.tsx`).

**ESLint**: Config is `eslint.config.mjs` (ESM flat config), exports an array. Skips `react/react-in-jsx-scope` and `@typescript-eslint/no-explicit-any`. Enforces double quotes, semicolons, `sort-imports`, `no-console`, `eqeqeq`, and `no-shadow`.

**Prettier**: `printWidth: 120`, double quotes, trailing comma `es5`.

## Key Conventions

- **Styling**: Always use `@emotion/styled` for component styles. Use `css` template literal from `@emotion/react` for CSS-in-JS outside components. Never use `.css` files. Never use the `css` prop on React components.
- **SVG components**: Use `viewBox="0 0 120 120"` as the standard format.
- **Node built-ins**: Always use the `node:` prefix (e.g. `node:path`, `node:fs`).
- **Storybook stories**: Co-locate with the component file.
- **Server tests**: Use `supertest`.
- **Strings**: Double quotes (Prettier default).
- **Missing `@types`**: Always install `@types/node` and `jsdom` as devDependencies.
- **package.json**: `"type": "module"` is set — use ESM throughout.
- **Node version**: 24 (see `.nvmrc`).
