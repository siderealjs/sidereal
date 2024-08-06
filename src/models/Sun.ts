import { CelestialBody } from "./CelestialBody";
import {
  calcolaRADEC,
  convertCoordsEclipticToEquatorial,
  convertSphericalEclipticToCartesianEcliptic,
} from "../astronomy/coords";
import { normalizeAngleD, normalizeAngleR, toDegrees, toRadians } from '../utils/angles';
import { calcEccentricAnomaly, calcTrueAnomaly } from '../astronomy/anomaly';
import { daysSinceEpoch } from '../utils/dates';

export class Sun extends CelestialBody {
  constructor() {
    super("earth");
  }

  public getEphemerisAtDate(date: Date) {
    const deltaDays = daysSinceEpoch(date); // Questa funzione è già implementata

    const lonAtEPoch = 280.466069;
    const longAtPeri = 282.938346;
    const sunEccentricity = this.orbitalParams.e;

    // mean anomaly
    const M_degrees = normalizeAngleD(
      (360.0 * deltaDays) / 365.242191 + lonAtEPoch - longAtPeri
    );
    const M = toRadians(M_degrees);

    console.log("mean naomlay", M_degrees, M);

    // eccentric anomaly
    const E = calcEccentricAnomaly(M, sunEccentricity);
    console.log("ecce anomak", E);

    // true anomaly (radians)
    const v = calcTrueAnomaly(E, sunEccentricity);
    console.log("ture anomaly", v, toDegrees(v));

    const longitude = normalizeAngleR(v + toRadians(longAtPeri));
    console.log("current longit", longitude, toDegrees(longitude));

    const moonCartesianEcl = convertSphericalEclipticToCartesianEcliptic({
      lat: 0,
      lng: longitude,
    });

    const moonEquatorial = convertCoordsEclipticToEquatorial(moonCartesianEcl);

    const radec = calcolaRADEC(moonEquatorial);

    console.log("FINE", radec);

    return radec;
  }
}
