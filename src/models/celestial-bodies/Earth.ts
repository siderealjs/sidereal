import { calcCoordsPolarAtDate } from "../../astronomy/coords";
import { CelestialBody } from "@models/celestial-bodies/CelestialBody";
import { Position } from "./../position/Position";
import { Ephemeris, CelestialBodyName } from "@types";

export class Earth extends CelestialBody {
  constructor(ephemeris?: Record<CelestialBodyName, Ephemeris>) {
    super("earth", ephemeris);
  }
  public getPositionAtDate(date: Date) {
    if (this.ephemeris[this.bodyName]) {

      console.log('la terra usa le ephemr')
      const earthEclipticCoords =
        this.ephemeris[this.bodyName]!.getPositionAtDate(date);

      return new Position().setEclipticCoords(earthEclipticCoords);
    } else {
      console.log('la terra NON usa le ephemr')

      const earthPolarCoords = calcCoordsPolarAtDate(date, this.orbitalParams);

      const earthPosition = new Position().setOrbitalCoords(earthPolarCoords);

      earthPosition.convertOrbitalToEcliptic(this.orbitalParams);

      return earthPosition;
    }
  }
}
