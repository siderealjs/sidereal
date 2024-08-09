import { Ephemeris } from "./types/Ephemeris.type";
import { CelestialBodyName } from "./types/ObjectName.type";
import { Earth } from "./models/body/Earth";
import { Planet } from "./models/body/Planet";
import { Sun } from "./models/body/Sun";
import Constants from "./data/constants.json";

export default class Sidereal {
  protected loadedEphemeris: Record<string, Ephemeris> = {};

  public Constants = Constants;

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
    ephemerisList.forEach((ephemeris) => {
      this.loadedEphemeris[ephemeris.name] = ephemeris;
    });
  }
}
