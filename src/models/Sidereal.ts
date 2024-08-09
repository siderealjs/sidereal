import { Ephemeris } from "../types/Ephemeris.type";
import { CelestialBodyName } from "../types/ObjectName.type";
import { Earth } from "./body/Earth";
import { Planet } from "./body/Planet";
import { Sun } from "./body/Sun";

export default class Sidereal {
  public planet(planetName: CelestialBodyName, ephemeris?: Ephemeris): Planet {
    return new Planet(planetName, ephemeris);
  }

  public earth(ephemeris?: Ephemeris): Earth {
    return new Earth(ephemeris);
  }

  public sun(ephemeris: Ephemeris): Sun {
    return new Sun(ephemeris);
  }
}
