import { calcCoordsPolarAtDate } from "../astronomy/coords";
import { CelestialBody } from "./CelestialBody";
import { Position } from "./position/Position";
import { Sun } from "./Sun";

export class Earth extends CelestialBody {
  constructor() {
    super("earth");
  }

  public getPositionAtDate(date: Date) {
    const earthPolarCoords = calcCoordsPolarAtDate(date, this.orbitalParams);

    const earthPosition = new Position().setOrbitalCoords(earthPolarCoords);

    earthPosition.convertOrbitalToEcliptic(this.orbitalParams);

    return earthPosition;
  }
}
