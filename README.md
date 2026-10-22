# Cinder District Prototype

A browser-compatible, original open-world city prototype built with Three.js and Vite. This project is designed as a compact, playable third-person vertical slice for the web.

## Vision

Create a convincing small city district with:
- one controllable third-person character
- one enterable and drivable vehicle
- a compact street block with sidewalks, buildings, lights, and parking
- day and night lighting moods
- basic pedestrian and traffic loops
- pause and settings overlay
- progress saved locally in the browser

## Browser target

This project is intentionally optimized for web browsers and avoids the heavy desktop-only constraints of Unreal Engine 5.

## Stack

- Three.js
- TypeScript
- Vite
- localStorage save system

## Quick start

```bash
npm install
npm run dev -- --host
```

Then open the local Vite URL in the browser.

## Production build

```bash
npm run build
npm run preview -- --host
```

## Repo structure

- `src/` – game logic, world generation, vehicle, player, and UI
- `public/` – static assets and browser resources
- `docs/` – planning and milestone documentation

## Current milestone

This project is set up as a vertical slice, not a full open-world production game. The first milestone includes:
- third-person movement
- sprint and jump
- one city block
- one drivable vehicle
- pause UI and settings panel
- simple traffic and night lighting mood

## Notes

The browser version prioritizes playability and performance over photorealistic complexity. It is designed to be portable and lightweight enough for web deployment.
