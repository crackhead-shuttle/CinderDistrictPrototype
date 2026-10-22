import * as THREE from 'three';
import type { InputController } from './InputController';
import type { PlayerController } from '../player/PlayerController';
import type { Vehicle } from '../vehicle/Vehicle';

export class CameraRig {
  private readonly camera: THREE.PerspectiveCamera;
  private readonly input: InputController;
  private readonly player: PlayerController;
  private readonly vehicles: Vehicle[];

  constructor(camera: THREE.PerspectiveCamera, player: PlayerController, vehicles: Vehicle[], input: InputController) {
    this.camera = camera;
    this.player = player;
    this.vehicles = vehicles;
    this.input = input;
    this.camera.position.set(0, 3.5, 8);
  }

  update(dt: number, activeVehicle: Vehicle | null): void {
    const focus = activeVehicle ? activeVehicle.getPosition() : this.player.getPosition();
    const offsetDistance = activeVehicle ? 7.5 : 6.2;
    const heightOffset = activeVehicle ? 3.1 : 2.7;

    const x = Math.sin(this.input.cameraYaw) * offsetDistance;
    const z = Math.cos(this.input.cameraYaw) * offsetDistance;
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
