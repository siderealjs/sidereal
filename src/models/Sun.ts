import { convertRadToDMS } from "./../utils/angles";
import { CelestialBody } from "./CelestialBody";

import {
  convertRadsToHMS,
  normalizeAngleD,
  normalizeAngleR,
  toRadians,
} from "../utils/angles";
import { calcEccentricAnomaly, calcTrueAnomaly } from "../astronomy/anomaly";
import { daysSinceEpoch } from "../utils/dates";
import { Position } from "./position/Position";

export class Sun extends CelestialBody {
  constructor() {
    super("earth");
  }

  public getEphemerisAtDate(date: Date) {
    const deltaDays = daysSinceEpoch(date); // Questa funzione è già implementata

    const lonAtEPoch = 280.466069;
    const longAtPeri = 282.938346;
    const sunEccentricity = this.orbitalParams.e;

    // const M0 = lonAtEPoch - longAtPeri;

    // this.orbitalParams.M0 = toRadians(lonAtEPoch - longAtPeri);
    // this.orbitalParams.n = toRadians(360 / 365.242191);

    // console.log(36, this.orbitalParams.M0);
    // console.log(37, this.orbitalParams.n);

    // mean anomaly
    const M_degrees = normalizeAngleD(
      (360.0 * deltaDays) / 365.242191 + lonAtEPoch - longAtPeri
    );
    const M = toRadians(M_degrees);

    // eccentric anomaly
    const E = calcEccentricAnomaly(M, sunEccentricity);

    // true anomaly (radians)
    const v = calcTrueAnomaly(E, sunEccentricity);

    const longitude = normalizeAngleR(v + toRadians(longAtPeri));

    const position = new Position().setEclipticCoords({
      lat: 0,
      lng: longitude,
      r: 1,
    });

    const moonEquatorial = position.getEquatorialCoords();

    // console.log(
    //   "FINE",
    //   convertRadsToHMS(moonEquatorial.spherical.RA),
    //   convertRadToDMS(moonEquatorial.spherical.DEC)
    // );

    return position;
  }
}
