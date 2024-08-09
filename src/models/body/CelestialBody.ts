import { OrbitalParams } from "./../../types/OrbitalParams.type";
import orbitalParams from "../../data/planets.json";
import { CelestialBodyName } from "../../types/ObjectName.type";
import { Ephemeris } from "../../types/Ephemeris.type";

export class CelestialBody {
  protected orbitalParams: OrbitalParams;
  protected ephemeris: Record<string, Ephemeris> = {};
  protected bodyName: CelestialBodyName;

  constructor(name: CelestialBodyName, ephemeris?: Record<CelestialBodyName, Ephemeris>) {
    if (!orbitalParams[name]) {
      throw new Error(`non ce un oggetto chiamato ${name}`);
    }

    this.bodyName = name;
    this.orbitalParams = orbitalParams[name];
    this.ephemeris = ephemeris || {};
  }
}
