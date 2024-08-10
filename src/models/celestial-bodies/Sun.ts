import { CelestialBodyName, Ephemeris } from "@types";
import { CelestialBody } from "@models/celestial-bodies/CelestialBody";
import { Position } from "./../position/Position";
import { calcCoordsPolarAtDate } from "../../astronomy/coords";

export class Sun extends CelestialBody {
  constructor(ephemeris?: Record<CelestialBodyName, Ephemeris>) {
    super("sun", ephemeris);
  }

  public getPositionAtDate(date: Date) {
    const polarCoords = calcCoordsPolarAtDate(date, this.orbitalParams);

    const sunPosition = new Position().setOrbitalCoords(polarCoords);

    sunPosition.convertOrbitalToEcliptic(this.orbitalParams);

    return sunPosition;
  }
}


// confronti coord geocentriche con coord eliocentriche