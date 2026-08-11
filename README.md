# JioHotstar Sports Pro interactive concept

Presentation-grade web prototype for the Entrepreneurial Thinking group project. The original cinematic experience uses a static SVG contour ring. The project uses Vite, React, TypeScript, Tailwind CSS 4, and the standard shadcn component alias.

## Run

Install dependencies and run the Vite development server:

```powershell
npm install
npm run dev
```

For a production build:

```powershell
npm run build
```

The Vite server prints the local URL, normally `http://127.0.0.1:5173`.

## Component structure

- Shared UI components: `components/ui/`
- Global Tailwind entry: `src/index.css`
- `@/components/ui` resolves to the root `components/ui` folder through `tsconfig.app.json` and `vite.config.ts`.

Keeping reusable primitives under `components/ui` matters because shadcn uses the `ui` alias in `components.json` when adding or updating components. A different folder would make CLI output and imports inconsistent.

## Presentation controls

- Click `ENTER EXPERIENCE` for manual mode.
- Click `PLAY DEMO` or open `?demo=1` for the scripted 45-second sequence.
- Use the right-hand rail to jump between product features.
- Use the camera and audio strips for alternate simulated states.
- Press the left and right arrow keys to move through features.
- Press `D` to start or pause auto demo, and `Esc` to return to the hero.

## Evidence labels

- The match and live metrics are explicitly labelled as simulated demo data.
- ₹99/month is labelled as an illustrative add-on and concept price.
- XR is labelled optional.
- The footer identifies this as an academic concept prototype for SPJIMR Entrepreneurial Thinking.

The final assignment report was not present in the local workspace or synced course Drive when this prototype was built. Before the graded presentation, reconcile any price or ecosystem wording against that report if it becomes available.
