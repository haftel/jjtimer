# jjTimer

A clean, modern WCA Rubik's cube timer for all official events. Built with Vue 3 and deployed to GitHub Pages.

🔗 **Live App**: [haftel.github.io/jjtimer](https://haftel.github.io/jjtimer/)

## Features

- ⏱️ **Precision Timer** — Sub-millisecond accuracy with spacebar or touch input
- 🔀 **WCA Scrambles** — Random-state scrambles for all 17 official WCA events via [cubing.js](https://js.cubing.net/)
- 🧩 **Scramble Visualization** — Toggle a 2D cube net showing the scrambled state for 15 of the 17 events
- 👁️ **Optional Inspection** — 15-second WCA inspection countdown with +2/DNF penalties
- 📊 **Statistics** — ao5, ao12, ao50, ao100, best singles, session means
- 📋 **Sessions** — Multiple solve sessions per event with full history
- 💾 **Local Storage** — All data persists in your browser with JSON export/import
- 🌙 **Dark Theme** — Clean, modern, distraction-free interface
- 📱 **Responsive** — Works on desktop, tablet, and mobile

## WCA Events Supported

3x3x3 · 2x2x2 · 4x4x4 · 5x5x5 · 6x6x6 · 7x7x7 · 3x3x3 BLD · 3x3x3 FMC · 3x3x3 OH · Clock · Megaminx · Pyraminx · Skewb · Square-1 · 4x4x4 BLD · 5x5x5 BLD · 3x3x3 Multi-BLD

## Tech Stack

- **Framework**: [Vue 3](https://vuejs.org/) (Composition API)
- **Build Tool**: [Vite](https://vite.dev/)
- **Scrambles**: [cubing.js](https://js.cubing.net/)
- **Styling**: Vanilla CSS with custom properties
- **Storage**: Browser localStorage
- **Deployment**: GitHub Pages via GitHub Actions

## Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Documentation

- [spec.md](./spec.md) — Product specification and feature requirements
- [agents.md](./agents.md) — Constitutional rules for AI agents working on this project

## Deployment

The app automatically deploys to GitHub Pages when changes are pushed to the `master` branch. The CI/CD pipeline is configured in `.github/workflows/deploy.yml`.

## License

MIT
