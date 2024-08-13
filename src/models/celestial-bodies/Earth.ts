import { calcCoordsPolarAtDate } from "../../astronomy/coords";
import { CelestialBody } from "@models/celestial-bodies/CelestialBody";
import { Position } from "./../position/Position";
import { Ephemeris, CelestialBodyName } from "@types";
import { AstroDate } from "@models/AstroDate";

export class Earth extends CelestialBody {
  constructor(ephemeris?: Record<CelestialBodyName, Ephemeris>) {
    super("earth", ephemeris);
  }
  public getPositionAtDate(date: AstroDate) {
    if (this.ephemeris[this.bodyName]) {
      const earthEclipticCoords =
        this.ephemeris[this.bodyName]!.getPositionAtDate(date.UTC());

      return new Position().setEclipticCoords(earthEclipticCoords);
    } else {
      const earthPolarCoords = calcCoordsPolarAtDate(date, this.orbitalParams);

      const earthPosition = new Position().setOrbitalCoords(earthPolarCoords);

      earthPosition.convertOrbitalToEcliptic(this.orbitalParams);

      return earthPosition;
    }
  }
}
