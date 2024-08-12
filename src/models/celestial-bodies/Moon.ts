import { CelestialBody } from "@models/celestial-bodies/CelestialBody";
import { calcMoonSphericalEclipticalCoordsAtDate } from "../../astronomy/moonCoords";
import { Position } from "@models/position/Position";
import { CelestialBodyName, Ephemeris } from "@types";
import { AstroDate } from "@models/AstroDate";

export class Moon extends CelestialBody {
  constructor(ephemeris?: Record<CelestialBodyName, Ephemeris>) {
    super("moon", ephemeris);
  }

  public getPositionAtDate(date: AstroDate): Position {
    if (this.ephemeris[this.bodyName]) {
      const moonEclipticCoords =
        this.ephemeris[this.bodyName]!.getPositionAtDate(date.UTC());

      return new Position().setEclipticCoords(moonEclipticCoords);
    } else {
      const moonSphericalEcl = calcMoonSphericalEclipticalCoordsAtDate(date);

      return new Position().setEclipticCoords(moonSphericalEcl);
    }
  }
}
