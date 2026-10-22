import * as THREE from 'three';
import { InputController } from './InputController';
import { PlayerController } from '../player/PlayerController';
import { Vehicle } from '../vehicle/Vehicle';
import { TrafficCar } from '../ai/TrafficCar';
import { buildCityBlock } from '../world/CityBuilder';
import { CameraRig } from './CameraRig';
import { HUD } from '../ui/HUD';
import { SaveManager } from '../save/SaveManager';
import { NpcDriver } from '../ai/NpcDriver';

export class Game {
  readonly renderer: THREE.WebGLRenderer;
  readonly scene = new THREE.Scene();
  readonly camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.1, 300);
  readonly clock = new THREE.Clock();
  readonly input = new InputController();
  readonly hud = new HUD();
  readonly saveManager = new SaveManager();

  private readonly world = new THREE.Group();
  private readonly player: PlayerController;
  private readonly cameraRig: CameraRig;
  private readonly trafficCars: TrafficCar[] = [];
  private readonly npcDrivers: NpcDriver[] = [];
  private readonly vehicles: Vehicle[] = [];
  private readonly state = {
    paused: false,
  };

  constructor(root: HTMLElement) {
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    root.appendChild(this.renderer.domElement);

    this.scene.background = new THREE.Color('#9ac1e6');
    this.scene.fog = new THREE.Fog('#dfeaf7', 35, 140);

    this.createLights();
    this.scene.add(this.world);
    this.world.add(buildCityBlock());

    this.player = new PlayerController(this.scene, new THREE.Vector3(0, 1.2, 20));

    this.vehicles.push(
      new Vehicle(this.scene, new THREE.Vector3(12, 0.4, 8), 'vehicle-1'),
      new Vehicle(this.scene, new THREE.Vector3(-15, 0.4, 2), 'vehicle-2'),
      new Vehicle(this.scene, new THREE.Vector3(18, 0.4, -12), 'vehicle-3'),
      new Vehicle(this.scene, new THREE.Vector3(-20, 0.4, -18), 'vehicle-4'),
    );

    this.npcDrivers.push(
      new NpcDriver(this.scene, new THREE.Vector3(12, 0.4, 8), this.vehicles[0], 'npc-1'),
      new NpcDriver(this.scene, new THREE.Vector3(-15, 0.4, 2), this.vehicles[1], 'npc-2'),
    );

    this.cameraRig = new CameraRig(this.camera, this.player, this.vehicles, this.input);

    this.trafficCars.push(
      new TrafficCar(this.scene, [
        new THREE.Vector3(-18, 0.28, 12),
        new THREE.Vector3(18, 0.28, 12),
        new THREE.Vector3(18, 0.28, -12),
        new THREE.Vector3(-18, 0.28, -12),
      ], 4.8),
    );

    this.trafficCars.push(
      new TrafficCar(this.scene, [
        new THREE.Vector3(-15, 0.28, -18),
        new THREE.Vector3(15, 0.28, -18),
        new THREE.Vector3(15, 0.28, 18),
        new THREE.Vector3(-15, 0.28, 18),
      ], 3.5),
    );

    this.hud.bind(this.player, this.vehicles, this.input);

    const saved = this.saveManager.load();
    if (saved) {
      this.player.setPosition(saved.playerPosition);
      this.player.setYaw(saved.playerYaw);
      this.vehicles[0].setPosition(saved.vehiclePosition);
      this.input.quality = saved.quality;
      this.hud.applyQuality(saved.quality);
    }

    this.bindEvents();
    this.hud.update(this.player, this.vehicles);
  }

  start(): void {
    this.renderer.setAnimationLoop(() => this.tick());
  }

  private bindEvents(): void {
    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });

    document.addEventListener('pointerlockchange', () => {
      this.input.pointerLocked = document.pointerLockElement === this.renderer.domElement;
    });

    this.renderer.domElement.addEventListener('click', () => {
      if (!this.input.pointerLocked) {
        this.renderer.domElement.requestPointerLock();
      }
    });

    window.addEventListener('keydown', (event: KeyboardEvent) => {
      this.input.handleKeyDown(event);

      if (event.code === 'Escape') {
        this.input.pointerLocked = false;
        document.exitPointerLock();
        this.togglePause();
      }
    });

    window.addEventListener('keyup', (event: KeyboardEvent) => {
      this.input.handleKeyUp(event);
    });

    window.addEventListener('mousemove', (event: MouseEvent) => {
      this.input.handleMouseMove(event);
    });
  }

  private createLights(): void {
    const hemi = new THREE.HemisphereLight('#dfefff', '#345530', 1.4);
    this.scene.add(hemi);

    const sun = new THREE.DirectionalLight('#fff3d5', 1.7);
    sun.position.set(20, 32, 12);
    sun.castShadow = true;
    sun.shadow.mapSize.set(1024, 1024);
    sun.shadow.camera.left = -40;
    sun.shadow.camera.right = 40;
    sun.shadow.camera.top = 40;
    sun.shadow.camera.bottom = -40;
    this.scene.add(sun);

    const ambient = new THREE.AmbientLight('#9bb7d2', 0.35);
    this.scene.add(ambient);
  }

  private togglePause(): void {
    this.state.paused = !this.state.paused;
    this.hud.setPaused(this.state.paused);
  }

  private tryInteract(): void {
    const nearestVehicle = this.vehicles
      .filter((vehicle) => vehicle.canPlayerInteract(this.player.getPosition()))
      .sort((a, b) => a.getPosition().distanceTo(this.player.getPosition()) - b.getPosition().distanceTo(this.player.getPosition()))[0];

    if (!nearestVehicle) {
      return;
    }

    nearestVehicle.handlePlayerInteraction(this.player);
  }

  private tick(): void {
    const dt = Math.min(this.clock.getDelta(), 0.033);

    if (!this.state.paused) {
      if (this.input.consumeInteract()) {
        this.tryInteract();
      }

      this.update(dt);

      this.saveManager.save({
        playerPosition: this.player.getPosition(),
        playerYaw: this.player.getYaw(),
        vehiclePosition: this.vehicles[0].getPosition(),
        quality: this.input.quality,
      });
    }

    this.hud.update(this.player, this.vehicles);
    this.renderer.render(this.scene, this.camera);
  }

  private update(dt: number): void {
    const moveInput = this.input.getMoveVector();
    const playerVehicle = this.player.getVehicle();

    this.player.update(dt, moveInput, this.input.isSprinting(), this.input.isJumping(), this.input.cameraYaw);

    for (const vehicle of this.vehicles) {
      vehicle.update(dt, moveInput, this.input);

      if (vehicle.driver === 'player') {
        const targetPosition = vehicle.getPosition().clone().add(new THREE.Vector3(0, 1.4, 0.3));
        this.player.setPosition(targetPosition);
      }
    }

    for (const npc of this.npcDrivers) {
      npc.update(dt, this.player.getPosition(), this.vehicles, this.player);
    }

    if (playerVehicle) {
      playerVehicle.setPosition(this.player.getPosition().clone().add(new THREE.Vector3(0, -0.7, 0.5)));
    }

    for (const car of this.trafficCars) {
      car.update(dt);
    }

    this.cameraRig.update(dt, this.player.getVehicle());
    this.input.consumeJump();
  }
}
