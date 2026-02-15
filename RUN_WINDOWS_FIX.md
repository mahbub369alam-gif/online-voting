# Windows setup notes (fixed)

This project originally pinned React 19 RC and used Turbopack by default. On Windows this often caused:

- `npm ERR! ERESOLVE` (peer dependency conflict)
- `Cannot find module '../lightningcss.win32-x64-msvc.node'` during Tailwind/PostCSS build

## What was changed

- React/ReactDOM pinned to stable **19.2.4**
- Next pinned to **15.5.3** (still major v15)
- Added `lightningcss-win32-x64-msvc` as an **optional dependency** for Windows so the native binary is available.
- `npm run dev` now runs `next dev` (Webpack). If you want Turbopack, run `npm run dev:turbo`.
- Prisma client is cached globally in development to avoid connection explosions.

## Install + run

1. Use Node.js **20+** (Tailwind v4 requires Node 20+).
2. From the project root:

```bash
npm install
npx prisma generate
npm run seed   # optional: creates default admin users
npm run dev
```

If you still see a LightningCSS error, install **Microsoft Visual C++ Redistributable (x64)** and reinstall dependencies.
