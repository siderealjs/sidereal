import { CelestialBody } from "./CelestialBody";
import { calcMoonSphericalEclipticalCoordsAtDate } from "../astronomy/moon/moonCoords";
import { Position } from "./position/Position";

export class Moon extends CelestialBody {
  constructor() {
    super("moon");
  }

  public getPositionAtDate(date: Date): Position {
    const moonSphericalEcl = calcMoonSphericalEclipticalCoordsAtDate(date);

    const moonPosition = new Position().setEclipticCoords(moonSphericalEcl);

    return moonPosition;
  }
}
