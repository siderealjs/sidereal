import { CelestialBody } from "@models/celestial-bodies/CelestialBody";
import { Position } from "./../position/Position";
import { Ephemeris, CelestialBodyName } from "@types";
import { AstroDate } from "@models/AstroDate";
import { calcCoordsPolarAtDate } from "../../../src/astronomy/coords";

export class Earth extends CelestialBody {
  constructor(ephemeris?: Record<CelestialBodyName, Ephemeris>) {
    super("earth", ephemeris);
  }
  public getPositionAtDate(date: AstroDate) {
    let earthPosition;
    const ephemiris = this.ephemeris["earth"];

    if (ephemiris) {
      const earthEclipticCoords = ephemiris.getPositionAtDate(date.UTC());

      earthPosition = new Position().setEclipticCoords(earthEclipticCoords);
      earthPosition.convertEcliptictToOrbital(this.orbitalParams);
    } else {
      const earthPolarCoords = calcCoordsPolarAtDate(date, this.orbitalParams);

      earthPosition = new Position().setOrbitalCoords(earthPolarCoords);
      earthPosition.convertOrbitalToEcliptic(this.orbitalParams);
    }

    return earthPosition;
  }
}
