# Noir Luxe Boutique

A modern e-commerce style landing site built with Vite, React and Tailwind CSS.

This repository is a polished frontend starter showcasing a component-driven UI library and small integrations (Supabase client stub included). It's configured for local development, production builds, and continuous integration.

## Key features

- Clean component library (shadcn-style primitives) in `src/components/ui`
- TypeScript + React + Vite
- Tailwind CSS for utilities and responsive design
- Supabase client integration (in `src/integrations/supabase`)

## Screenshot

![placeholder](/public/placeholder.svg)

## Tech stack

- Vite
- React + TypeScript
- Tailwind CSS
- Radix UI primitives
- Supabase (client only)

## Quick start

1. Install Node.js (v18+ recommended)
2. Install dependencies

```bash
npm ci
```

3. Run the dev server

```bash
npm run dev
```

4. Build for production

```bash
npm run build
```

5. Preview production build locally

```bash
npm run preview
```

## Deploying to GitHub Pages

Two common ways:

- Build locally and publish the `dist/` folder to the `gh-pages` branch (using the `gh-pages` package or a simple script).
- Use a GitHub Actions workflow to build and deploy automatically (this repo includes a CI job to build on push; extend it to deploy with `peaceiris/actions-gh-pages` if desired).

Example (manual):

```bash
npm run build
# then push `dist` to gh-pages branch via your preferred method
```

## Author

Replace the placeholder author in `package.json` with your name and contact info.

Optional acknowledgement: If you'd like to be transparent, add a short line like "AI-assisted" in this section — it's optional and up to you.

## License

This project is licensed under the MIT License — see `LICENSE` for details.

## Notes

- If you plan to publish this repository to GitHub, update the `repository` and `homepage` fields in `package.json`.
- The project intentionally keeps a component-rich `src/components/ui` folder so you can re-use UI pieces in other projects.
