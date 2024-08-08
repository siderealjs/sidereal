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

    const M_degrees =
      (360.0 * deltaDays) / 365.242191 + lonAtEPoch - longAtPeri;
    const M = new Angle().setDegrees(M_degrees).normalize();


    console.log('LA FINE DU YUORN STA TUTTA QUI', M.degrees())
    // eccentric anomaly
    const E = calcEccentricAnomaly(M.radians(), sunEccentricity);

    // true anomaly (radians)
    const v = new Angle(calcTrueAnomaly(E, sunEccentricity));

    const longitude = new Angle(
      v.radians() + new Angle().setDegrees(longAtPeri).radians()
    ).normalize();
    // normalizeAngleR(v + toRadians(longAtPeri));

    const r = this.orbitalParams.a * (1 - this.orbitalParams.e * Math.cos(E));

    console.log('R SOLE', r)
    console.log('LONGITUDE SOLE,', longitude.degrees());
    const position = new Position().setEclipticCoords({
      lat: new Angle(0),
      lng: longitude,
      r,
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
