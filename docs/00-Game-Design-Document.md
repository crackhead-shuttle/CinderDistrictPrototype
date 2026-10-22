# Content organization

This folder is reserved for the prototype's validated asset pipeline and source content.

## Recommended staging layout

- `Art/` – finished environment and character materials
- `Blueprints/` – gameplay blueprints for the player, vehicle, and UI
- `Characters/` – low/poly or stylized placeholders for the main character and NPCs
- `Environment/` – modular road, building, prop, and lighting assets
- `Vehicles/` – vehicle prototypes and materials
- `Audio/` – footsteps, engine sounds, ambience, and UI cues
- `UI/` – HUD and menu widgets

## Prototype asset requirements

- 1 main road with curb, lane markings, and sidewalks
- 1 city block with parking lot and storefront facade
- 1 drivable vehicle mesh with basic wheel setup
- 4–8 furniture or prop meshes for interior/exterior clutter
- 2–3 materials for asphalt, concrete, painted surfaces, and glass
- 1 light rig and sky atmosphere setup for day and night conditions

## Import workflow

1. Block out the level with modular geometry.
2. Add physically based materials using UE5 material system.
3. Set up a common texture scale and tiling strategy.
4. Validate LODs before final integration.
5. Perform GPU/CPU profile passes before final polishing.
