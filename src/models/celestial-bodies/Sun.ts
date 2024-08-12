import { CelestialBodyName, Ephemeris } from "@types";
import { CelestialBody } from "@models/celestial-bodies/CelestialBody";
import { Position } from "@models/position/Position";
import { calcCoordsPolarAtDate } from "../../astronomy/coords";
import { Angle } from "@models/position/Angle";
import { AstroDate } from "@models/AstroDate";
import { getGMST0AtDate } from "../../astronomy/gmst0";

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

  public getRiseAndSetTimeAtDate(date: AstroDate):  {rise: Angle, set: Angle} {
    const long = 0;

    const GMST0 = getGMST0AtDate(date);

    const UTCnoon = new AstroDate(date);
    UTCnoon.setUTCHours(12);
    UTCnoon.setUTCMinutes(0);

    const sunPositionNoon = this.getPositionAtDate(UTCnoon);
    const { RA: RANoon, DEC: DECNoon } =
      sunPositionNoon.getEquatorialCoords().spherical;

    const UTNoon = RANoon.radians() - GMST0.radians() - long;

    const sinh = Math.sin((-0.833 * 2 * Math.PI) / 360);
    const sinDEC = Math.sin(DECNoon.radians());
    const sinLat = Math.sin((51 * 2 * Math.PI) / 360);
    const cosDEC = Math.cos(DECNoon.radians());
    const cosLat = Math.cos((51 * 2 * Math.PI) / 360);

    const cosLHA = (sinh - sinLat * sinDEC) / (cosLat * cosDEC);
    const LHA_radians = Math.acos(cosLHA);

    const sunriseTime = new Angle(UTNoon - LHA_radians).normalize();
    const sunsetTime = new Angle(UTNoon + LHA_radians).normalize();

    console.log("Sunrise", sunriseTime.HMS());
    // console.log('Sunrtrans', new Angle(UTNoon * 24 / (2 * Math.PI)).normalize().HMS());
    console.log("Sunset", sunsetTime.HMS());

    console.log("Sunrise", sunriseTime.HMS());
    console.log("Sunset", sunsetTime.HMS());

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
