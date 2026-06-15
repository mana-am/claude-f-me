import type { DeviceBackend, DeviceInfo } from "./types.js";
import { delay, logErr } from "../util.js";

/**
 * Real-hardware backend. Talks to Intiface Central / Intiface Engine over the
 * Buttplug WebSocket protocol via the official `buttplug` JS client.
 *
 * Everything is loaded dynamically and guarded so that, if Intiface is not
 * running or the API shifts between versions, the simulated path is unaffected.
 *
 * Node 22+ has a global WebSocket. On older Node we polyfill it from `ws`.
 */
export class ButtplugBackend implements DeviceBackend {
  readonly mode = "buttplug" as const;
  private client: any = null;
  private devices = new Map<string, any>(); // id -> ButtplugClientDevice
  private cb: () => void = () => {};

  constructor(private url: string) {}

  async connect(): Promise<void> {
    if (typeof (globalThis as any).WebSocket === "undefined") {
      const wsmod: any = await import("ws");
      (globalThis as any).WebSocket = wsmod.WebSocket ?? wsmod.default;
    }

    const bp: any = await import("buttplug");

    // Silence buttplug's own console logging so it can never corrupt stdio.
    try {
      if (bp.ButtplugLogger?.Logger) {
        bp.ButtplugLogger.Logger.MaximumConsoleLogLevel = bp.ButtplugLogLevel?.Off ?? 0;
      }
    } catch {
      /* ignore */
    }

    this.client = new bp.ButtplugClient("opendick");
    this.client.addListener("deviceadded", (d: any) => {
      this.devices.set(String(d.index), d);
      this.cb();
    });
    this.client.addListener("deviceremoved", (d: any) => {
      this.devices.delete(String(d.index));
      this.cb();
    });

    const connector = new bp.ButtplugBrowserWebsocketClientConnector(this.url);
    await this.client.connect(connector);

    for (const d of this.client.devices ?? []) {
      this.devices.set(String(d.index), d);
    }
    logErr(`buttplug: connected to ${this.url}, ${this.devices.size} device(s) present`);
    this.cb();
  }

  async disconnect(): Promise<void> {
    try {
      await this.client?.disconnect();
    } catch {
      /* ignore */
    }
    this.devices.clear();
  }

  async scan(ms: number): Promise<void> {
    if (!this.client) throw new Error("buttplug client not connected");
    await this.client.startScanning();
    await delay(ms);
    try {
      await this.client.stopScanning();
    } catch {
      /* some servers auto-stop */
    }
    this.cb();
  }

  list(): DeviceInfo[] {
    return [...this.devices.entries()].map(([id, d]) => ({
      id,
      name: d.name ?? `Device ${id}`,
      actuators: vibeCount(d),
      battery: null,
    }));
  }

  async setIntensity(deviceId: string, intensity: number): Promise<void> {
    const d = this.devices.get(deviceId);
    if (!d) return;
    try {
      // `vibrate` is the buttplug-js helper that drives all vibration actuators.
      await d.vibrate(intensity);
    } catch (e) {
      logErr(`buttplug: vibrate failed on ${deviceId}: ${e}`);
    }
  }

  onChange(cb: () => void): void {
    this.cb = cb;
  }
}

function vibeCount(d: any): number {
  try {
    if (Array.isArray(d.vibrateAttributes)) return d.vibrateAttributes.length || 1;
  } catch {
    /* ignore */
  }
  return 1;
}
