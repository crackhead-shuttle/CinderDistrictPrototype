export type MoveInput = {
  x: number;
  z: number;
};

export class InputController {
  keys = new Set<string>();
  pointerLocked = false;
  cameraYaw = 0;
  cameraPitch = -0.45;
  quality: 'low' | 'medium' | 'high' | 'cinematic' = 'medium';

  private jumpQueued = false;

  handleKeyDown(event: KeyboardEvent): void {
    this.keys.add(event.code);

    if (event.code === 'Space') {
      this.jumpQueued = true;
    }

    if (event.code === 'KeyN') {
      this.cycleQuality();
    }
  }

  handleKeyUp(event: KeyboardEvent): void {
    this.keys.delete(event.code);
  }

  handleMouseMove(event: MouseEvent): void {
    if (!this.pointerLocked) {
      return;
    }

    this.cameraYaw -= event.movementX * 0.0024;
    this.cameraPitch = Math.max(-1.2, Math.min(1.0, this.cameraPitch - event.movementY * 0.0016));
  }

  getMoveVector(): MoveInput {
    const x = (this.keys.has('KeyD') ? 1 : 0) - (this.keys.has('KeyA') ? 1 : 0);
    const z = (this.keys.has('KeyW') ? 1 : 0) - (this.keys.has('KeyS') ? 1 : 0);
    return { x, z };
  }

  isSprinting(): boolean {
    return this.keys.has('ShiftLeft') || this.keys.has('ShiftRight');
  }

  isJumping(): boolean {
    return this.jumpQueued;
  }

  consumeJump(): void {
    this.jumpQueued = false;
  }

  private cycleQuality(): void {
    const values: Array<typeof this.quality> = ['low', 'medium', 'high', 'cinematic'];
    const index = values.indexOf(this.quality);
    this.quality = values[(index + 1) % values.length];
  }
}
