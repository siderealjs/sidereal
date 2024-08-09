import { CelestialBody } from "./CelestialBody";
import { Position } from "./../position/Position";
import { calcCoordsPolarAtDate } from "../../astronomy/coords";
import { Ephemeris } from "../../types/Ephemeris.type";

export class Sun extends CelestialBody {
  constructor(ephemeris?: Ephemeris) {
    super("sun", ephemeris);
  }

  public getPositionAtDate(date: Date) {
    const polarCoords = calcCoordsPolarAtDate(date, this.orbitalParams);

    const sunPosition = new Position().setOrbitalCoords(polarCoords);

    sunPosition.convertOrbitalToEcliptic(this.orbitalParams);

    return sunPosition;
  }
}
