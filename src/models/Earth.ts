import { loadEphemeris } from "sidereal-ephemeris";
import { calcCoordsPolarAtDate } from "../astronomy/coords";
import { CelestialBody } from "./CelestialBody";
import { Position } from "./position/Position";

export class Earth extends CelestialBody {
  constructor() {
    super("earth");
  }

  public getPositionAtDate(date: Date, useEphemeris = false) {
    if (useEphemeris) {
      const terraEphemeris = loadEphemeris("earth");
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
