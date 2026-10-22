import * as THREE from 'three';
import { InputController } from './InputController';
import { PlayerController } from './player/PlayerController';
import { Vehicle } from './vehicle/Vehicle';
import { TrafficCar } from './ai/TrafficCar';
import { buildCityBlock } from './world/CityBuilder';
import { CameraRig } from './game/CameraRig';
import { HUD } from './ui/HUD';
import { SaveManager } from './save/SaveManager';

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
  private readonly vehicle: Vehicle;
  private readonly trafficCars: TrafficCar[] = [];
  private readonly cameraRig: CameraRig;
  private readonly state = {
    paused: false,
    lastTime: 0,
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
    this.vehicle = new Vehicle(this.scene, new THREE.Vector3(12, 0.4, 8));
    this.cameraRig = new CameraRig(this.camera, this.player, this.vehicle, this.input);

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

    this.hud.bind(this.player, this.vehicle, this.input);

    const saved = this.saveManager.load();
    if (saved) {
      this.player.setPosition(saved.playerPosition);
      this.player.setYaw(saved.playerYaw);
      this.vehicle.setPosition(saved.vehiclePosition);
      this.input.quality = saved.quality;
      this.hud.applyQuality(saved.quality);
    }

    this.bindEvents();
    this.hud.update(this.player, this.vehicle);
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
    const hemi = new THREE.HemisphereLight('#dfefff', '#345530', 1.5);
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

  private tick(): void {
    const dt = Math.min(this.clock.getDelta(), 0.033);

    if (!this.state.paused) {
      this.update(dt);
      this.saveManager.save({
        playerPosition: this.player.getPosition(),
        playerYaw: this.player.getYaw(),
        vehiclePosition: this.vehicle.getPosition(),
        quality: this.input.quality,
      });
    }

    this.hud.update(this.player, this.vehicle);
    this.renderer.render(this.scene, this.camera);
  }

  private update(dt: number): void {
    const moveInput = this.input.getMoveVector();
    const clocked = this.player.update(dt, moveInput, this.input.isSprinting(), this.input.isJumping(), this.input.cameraYaw);

    if (this.player.isInVehicle()) {
      this.vehicle.attachPlayer(this.player);
    } else {
      this.vehicle.detachPlayer(this.player);
      this.player.setPosition(this.player.getPosition().clone().add(new THREE.Vector3(0, 0, 0)));
    }

    if (this.vehicle.isOccupied()) {
      this.vehicle.update(dt, moveInput, this.input);
    } else {
      this.vehicle.update(dt, { x: 0, z: 0 }, this.input);
    }

    if (!this.player.isInVehicle()) {
      this.player.updateVehicleProximity(this.vehicle);
    }

    for (const car of this.trafficCars) {
      car.update(dt);
    }

    this.cameraRig.update(dt);
    this.input.consumeJump();
  }
}
