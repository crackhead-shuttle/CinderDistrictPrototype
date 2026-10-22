import type { InputController } from '../game/InputController';
import type { PlayerController } from '../player/PlayerController';
import type { Vehicle } from '../vehicle/Vehicle';

export class HUD {
  private readonly root = document.createElement('div');
  private readonly status = document.createElement('div');
  private readonly speedEl = document.createElement('div');
  private readonly prompt = document.createElement('div');
  private readonly overlay = document.createElement('div');
  private readonly menuCard = document.createElement('div');

  private player!: PlayerController;
  private vehicle!: Vehicle;
  private input!: InputController;

  constructor() {
    this.root.className = 'hud';

    const topbar = document.createElement('div');
    topbar.className = 'topbar';

    const statePanel = document.createElement('div');
    statePanel.className = 'panel';
    statePanel.textContent = 'Cinder District';

    const statusPanel = document.createElement('div');
    statusPanel.className = 'panel';
    statusPanel.textContent = 'Prototype';

    this.status.className = 'panel status';
    this.status.innerHTML = '<div>Vehicle: Ready</div><div>Quality: Medium</div>';

    this.speedEl.className = 'panel';
    this.speedEl.textContent = 'Speed: 0 km/h';

    this.prompt.className = 'panel bottom';
    this.prompt.textContent = 'Click to lock cursor';

    this.overlay.className = 'menu-overlay';
    this.menuCard.className = 'menu-card';
    this.menuCard.innerHTML = `
      <h2>Pause Menu</h2>
      <div class="row"><span>Graphics</span><select id="quality-select"><option value="low">Low</option><option value="medium" selected>Medium</option><option value="high">High</option><option value="cinematic">Cinematic</option></select></div>
      <div class="row"><span>Audio</span><button type="button">Muted</button></div>
      <div class="actions">
        <button id="resume-button" type="button">Resume</button>
        <button id="save-button" type="button">Save</button>
      </div>
    `;

    this.overlay.appendChild(this.menuCard);
    topbar.append(statePanel, statusPanel);
    this.root.append(topbar, this.speedEl, this.status, this.prompt, this.overlay);
    document.body.appendChild(this.root);

    const resumeButton = this.menuCard.querySelector('#resume-button') as HTMLButtonElement;
    const saveButton = this.menuCard.querySelector('#save-button') as HTMLButtonElement;
    const select = this.menuCard.querySelector('#quality-select') as HTMLSelectElement;

    resumeButton.addEventListener('click', () => {
      this.overlay.classList.remove('visible');
      this.prompt.textContent = 'Press Escape to pause';
    });

    saveButton.addEventListener('click', () => {
      this.prompt.textContent = 'Progress saved locally';
    });

    select.addEventListener('change', (event) => {
      const nextQuality = (event.target as HTMLSelectElement).value as 'low' | 'medium' | 'high' | 'cinematic';
      this.input.quality = nextQuality;
    });
  }

  bind(player: PlayerController, vehicle: Vehicle, input: InputController): void {
    this.player = player;
    this.vehicle = vehicle;
    this.input = input;
  }

  update(player: PlayerController, vehicle: Vehicle): void {
    const speed = Math.round(Math.abs(vehicle.isOccupied() ? vehicle.getPosition().distanceTo(player.getPosition()) * 12 : 0));
    this.speedEl.textContent = `Speed: ${speed} km/h`;

    const stateLabel = player.isInVehicle() ? 'Driving' : 'On Foot';
    this.status.innerHTML = `<div>State: ${stateLabel}</div><div>Quality: ${this.input.quality}</div>`;

    if (vehicle.isPromptVisible()) {
      this.prompt.textContent = 'Press E to enter vehicle';
    } else {
      this.prompt.textContent = this.player.isInVehicle() ? 'Press E to exit vehicle' : 'Click to lock cursor';
    }
  }

  applyQuality(quality: 'low' | 'medium' | 'high' | 'cinematic'): void {
    this.status.innerHTML = `<div>Quality: ${quality}</div>`;
  }

  setPaused(paused: boolean): void {
    this.overlay.classList.toggle('visible', paused);
  }
}
