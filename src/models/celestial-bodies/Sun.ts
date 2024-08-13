import { CelestialBodyName, Ephemeris } from "@types";
import { CelestialBody } from "@models/celestial-bodies/CelestialBody";
import { Position } from "@models/position/Position";
import { calcCoordsPolarAtDate } from "../../astronomy/coords";
import { AstroDate } from "@models/AstroDate";
import { calcGMST0AtDate, getUTNoon } from "../../astronomy/gmst0";
import { calcHourAngleAtDate } from "../../astronomy/riseSet";

export class Sun extends CelestialBody {
  constructor(ephemeris?: Record<CelestialBodyName, Ephemeris>) {
    super("sun", ephemeris);
  }

  public getPositionAtDate(date: AstroDate) {
    const polarCoords = calcCoordsPolarAtDate(date, this.orbitalParams);

    const sunPosition = new Position().setOrbitalCoords(polarCoords);

    sunPosition.convertOrbitalToEcliptic(this.orbitalParams);

    return sunPosition;
  }

  public getRiseAndSetTimeAtDate(date: AstroDate): {
    rise: AstroDate;
    set: AstroDate;
  } {
    const long = 0;

    const UTCnoon = new AstroDate(date).setNoon();
    const UTNoon = getUTNoon(UTCnoon, long);

    const sunsetTime = calcHourAngleAtDate( this, UTCnoon, UTNoon, false);
    const sunriseTime = calcHourAngleAtDate(this, UTCnoon, UTNoon, true);
    console.log("Sunrise", sunriseTime.UTC());
    console.log("Sunset", sunsetTime.UTC());

    return {
      rise: sunriseTime,
      set: sunsetTime,
    };
  }

  // public getHorizonHeightAtDate(date: Date) {
  //   const d =
  //     367 * 2024 -
  //     (7 * (2024 + (8 + 9) / 12)) / 4 +
  //     (275 * 8) / 9 +
  //     11 -
  //     730530;
  //   console.log(d);
  //   const Masforwebsite =
  //     (((356.047 + 0.9856002585 * d) % 360) * (2 * Math.PI)) / 360;
  //   const M = calcMeanAnomalyAtDate(
  //     this.orbitalParams.M0,
  //     this.orbitalParams.n,
  //     date
  //   );
  //   console.log(Masforwebsite, M);

  //   const meanLongitude_radians = M + this.orbitalParams.ω;

  //   const GMST0_radians = meanLongitude_radians + Math.PI;

  //   const UT_hours =
  //     date.getUTCHours() +
  //     date.getUTCMinutes() / 60 +
  //     date.getUTCSeconds() / (60 * 60);
  //   const UT_radians = (UT_hours * 2 * Math.PI) / 24;
  //   const LST_radians = GMST0_radians + UT_radians + meanLongitude_radians;

  //   const sunPosition = this.getPositionAtDate(date);

  //   const LHA_radians =
  //     LST_radians - sunPosition.getEquatorialCoords().spherical.RA.radians();
  // }
}
