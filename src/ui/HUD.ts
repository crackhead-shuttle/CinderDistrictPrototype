import * as THREE from 'three';
import type { Vehicle } from '../vehicle/Vehicle';
import type { PlayerController } from '../player/PlayerController';

export class NpcDriver {
  readonly mesh: THREE.Group;
  readonly name: string;
  readonly targetVehicle: Vehicle;

  private aggression = 0;
  private health = 100;
  private readonly basePosition: THREE.Vector3;

  constructor(scene: THREE.Scene, position: THREE.Vector3, targetVehicle: Vehicle, name: string) {
    this.name = name;
    this.targetVehicle = targetVehicle;
    this.basePosition = position.clone();

    this.mesh = new THREE.Group();
    this.mesh.position.copy(position);

    const bodyMat = new THREE.MeshStandardMaterial({ color: '#caa16f', roughness: 0.9 });
    const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.35, 1.1, 4, 8), bodyMat);
    body.position.y = 0.9;
    this.mesh.add(body);

    const head = new THREE.Mesh(new THREE.SphereGeometry(0.22, 14, 14), new THREE.MeshStandardMaterial({ color: '#f0d58c' }));
    head.position.y = 1.7;
    this.mesh.add(head);

    const indicator = new THREE.Mesh(
      new THREE.BoxGeometry(0.16, 0.16, 0.16),
      new THREE.MeshStandardMaterial({ color: '#ff5959', emissive: '#ff5959', emissiveIntensity: 1 }),
    );
    indicator.position.set(0, 2.2, 0.3);
    this.mesh.add(indicator);

    scene.add(this.mesh);
  }

  update(dt: number, playerPosition: THREE.Vector3, vehicles: Vehicle[], player: PlayerController): void {
    const distToVehicle = playerPosition.distanceTo(this.targetVehicle.getPosition());
    const distToNpc = this.mesh.position.distanceTo(playerPosition);

    if (this.targetVehicle.driver === this.name) {
      this.targetVehicle.getPosition().copy(this.mesh.position.clone().add(new THREE.Vector3(0, 0.4, 0)));
    }

    if (this.targetVehicle.driver === this.name && distToVehicle < 7) {
      this.aggression = THREE.MathUtils.clamp(this.aggression + dt * 0.7, 0, 1);
      if (distToNpc < 3.5 && this.aggression > 0.5) {
        this.mesh.lookAt(playerPosition.x, this.mesh.position.y, playerPosition.z);
        this.health = THREE.MathUtils.clamp(this.health - dt * 14, 0, 100);

        if (this.health <= 0) {
          this.targetVehicle.driver = null;
          this.targetVehicle.resetTakeoverState();
          this.health = 100;
          this.aggression = 0;
        }
      }
    } else {
      this.aggression = THREE.MathUtils.lerp(this.aggression, 0, 0.08);
    }

    if (this.targetVehicle.driver !== this.name && this.targetVehicle.driver !== 'player') {
      const targetPos = new THREE.Vector3(this.basePosition.x, this.mesh.position.y, this.basePosition.z);
      this.mesh.position.lerp(targetPos, 0.02);
    }

    this.mesh.position.y = 0.4;

    const nearTargetVehicle = this.targetVehicle.canPlayerInteract(playerPosition);
    if (nearTargetVehicle && this.targetVehicle.driver !== 'player' && this.targetVehicle.driver !== null) {
      this.aggression = THREE.MathUtils.clamp(this.aggression + dt * 0.35, 0, 1);
      this.targetVehicle.applyNpcResistance(dt * 0.3);
    }
  }
}
