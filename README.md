# Cinder District Prototype

A browser-based third-person city prototype built with Three.js. This version is intentionally designed as a compact, playable vertical slice and includes a more dynamic vehicle system where all vehicles are interactable, NPC drivers can be displaced, and nearby NPCs can fight back during vehicle takeovers.

## Features

- Third-person movement with sprint and jump
- Compact city block with roads, sidewalks, buildings, parking, and streetlights
- Multiple interactable vehicles
- Player can enter any available vehicle
- NPC driver takeover behavior
- Nearby NPC resistance during vehicle theft attempts
- Pause menu and graphic quality settings
- Local save system via browser storage
- Browser-optimized performance and settings presets

## Core design rule

The player can enter any drivable vehicle. If an NPC is driving, the player can try to take it over. Nearby NPCs may react aggressively and attempt to stop the player from stealing their vehicle.

## Controls

- WASD: move
- Shift: sprint
- Space: jump
- E: interact / enter or exit vehicle
- Escape: pause menu
- Mouse: look around
- N: cycle quality presets

## Tech stack

- Three.js
- TypeScript
- Vite
- localStorage

## Run locally

```bash
npm install
npm run dev -- --host
```

## Build

```bash
npm run build
npm run preview -- --host
```
