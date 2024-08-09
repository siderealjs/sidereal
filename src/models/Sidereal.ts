import { Ephemeris } from './../types/Ephemeris.type';
import { CelestialBodyName } from "../types/ObjectName.type";
import { Earth } from "./body/Earth";
import { Planet } from "./body/Planet";
import { Sun } from "./body/Sun";

export default class Sidereal {
  protected loadedEphemeris: Record<string, Ephemeris> = {};

  public planet(planetName: CelestialBodyName): Planet {
    return new Planet(planetName, this.loadedEphemeris);
  }

  public earth(): Earth {
    return new Earth(this.loadedEphemeris);
  }

  public sun(): Sun {
    return new Sun(this.loadedEphemeris);
  }

  public loadEphemeris(ephemerisList: Ephemeris[]): void {
    ephemerisList.forEach(ephemeris => {
      this.loadedEphemeris[ephemeris.name] = ephemeris;
    })
  }
}
