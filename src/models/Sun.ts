import { CelestialBody } from "./CelestialBody";

// import {
//   normalizeAngleD,
//   normalizeAngleR,
//   toRadians,
// } from "../utils/angles";
import { calcEccentricAnomaly, calcTrueAnomaly } from "../astronomy/anomaly";
import { daysSinceEpoch } from "../utils/dates";
import { Position } from "./position/Position";
import { Angle } from "./position/Angle";

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
    // const M_degrees = normalizeAngleD(
    //   (360.0 * deltaDays) / 365.242191 + lonAtEPoch - longAtPeri
    // );
    const M_degrees =
      (360.0 * deltaDays) / 365.242191 + lonAtEPoch - longAtPeri;
    const M = new Angle().setDegrees(M_degrees).normalize();

    // eccentric anomaly
    const E = calcEccentricAnomaly(M.radians(), sunEccentricity);

    // true anomaly (radians)
    const v = new Angle(calcTrueAnomaly(E, sunEccentricity));

    const longitude = new Angle(v.radians() + new Angle().setDegrees(longAtPeri).radians()).normalize(); 
    // normalizeAngleR(v + toRadians(longAtPeri));

    const position = new Position().setEclipticCoords({
      lat: new Angle(0),
      lng: longitude,
      r: 1,
    });

    // const moonEquatorial = position.getEquatorialCoords();

    // console.log(
    //   "FINE",
    //   convertRadsToHMS(moonEquatorial.spherical.RA),
    //   convertRadToDMS(moonEquatorial.spherical.DEC)
    // );

    return position;
  }
}
