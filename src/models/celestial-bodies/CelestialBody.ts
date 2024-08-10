import { OrbitalParams, CelestialBodyName, Ephemeris } from "@types";
import orbitalParams from "../../data/planets.json";


export class CelestialBody {
  protected orbitalParams: OrbitalParams;
  protected ephemeris: Record<string, Ephemeris> = {};
  protected bodyName: CelestialBodyName;

  constructor(
    name: CelestialBodyName,
    ephemeris?: Record<CelestialBodyName, Ephemeris>
  ) {
    if (!orbitalParams[name]) {
      throw new Error(`non ce un oggetto chiamato ${name}`);
    }

    this.bodyName = name;
    this.orbitalParams = orbitalParams[name];
    this.ephemeris = ephemeris || {};
  }
}
