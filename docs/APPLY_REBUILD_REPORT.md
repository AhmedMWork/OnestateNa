# Apply Flow Rebuild Report

## Scope
This release rebuilds the public application experience after review of the live `/apply` page.

## Key fixes
- The application page no longer becomes empty if Supabase questions are missing or not seeded.
- Built-in fallback factions and questions are bundled in code.
- Public question and faction APIs now safely return fallback data if Supabase is unavailable.
- The application wizard is rebuilt with professional steps, progress, side navigation, and required-field validation.
- The grid/square background has been removed and replaced with a cinematic dark/gold background.
- Faction visuals are upgraded to custom SVG emblems rather than generic check marks.
- Client ID and Discord screenshots remain inside their relevant fields.
- The public application flow stays focused on applying only: no public rules browsing, no technical wording, no admin references.

## Files changed
- src/components/apply/ApplyFlow.tsx
- src/lib/fallback-data.ts
- src/app/api/public/factions/route.ts
- src/app/api/public/questions/route.ts
- src/lib/applications.ts
- src/app/globals.css
- src/components/public/LandingPage.tsx

## Deployment notes
Keep using the Yarn public-registry deployment configuration:
`yarn install --frozen-lockfile --non-interactive --network-timeout 1200000 --registry https://registry.npmjs.org/`

## Verification
`node scripts/verify-locks.mjs` passed.
A full local build was not rerun in this sandbox because dependencies are not installed and external package installation is unavailable here. The project remains configured for Vercel to install dependencies from the public npm registry.
