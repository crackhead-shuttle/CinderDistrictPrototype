import * as THREE from 'three';
import type { MoveInput, InputController } from '../game/InputController';
import type { PlayerController } from '../player/PlayerController';

export class Vehicle {
  readonly mesh: THREE.Group;
  readonly body: THREE.Mesh;
  readonly doorGlow: THREE.Mesh;

  private speed = 0;
  private maxSpeed = 18;
  private steer = 0;
  private occupied = false;
  private promptVisible = false;
  private driver: PlayerController | null = null;

  constructor(scene: THREE.Scene, position: THREE.Vector3) {
    this.mesh = new THREE.Group();
    this.mesh.position.copy(position);

    const bodyMat = new THREE.MeshStandardMaterial({ color: '#4f86d9', metalness: 0.5, roughness: 0.4 });
    const glassMat = new THREE.MeshStandardMaterial({ color: '#dfeffc', transparent: true, opacity: 0.8 });

    this.body = new THREE.Mesh(new THREE.BoxGeometry(2.3, 0.7, 4.2), bodyMat);
    this.body.castShadow = true;
    this.body.receiveShadow = true;
    this.body.position.y = 0.8;
    this.mesh.add(this.body);

    const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.7, 2.0), glassMat);
    cabin.position.set(0, 1.2, -0.2);
    this.mesh.add(cabin);

    this.doorGlow = new THREE.Mesh(
      new THREE.SphereGeometry(0.14, 12, 12),
      new THREE.MeshStandardMaterial({ color: '#86ffb9', emissive: '#39d98a', emissiveIntensity: 0.8 }),
    );
    this.doorGlow.position.set(0, 1.0, 2.2);
    this.mesh.add(this.doorGlow);

    const wheelGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.25, 16);
    const wheelMat = new THREE.MeshStandardMaterial({ color: '#121212' });

    const wheelOffsets = [
      [-1.05, 0.35, 1.4],
      [1.05, 0.35, 1.4],
      [-1.05, 0.35, -1.4],
      [1.05, 0.35, -1.4],
    ];

    for (const [x, y, z] of wheelOffsets) {
      const wheel = new THREE.Mesh(wheelGeo, wheelMat);
      wheel.rotation.z = Math.PI / 2;
      wheel.position.set(x, y, z);
      this.mesh.add(wheel);
    }

    scene.add(this.mesh);
  }

  update(dt: number, input: MoveInput, controls: InputController): void {
    const throttle = (controls.keys.has('KeyW') ? 1 : 0) - (controls.keys.has('KeyS') ? 1 : 0);
    const steerInput = (controls.keys.has('KeyD') ? 1 : 0) - (controls.keys.has('KeyA') ? 1 : 0);

    if (this.occupied) {
      this.speed += throttle * 12 * dt;
      this.speed *= 0.985;
      this.speed = THREE.MathUtils.clamp(this.speed, -8, this.maxSpeed);
      this.steer = THREE.MathUtils.lerp(this.steer, steerInput, 0.12);
      this.mesh.rotation.y += this.steer * 1.1 * dt * (Math.abs(this.speed) / 10 + 0.3);
      const forward = new THREE.Vector3(Math.sin(this.mesh.rotation.y), 0, Math.cos(this.mesh.rotation.y));
      this.mesh.position.addScaledVector(forward, this.speed * dt);

      if (this.driver) {
        this.driver.getPosition().copy(this.mesh.position.clone().add(new THREE.Vector3(0, 1.2, 0.6)));
      }
    } else {
      this.speed *= 0.96;
      this.mesh.position.y = 0.4;
    }

    this.doorGlow.material = new THREE.MeshStandardMaterial({
      color: this.promptVisible ? '#a3ffc1' : '#7f8fa4',
      emissive: this.promptVisible ? '#3ae67d' : '#2d2d2d',
      emissiveIntensity: this.promptVisible ? 1.3 : 0.35,
    });
  }

  setPromptVisible(value: boolean): void {
    this.promptVisible = value;
  }

  isPromptVisible(): boolean {
    return this.promptVisible;
  }

  attachPlayer(player: PlayerController): void {
    this.occupied = true;
    this.driver = player;
    player.enterVehicle();
  }

  detachPlayer(player: PlayerController): void {
    if (this.occupied && this.driver === player) {
      this.occupied = false;
      this.driver = null;
      player.exitVehicle();
      player.setPosition(this.mesh.position.clone().add(new THREE.Vector3(0, 1.2, 3)));
    }
  }

  isOccupied(): boolean {
    return this.occupied;
  }

  getPosition(): THREE.Vector3 {
    return this.mesh.position;
  }

  setPosition(position: THREE.Vector3): void {
    this.mesh.position.copy(position);
  }
}
