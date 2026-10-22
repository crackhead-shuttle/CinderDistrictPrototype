# Architecture and folder structure

## High-level systems

- `Player` – character movement, camera, interaction state, animation state
- `Vehicle` – entry, exit, driving physics, camera transitions
- `NPC` – pedestrian and traffic AI routes
- `World` – street layout, lighting volumes, weather system, streaming setup
- `UI` – HUD, minimap, pause menu, settings screen
- `Audio` – ambience, engine sound, footsteps, world SFX
- `SaveSystem` – player state, progression, stats
- `Performance` – quality levels, culling, LOD, scaling

## Suggested folder layout

- `Source/CinderDistrictPrototype/Player`
- `Source/CinderDistrictPrototype/Vehicle`
- `Source/CinderDistrictPrototype/NPC`
- `Source/CinderDistrictPrototype/Interaction`
- `Source/CinderDistrictPrototype/UI`
- `Source/CinderDistrictPrototype/World`
- `Source/CinderDistrictPrototype/SaveSystem`
- `Source/CinderDistrictPrototype/Audio`
- `Content/Blueprints`
- `Content/Environment`

## Design guidance

- Use component-based systems where possible.
- Keep gameplay logic separated from UI logic.
- Use Data Assets for settings and tuning values.
- Build in debug-friendly code paths for faster validation.
