# Cinder District Prototype

A realistic, original open-world 3D action game prototype for Unreal Engine 5, built around a compact city district vertical slice inspired by modern open-world games.

## Project vision

This repository is the development scaffold for a playable first milestone:

- 1 controllable third-person character
- 1 detailed city street block
- 1 enterable and drivable vehicle
- Day and night lighting with atmospheric ambiance
- Light traffic or pedestrian movement
- Functional pause and settings menus

This is not a copy of any existing proprietary game. It is an original design with modular systems, reusable assets, and a vertical-slice-first workflow.

## Repository structure

- `docs/` – planning, setup, architecture, and milestone documentation
- `Source/` – Unreal C++ project skeleton
- `Content/` – asset pipeline notes and content organization
- `Config/` – project configuration templates
- `CinderDistrictPrototype.uproject` – Unreal project entry point

## Requirements

- Unreal Engine 5.3+ recommended
- Visual Studio 2022 or Xcode (macOS)
- Git LFS for large binary assets
- Blender for vehicle and prop blockout modeling
- Substance or Photoshop for material authoring
- FMOD or Wwise for audio implementation

## Milestone status

- Setup scaffold: complete
- Game design docs: complete
- Unreal project skeleton: complete
- Playable prototype implementation: pending in actual Unreal editor build

## Current goal

The repo is staged for the first milestone and intentionally prioritizes a playable city demo over broad feature creep.

## Quick next steps

1. Open `CinderDistrictPrototype.uproject` in Unreal Engine 5.
2. Build the C++ project in the editor.
3. Import the starter art content listed in `docs/04-Asset-Import-and-Configuration.md`.
4. Build the player character, camera, and vehicle systems in the order described in `docs/03-Vertical-Slice-Implementation-Plan.md`.
5. Test and validate the milestone before expanding to NPC traffic, city systems, or advanced gameplay.

## Important note

This repo is a development skeleton and project plan, not a full shipped production game. The actual gameplay systems must be implemented and validated in Unreal Engine.
