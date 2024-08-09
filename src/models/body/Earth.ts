import { calcCoordsPolarAtDate } from "../../astronomy/coords";
import { CelestialBody } from "./CelestialBody";
import { Position } from "./../position/Position";
import { Ephemeris } from "../../types/Ephemeris.type";

export class Earth extends CelestialBody {
  constructor(ephemeris?: Ephemeris) {
    super("earth", ephemeris);
  }
  public getPositionAtDate(date: Date) {
    if (this.ephemeris) {
      const terraEphemeris = this.ephemeris;
      const k = terraEphemeris.getPositionAtDate(date);
      return new Position().setEclipticCoords(k);
    } else {
      const earthPolarCoords = calcCoordsPolarAtDate(date, this.orbitalParams);

      const earthPosition = new Position().setOrbitalCoords(earthPolarCoords);

      earthPosition.convertOrbitalToEcliptic(this.orbitalParams);

      return earthPosition;
    }

    const earthPolarCoords = calcCoordsPolarAtDate(date, this.orbitalParams);

    const earthPosition = new Position().setOrbitalCoords(earthPolarCoords);

    earthPosition.convertOrbitalToEcliptic(this.orbitalParams);

    return earthPosition;
  }
}
