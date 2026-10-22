# Vertical-slice implementation plan

## Milestone goal

Create a playable third-person city demo that uses one city block, one character, one vehicle, and a working core loop.

## Step 1: project bootstrapping

- Create the UE5 project.
- Add default input mappings.
- Configure editor viewport for third-person gameplay.
- Enable Lumen and relevant packaged settings.

## Step 2: player character

- Implement `ACinderPlayerCharacter`.
- Add camera follow, movement, sprinting, and jump.
- Bind third-person camera and input behavior.
- Validate in PIE mode.

### Required variables

- `WalkSpeed`
- `SprintSpeed`
- `JumpVelocity`
- `CameraBoomLength`
- `CameraHeight`

## Step 3: city block setup

- Build a simple road network with one main street.
- Add sidewalks, curb edges, and parking pads.
- Place a few storefront props and basic modular buildings.
- Add street lighting and atmosphere.

## Step 4: vehicle interaction

- Build a simple drivable vehicle pawn.
- Add enter/exit logic, driving input, steering, and braking.
- Test camera transitions from player to vehicle state.

## Step 5: traffic and pedestrians

- Spawn a few looping vehicles on a simple road path.
- Place 2–3 static idle pedestrians.
- Add simple nav generation and route logic.

## Step 6: UI systems

- Implement pause menu widget.
- Add settings panel for graphics preset and audio volume.
- Add HUD for speed and health state if needed.

## Step 7: validation and polish

- Profile FPS.
- Test for motion sickness and camera clipping.
- Fix input edge cases.
- Reduce unnecessary materials and lights.
