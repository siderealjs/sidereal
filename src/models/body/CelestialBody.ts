import { OrbitalParams } from "./../../types/OrbitalParams.type";
import orbitalParams from "../../data/planets.json";
import { CelestialBodyName } from "../../types/ObjectName.type";
import { Ephemeris } from "../../types/Ephemeris.type";

export class CelestialBody {
  protected orbitalParams: OrbitalParams;
  protected ephemeris: Ephemeris | null = null;

  constructor(name: CelestialBodyName, ephemeris?: Ephemeris | null) {
    if (!orbitalParams[name]) {
      throw new Error(`non ce un oggetto chiamato ${name}`);
    }

    this.orbitalParams = orbitalParams[name];
    this.ephemeris = ephemeris || null;
  }
}
