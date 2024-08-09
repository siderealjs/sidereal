import { calcCoordsPolarAtDate } from "../../astronomy/coords";
import { CelestialBody } from "./CelestialBody";
import { Position } from "./../position/Position";
import { Ephemeris } from "../../types/Ephemeris.type";
import { CelestialBodyName } from "../../types/ObjectName.type";

export class Earth extends CelestialBody {
  constructor(ephemeris?: Record<CelestialBodyName, Ephemeris>) {
    super("earth", ephemeris);
  }
  public getPositionAtDate(date: Date) {
    if (this.ephemeris[this.bodyName]) {
      const earthEclipticCoords =
        this.ephemeris[this.bodyName]!.getPositionAtDate(date);

      return new Position().setEclipticCoords(earthEclipticCoords);
    } else {
      const earthPolarCoords = calcCoordsPolarAtDate(date, this.orbitalParams);

      const earthPosition = new Position().setOrbitalCoords(earthPolarCoords);

      earthPosition.convertOrbitalToEcliptic(this.orbitalParams);

      return earthPosition;
    }
  }
}
