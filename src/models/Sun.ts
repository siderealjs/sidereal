import { CelestialBody } from "./CelestialBody";
import { calcEccentricAnomaly, calcTrueAnomaly } from "../astronomy/anomaly";
import { daysSinceEpoch } from "../utils/dates";
import { Position } from "./position/Position";
import { Angle } from "./position/Angle";
import { calcCoordsPolarAtDate } from '../astronomy/coords';

export class Sun extends CelestialBody {
  constructor() {
    super("sun");
  }

  public getPositionAtDate(date: Date) {

    const polarCoords = calcCoordsPolarAtDate(date, this.orbitalParams);

    const sunPosition = new Position().setOrbitalCoords(polarCoords);

    sunPosition.convertOrbitalToEcliptic(this.orbitalParams);

    return sunPosition;


    const deltaDays = daysSinceEpoch(date); // Questa funzione è già implementata

    const lonAtEPoch = 280.466069;
    const longAtPeri = 282.938346;
    const sunEccentricity = this.orbitalParams.e;

    const M_degrees =
      (360.0 * deltaDays) / 365.242191 + lonAtEPoch - longAtPeri;
    const M = new Angle().setDegrees(M_degrees).normalize();

    // eccentric anomaly
    const E = calcEccentricAnomaly(M.radians(), sunEccentricity);

    // true anomaly (radians)
    const v = new Angle(calcTrueAnomaly(E, sunEccentricity));

    const longitude = new Angle(
      v.radians() + new Angle().setDegrees(longAtPeri).radians()
    ).normalize();
    // normalizeAngleR(v + toRadians(longAtPeri));

    const r = this.orbitalParams.a * (1 - this.orbitalParams.e * Math.cos(E));

    const position = new Position().setEclipticCoords({
      lat: new Angle(0),
      lng: longitude,
      r,
    });

    return position;
  }


  public getPositionAtDate2(date: Date) {
    const deltaDays = daysSinceEpoch(date); // Questa funzione è già implementata

    const lonAtEPoch = 280.466069;
    const longAtPeri = 282.938346;
    const sunEccentricity = this.orbitalParams.e;

    const M_degrees =
      (360.0 * deltaDays) / 365.242191 + lonAtEPoch - longAtPeri;
    const M = new Angle().setDegrees(M_degrees).normalize();

    // eccentric anomaly
    const E = calcEccentricAnomaly(M.radians(), sunEccentricity);

    // true anomaly (radians)
    const v = new Angle(calcTrueAnomaly(E, sunEccentricity));

    const longitude = new Angle(
      v.radians() + new Angle().setDegrees(longAtPeri).radians()
    ).normalize();
    // normalizeAngleR(v + toRadians(longAtPeri));

    const r = this.orbitalParams.a * (1 - this.orbitalParams.e * Math.cos(E));

    const position = new Position().setEclipticCoords({
      lat: new Angle(0),
      lng: longitude,
      r,
    });

    return position;
  }
}
