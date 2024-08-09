import { loadEphemeris } from "sidereal-ephemeris";
import { calcCoordsPolarAtDate } from "../astronomy/coords";
import { CelestialBody } from "./CelestialBody";
import { Position } from "./position/Position";

export class Earth extends CelestialBody {
  constructor() {
    super("earth");
  }

  public getPositionAtDate(date: Date) {
    const terraEphemeris = loadEphemeris("earth");
    const k = terraEphemeris.getPositionAtDate(date);
    const nP = new Position().setEclipticCoords(k);

    console.log(
      "INTERNO ca",
      nP.getEclipticCoords().cartesian.x,
      nP.getEclipticCoords().cartesian.y,
      nP.getEclipticCoords().cartesian.z
    );

    return nP;

    const earthPolarCoords = calcCoordsPolarAtDate(date, this.orbitalParams);

    const earthPosition = new Position().setOrbitalCoords(earthPolarCoords);

    earthPosition.convertOrbitalToEcliptic(this.orbitalParams);

    return earthPosition;
  }
}
