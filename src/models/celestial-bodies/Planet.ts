import { calcCoordsPolarAtDate } from "./../../astronomy/coords";
import { CelestialBodyName, Ephemeris } from "@types";
import { Position } from "@models/position/Position";
import { CelestialBody } from "@models/celestial-bodies/CelestialBody";
import { Earth } from "@models/celestial-bodies/Earth";
import { calcPhaseAngle, calculateQ } from "../../astronomy/magnitude";
import { getUTNoon } from "../../astronomy/gmst0";
import { AstroDate } from "@models/AstroDate";
import { calcHourAngleAtDate } from "../../../src/astronomy/riseSet";

export class Planet extends CelestialBody {
  constructor(
    name: CelestialBodyName,
    ephemeris?: Record<CelestialBodyName, Ephemeris>
  ) {
    super(name, ephemeris);
  }

  public getPositionAtDate(
    date: AstroDate,
    coordinatesCenter: "sun" | "earth"
  ): Position {
    const earthPosition = new Earth(this.ephemeris).getPositionAtDate(date);

    let planetPosition;

    if (this.ephemeris[this.bodyName]) {
      const planetEclipticCoords = this.ephemeris[
        this.bodyName
      ]!.getPositionAtDate(date.UTC());

      planetPosition = new Position().setEclipticCoords(planetEclipticCoords);
    } else {
      const planetPolarCoords = calcCoordsPolarAtDate(date, this.orbitalParams);
      planetPosition = new Position().setOrbitalCoords(planetPolarCoords);
      planetPosition.convertOrbitalToEcliptic(this.orbitalParams);
    }

    if (coordinatesCenter === "earth") {
      planetPosition.convertToGeocentric(earthPosition);
    }

    return planetPosition;
  }

  public getMagnitude(date: AstroDate) {
    const earthPosition = new Earth().getPositionAtDate(date);

    const bodyPolarCoords = calcCoordsPolarAtDate(date, this.orbitalParams);
    const bodyPosition = new Position().setOrbitalCoords(bodyPolarCoords);
    bodyPosition.convertOrbitalToEcliptic(this.orbitalParams);

    const bodyEarthDistance = bodyPosition.calcDistanceFrom(earthPosition);

    const bodySunDistance = bodyPolarCoords.r;
    const earthSunDistance = earthPosition.getOrbitalCoords().polar.r;

    const phaseAngle = calcPhaseAngle(
      bodyEarthDistance,
      bodySunDistance,
      earthSunDistance
    );

    const phaseFactor = calculateQ(phaseAngle.degrees());

    const apparentMagnitude =
      this.orbitalParams.H +
      5 * Math.log10(bodyEarthDistance * bodySunDistance) -
      2.5 * Math.log10(phaseFactor);

    return apparentMagnitude;
  }

  getRiseAndSetTimeAtDate = (
    date: AstroDate
  ): { rise: AstroDate; set: AstroDate } => {
    const long = 0;

    const UTCnoon = new AstroDate(date).setNoon();
    const UTNoon = getUTNoon(UTCnoon, long);

    const sunsetTime = calcHourAngleAtDate(this, UTCnoon, UTNoon, false);
    const sunriseTime = calcHourAngleAtDate(this, UTCnoon, UTNoon, true);
    console.log("Sunrise", sunriseTime.UTC());
    console.log("Sunset", sunsetTime.UTC());

    return {
      rise: sunriseTime,
      set: sunsetTime,
    };
  };
}
