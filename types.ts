export interface SensitivitySettings {
  general: number;
  redDot: number;
  scope2x: number;
  scope4x: number;
  sniper: number;
  freeLook: number;
  dpi: number;
  pointerSpeed: number; // -3 to 3 or 0 to 10
  lastSaved?: string;
  presetName?: string;
}

export interface PresetProfile {
  id: string;
  name: string;
  badge: string;
  description: string;
  settings: Omit<SensitivitySettings, 'lastSaved' | 'presetName'>;
}

export interface DeviceInfo {
  browser: string;
  os: string;
  screenResolution: string;
  pixelRatio: number;
  cpuCores: number;
  deviceMemoryGB: string;
  batteryLevel: string;
  batteryCharging: boolean;
  gpuRenderer: string;
  networkStatus: string;
  estimatedRefreshRate: number;
}
