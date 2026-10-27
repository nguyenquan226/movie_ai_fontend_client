# Repository Guidelines

## Project Structure & Module Organization

This is a Next.js App Router application. Routes and layouts live in `src/app/`, with route-specific components often grouped in `_components/`. Shared UI is in `src/components/` (including reusable primitives under `ui/`); state stores, hooks, services, utilities, constants, types, and data are organized in their corresponding `src/` directories. Static assets belong in `public/`. Use the `@/*` alias for imports from `src/`.

## Build, Test, and Development Commands

- `npm install` installs the dependencies recorded in `package-lock.json`.
- `npm run dev` starts the local Next.js development server.
- `npm run build` creates a production build; `npm start` serves that build.
- `npm run lint` runs ESLint with the Next.js Core Web Vitals and TypeScript rules.

There is no test script or test framework configured in `package.json`. Run lint and build before submitting changes; add focused tests if a test framework is introduced for the affected feature.

## Coding Style & Naming Conventions

Use TypeScript and React function components, following the existing code style and strict TypeScript settings. Use two spaces for indentation, as in the project configuration. Name components and component files in PascalCase where the surrounding directory does so; use camelCase for hooks (prefixed `use`), utilities, and stores. Keep route segments lowercase and follow existing dynamic-segment patterns such as `[filmSlug]`. Prefer colocating route-only UI with its route and placing reusable code in shared `src/` directories. Run `npm run lint` to catch style and framework issues.

## Testing Guidelines

No automated unit or integration test setup is currently present. For UI changes, manually exercise the affected route at desktop and mobile sizes, including loading and error states where relevant. For state or API changes, check the affected user flow and report any manual verification performed.

## Commit & Pull Request Guidelines

Commit history is not available in this checkout, so no established message convention can be confirmed. Write concise imperative commit subjects that describe one change (for example, `Fix film search pagination`). Pull requests should summarize the user-visible change, note relevant routes or state/API behavior, link any associated issue, and include screenshots for visual changes. Record lint/build results and any manual verification in the PR description.

## Security & Configuration

Keep credentials and environment-specific values out of source control. Use environment variables for service configuration, and avoid logging tokens or personal data. Do not commit generated output such as `.next/` or `node_modules/`.
