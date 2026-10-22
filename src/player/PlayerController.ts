import * as THREE from 'three';
import type { InputController } from './InputController';
import type { PlayerController } from '../player/PlayerController';
import type { Vehicle } from '../vehicle/Vehicle';

export class CameraRig {
  private readonly desiredPosition = new THREE.Vector3();
  private readonly lookTarget = new THREE.Vector3();

  constructor(
    private readonly camera: THREE.PerspectiveCamera,
    private readonly player: PlayerController,
    private readonly vehicle: Vehicle,
    private readonly input: InputController,
  ) {
    this.camera.position.set(0, 3.5, 8);
  }

  update(dt: number): void {
    const focus = this.player.isInVehicle() ? this.vehicle.getPosition() : this.player.getPosition();
    const offsetDistance = this.player.isInVehicle() ? 7.5 : 6.2;
    const heightOffset = this.player.isInVehicle() ? 3.1 : 2.7;

    const distance = offsetDistance;
    const x = Math.sin(this.input.cameraYaw) * distance;
    const z = Math.cos(this.input.cameraYaw) * distance;
    const y = heightOffset + Math.sin(this.input.cameraPitch) * 2.2;

    const targetPos = new THREE.Vector3(
      focus.x + x,
      focus.y + y,
      focus.z + z,
    );

    this.camera.position.lerp(targetPos, 1 - Math.pow(0.0001, dt));

    const lookAtTarget = new THREE.Vector3(
      focus.x,
      focus.y + 1.5,
      focus.z,
    );

    this.camera.lookAt(lookAtTarget);
  }
}
