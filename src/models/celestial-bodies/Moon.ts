import { CelestialBody } from "@models/celestial-bodies/CelestialBody";
import { calcMoonSphericalEclipticalCoordsAtDate } from "../../astronomy/moonCoords";
import { Position } from "@models/position/Position";
import { CelestialBodyName, Ephemeris } from "@types";

export class Moon extends CelestialBody {
  constructor(ephemeris?: Record<CelestialBodyName, Ephemeris>) {
    super("moon", ephemeris);
  }

  public getPositionAtDate(UTCDate: Date): Position {
    if (this.ephemeris[this.bodyName]) {
      const moonEclipticCoords =
        this.ephemeris[this.bodyName]!.getPositionAtDate(UTCDate);

      return new Position().setEclipticCoords(moonEclipticCoords);
    } else {
      const moonSphericalEcl = calcMoonSphericalEclipticalCoordsAtDate(UTCDate);

      return new Position().setEclipticCoords(moonSphericalEcl);
    }
  }
}
