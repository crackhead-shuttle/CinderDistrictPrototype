import * as THREE from 'three';
import type { MoveInput } from '../game/InputController';
import type { Vehicle } from '../vehicle/Vehicle';

export class PlayerController {
  readonly mesh: THREE.Group;

  private readonly body: THREE.Mesh;
  private readonly head: THREE.Mesh;
  private readonly velocity = new THREE.Vector3();
  private readonly previousPosition = new THREE.Vector3();
  private yaw = 0;
  private isVehicleDriver = false;
  private groundY = 1.2;
  private isGrounded = true;
  private jumpForce = 0;

  constructor(scene: THREE.Scene, startPosition: THREE.Vector3) {
    this.mesh = new THREE.Group();
    this.mesh.position.copy(startPosition);

    const bodyMat = new THREE.MeshStandardMaterial({ color: '#e3d1c8', roughness: 0.8 });
    const headMat = new THREE.MeshStandardMaterial({ color: '#f6d6b5', roughness: 0.9 });

    this.body = new THREE.Mesh(new THREE.CapsuleGeometry(0.4, 1.2, 4, 8), bodyMat);
    this.body.castShadow = true;
    this.body.receiveShadow = true;
    this.body.position.y = 0.95;

    this.head = new THREE.Mesh(new THREE.SphereGeometry(0.24, 16, 16), headMat);
    this.head.position.y = 1.85;

    this.mesh.add(this.body, this.head);
    scene.add(this.mesh);
  }

  update(dt: number, input: MoveInput, sprinting: boolean, jump: boolean, cameraYaw: number): boolean {
    this.yaw = cameraYaw;

    const moveVec = new THREE.Vector3();
    const forward = new THREE.Vector3(Math.sin(cameraYaw), 0, Math.cos(cameraYaw));
    const right = new THREE.Vector3(forward.z, 0, -forward.x);

    moveVec.addScaledVector(forward, input.z);
    moveVec.addScaledVector(right, input.x);

    if (moveVec.lengthSq() > 0) {
      moveVec.normalize();
      const speed = sprinting ? 6.6 : 4.2;
      const targetVelocity = moveVec.multiplyScalar(speed);
      this.velocity.x = THREE.MathUtils.lerp(this.velocity.x, targetVelocity.x, 0.18);
      this.velocity.z = THREE.MathUtils.lerp(this.velocity.z, targetVelocity.z, 0.18);
      this.mesh.rotation.y = Math.atan2(moveVec.x, moveVec.z);
    } else {
      this.velocity.x = THREE.MathUtils.lerp(this.velocity.x, 0, 0.12);
      this.velocity.z = THREE.MathUtils.lerp(this.velocity.z, 0, 0.12);
    }

    if (jump && this.isGrounded) {
      this.jumpForce = 6.5;
      this.isGrounded = false;
    }

    if (!this.isGrounded) {
      this.jumpForce -= 12 * dt;
      this.velocity.y = this.jumpForce;
    } else {
      this.velocity.y = 0;
      this.mesh.position.y = this.groundY;
    }

    if (this.mesh.position.y <= this.groundY) {
      this.mesh.position.y = this.groundY;
      this.isGrounded = true;
      this.jumpForce = 0;
    }

    this.mesh.position.x += this.velocity.x * dt;
    this.mesh.position.z += this.velocity.z * dt;
    this.mesh.position.y += this.velocity.y * dt;

    this.previousPosition.copy(this.mesh.position);
    return true;
  }

  setPosition(position: THREE.Vector3): void {
    this.mesh.position.copy(position);
  }

  setYaw(yaw: number): void {
    this.yaw = yaw;
  }

  getPosition(): THREE.Vector3 {
    return this.mesh.position;
  }

  getYaw(): number {
    return this.yaw;
  }

  enterVehicle(): void {
    this.isVehicleDriver = true;
  }

  exitVehicle(): void {
    this.isVehicleDriver = false;
  }

  isInVehicle(): boolean {
    return this.isVehicleDriver;
  }

  updateVehicleProximity(vehicle: Vehicle): void {
    const distance = this.mesh.position.distanceTo(vehicle.getPosition());
    if (distance < 3.4 && this.mesh.position.y > 0.9) {
      vehicle.setPromptVisible(true);
    } else {
      vehicle.setPromptVisible(false);
    }
  }
}
