import * as THREE from 'three';
import type { MoveInput, InputController } from '../game/InputController';
import type { PlayerController } from '../player/PlayerController';

export type VehicleDriver = 'player' | string | null;

export class Vehicle {
  readonly mesh: THREE.Group;
  readonly body: THREE.Mesh;
  readonly id: string;
  readonly interactionRadius = 4.6;

  driver: VehicleDriver = null;
  promptVisible = false;
  takeoverProgress = 0;
  npcResistance = 0;

  private speed = 0;
  private maxSpeed = 18;
  private steer = 0;
  private occupantPlayer: PlayerController | null = null;

  constructor(scene: THREE.Scene, position: THREE.Vector3, id: string) {
    this.id = id;
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

    const glowMaterial = new THREE.MeshStandardMaterial({
      color: '#86ffb9',
      emissive: '#39d98a',
      emissiveIntensity: 0.8,
    });

    const glow = new THREE.Mesh(new THREE.SphereGeometry(0.14, 12, 12), glowMaterial);
    glow.position.set(0, 1.0, 2.2);
    this.mesh.add(glow);

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

    if (this.driver === 'player') {
      this.speed += throttle * 12 * dt;
      this.speed *= 0.985;
      this.speed = THREE.MathUtils.clamp(this.speed, -8, this.maxSpeed);
      this.steer = THREE.MathUtils.lerp(this.steer, steerInput, 0.12);
      this.mesh.rotation.y += this.steer * 1.1 * dt * (Math.abs(this.speed) / 10 + 0.3);

      const forward = new THREE.Vector3(Math.sin(this.mesh.rotation.y), 0, Math.cos(this.mesh.rotation.y));
      this.mesh.position.addScaledVector(forward, this.speed * dt);
    } else {
      this.speed *= 0.96;
    }

    const glowColor = this.promptVisible ? '#a3ffc1' : '#7f8fa4';
    const glowEmissive = this.promptVisible ? '#3ae67d' : '#2d2d2d';

    this.mesh.children.forEach((child) => {
      if (child instanceof THREE.Mesh && child.geometry instanceof THREE.SphereGeometry) {
        const material = child.material as THREE.MeshStandardMaterial;
        material.color.set(glowColor);
        material.emissive.set(glowEmissive);
        material.emissiveIntensity = this.promptVisible ? 1.3 : 0.35;
      }
    });
  }

  canPlayerInteract(playerPosition: THREE.Vector3): boolean {
    return playerPosition.distanceTo(this.mesh.position) <= this.interactionRadius;
  }

  handlePlayerInteraction(player: PlayerController): void {
    if (this.driver === 'player') {
      this.exitPlayer(player);
      return;
    }

    if (this.driver === null) {
      this.driver = 'player';
      this.occupantPlayer = player;
      player.enterVehicle(this);
      return;
    }

    if (this.driver !== 'player') {
      this.takeoverProgress += 1;
      this.npcResistance += 0.4;

      if (this.takeoverProgress >= 3) {
        this.driver = 'player';
        this.occupantPlayer = player;
        player.enterVehicle(this);
        this.takeoverProgress = 0;
        this.npcResistance = 0;
      }
    }
  }

  exitPlayer(player: PlayerController): void {
    if (this.driver === 'player') {
      this.driver = null;
      this.occupantPlayer = null;
      player.exitVehicle();
    }
  }

  setPromptVisible(value: boolean): void {
    this.promptVisible = value;
  }

  setPosition(position: THREE.Vector3): void {
    this.mesh.position.copy(position);
  }

  getPosition(): THREE.Vector3 {
    return this.mesh.position;
  }

  isOccupied(): boolean {
    return this.driver !== null;
  }

  getDriverName(): string | null {
    return this.driver === 'player' ? 'player' : this.driver;
  }

  applyNpcResistance(amount: number): void {
    this.npcResistance = THREE.MathUtils.clamp(this.npcResistance + amount, 0, 1);
  }

  resetTakeoverState(): void {
    this.takeoverProgress = 0;
    this.npcResistance = 0;
  }
}
