import { CelestialBody } from "./CelestialBody";
import { Position } from "./position/Position";
import { calcCoordsPolarAtDate } from "../astronomy/coords";

export class Sun extends CelestialBody {
  constructor() {
    super("sun");
  }

  public getPositionAtDate(date: Date) {
    const polarCoords = calcCoordsPolarAtDate(date, this.orbitalParams);

    const sunPosition = new Position().setOrbitalCoords(polarCoords);

    sunPosition.convertOrbitalToEcliptic(this.orbitalParams);

    return sunPosition;
  }
}
