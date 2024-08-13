import { AstroDate } from '@models/AstroDate';
import { Ephemeris, CelestialBodyName } from "@types";
import { Earth } from "@models/celestial-bodies/Earth";
import { Planet } from "@models/celestial-bodies/Planet";
import { Sun } from "@models/celestial-bodies/Sun";
import Constants from "./data/constants.json";
import { Moon } from "@models/celestial-bodies/Moon";

export default class Sidereal {
  protected loadedEphemeris: Record<string, Ephemeris> = {};

  public Constants = Constants;
  public AstroDate = AstroDate;

  public planet(planetName: CelestialBodyName): Planet {
    return new Planet(planetName, this.loadedEphemeris);
  }

  public earth(): Earth {
    return new Earth(this.loadedEphemeris);
  }

  public sun(): Sun {
    return new Sun(this.loadedEphemeris);
  }

  public moon(): Moon {
    return new Moon(this.loadedEphemeris);
  }

  public useEphemeris(ephemerisList: Ephemeris[]): void {
    ephemerisList.forEach((ephemeris) => {
      this.loadedEphemeris[ephemeris.name] = ephemeris;
    });
  }

}
