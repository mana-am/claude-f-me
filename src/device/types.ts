export interface DeviceInfo {
  id: string;
  name: string;
  /** number of vibration actuators (motors) */
  actuators: number;
  /** 0..1, or null when unknown */
  battery: number | null;
}

/**
 * A low-level transport to real or fake hardware.
 * The DeviceManager owns all state, safety and logging on top of this.
 */
export interface DeviceBackend {
  readonly mode: "simulated" | "buttplug";
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  /** scan for devices for `ms`, mutating the internal list */
  scan(ms: number): Promise<void>;
  list(): DeviceInfo[];
  /** set scalar vibration intensity 0..1 for all actuators of one device */
  setIntensity(deviceId: string, intensity: number): Promise<void>;
  /** register a callback fired whenever the device list changes */
  onChange(cb: () => void): void;
}

export interface PatternStep {
  intensity: number;
  ms: number;
}
