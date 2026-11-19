# Portfolio site

Next.js 15 (App Router) + Tailwind 4 personal portfolio. Live at https://jcchou.vercel.app.

## Commands
- `npm run dev`: local preview at http://localhost:3000
- `npm run build`: production build (runs `scripts/check.mjs` first). Run before publishing.

## Publishing
- Hosted on Vercel, project `my-portfolio` (this folder is linked via `.vercel/`).
- If the Vercel GitHub integration is connected, pushing to `main` deploys automatically.
- Otherwise deploy manually: `npx vercel deploy --prod --yes`
- `vercel.json` pins the framework preset to Next.js. Without it Vercel serves a 404.
- `NEXT_PUBLIC_SITE_URL` (set in Vercel production env) feeds `metadataBase` in `app/layout.tsx`.

## Workflow when the owner asks for a change
1. Make the edit, run `npm run build` to confirm it compiles.
2. Commit and push to `main`.
3. Deploy (automatic, or the manual command above) and verify the live URL returns 200.
