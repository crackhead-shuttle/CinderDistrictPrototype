type SaveData = {
  playerPosition: { x: number; y: number; z: number };
  playerYaw: number;
  vehiclePosition: { x: number; y: number; z: number };
  quality: 'low' | 'medium' | 'high' | 'cinematic';
};

export class SaveManager {
  private readonly key = 'cinder-district-save';

  save(data: SaveData): void {
    localStorage.setItem(this.key, JSON.stringify(data));
  }

  load(): SaveData | null {
    const raw = localStorage.getItem(this.key);
    if (!raw) {
      return null;
    }

    try {
      return JSON.parse(raw) as SaveData;
    } catch {
      return null;
    }
  }
}
