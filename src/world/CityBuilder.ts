import * as THREE from 'three';

export class TrafficCar {
  readonly mesh: THREE.Group;
  private readonly route: THREE.Vector3[];
  private readonly speed: number;
  private index = 0;

  constructor(scene: THREE.Scene, route: THREE.Vector3[], speed = 4) {
    this.route = route;
    this.speed = speed;

    const bodyMat = new THREE.MeshStandardMaterial({ color: '#d98a5f', roughness: 0.7, metalness: 0.3 });
    this.mesh = new THREE.Group();

    const body = new THREE.Mesh(new THREE.BoxGeometry(2.3, 0.7, 4.2), bodyMat);
    body.position.y = 0.8;
    body.castShadow = true;
    this.mesh.add(body);

    const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.8, 2.0), new THREE.MeshStandardMaterial({ color: '#d7eda9', transparent: true, opacity: 0.7 }));
    cabin.position.set(0, 1.2, -0.2);
    this.mesh.add(cabin);

    this.mesh.position.copy(route[0]);
    this.mesh.rotation.y = Math.PI;
    scene.add(this.mesh);
  }

  update(dt: number): void {
    const target = this.route[this.index];
    const direction = target.clone().sub(this.mesh.position);

    if (direction.length() < 0.5) {
      this.index = (this.index + 1) % this.route.length;
      return;
    }

    direction.y = 0;
    direction.normalize();

    this.mesh.position.addScaledVector(direction, this.speed * dt);
    this.mesh.rotation.y = Math.atan2(direction.x, direction.z);
  }
}
