# Project setup and tools

## Required software

- Unreal Engine 5.3 or later
- Visual Studio 2022 with C++ tools
- Git LFS
- Blender
- Substance 3D Painter or Photoshop
- FMOD / Wwise for audio

## Project setup steps

1. Create a new UE5 project with the `Blank` template and C++ enabled.
2. Name it `CinderDistrictPrototype`.
3. Set project defaults to Windows PC target with scalability presets.
4. Enable Nanite and Lumen support for supported assets.
5. Use `Development Editor` builds while iterating.
6. Configure input mappings for movement, camera, jump, sprint, and pause.

## Recommended directories

- `Content/Environment`
- `Content/Characters`
- `Content/Vehicles`
- `Content/UI`
- `Content/Audio`
- `Source/CinderDistrictPrototype`
- `Config`

## File naming conventions

- Player: `BP_CinderPlayerCharacter`, `CinderPlayerCharacter`
- Vehicle: `BP_CinderVehicle`, `CinderVehiclePawn`
- World: `LV_CinderDistrict_01`
- UI: `WBP_PauseMenu`, `WBP_SettingsMenu`
