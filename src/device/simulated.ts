import type { DeviceBackend, DeviceInfo } from "./types.js";
import { delay } from "../util.js";

/**
 * A fully fake backend so the whole stack (MCP + console + patterns + safety)
 * can be built and demoed with zero hardware and zero cost.
 * Intensities sent here go nowhere physical — the console visualises them.
 */
export class SimulatedBackend implements DeviceBackend {
  readonly mode = "simulated" as const;
  private devices = new Map<string, DeviceInfo>();
  private cb: () => void = () => {};

  async connect(): Promise<void> {
    this.devices.set("sim-1", {
      id: "sim-1",
      name: "Simulated Vibe",
      actuators: 1,
      battery: 0.87,
    });
    this.cb();
  }

  async disconnect(): Promise<void> {
    this.devices.clear();
  }

  async scan(ms: number): Promise<void> {
    await delay(Math.min(ms, 1200));
    // "discover" a second, dual-motor device on scan
    this.devices.set("sim-2", {
      id: "sim-2",
      name: "Simulated Dual Motor",
      actuators: 2,
      battery: 0.62,
    });
    this.cb();
  }

  list(): DeviceInfo[] {
    return [...this.devices.values()];
  }

  async setIntensity(_deviceId: string, _intensity: number): Promise<void> {
    // no-op: nothing physical. Manager tracks the value for display.
  }

  onChange(cb: () => void): void {
    this.cb = cb;
  }
}
