import { calcCoordsPolarAtDate } from "./../../astronomy/coords";
import { CelestialBodyName, Ephemeris } from "@types";
import { Position } from "./../position/Position";
import { CelestialBody } from "@models/celestial-bodies/CelestialBody";
import { Earth } from "@models/celestial-bodies/Earth";
import { calcPhaseAngle, calculateQ } from "../../astronomy/magnitude";

export class Planet extends CelestialBody {
  constructor(
    name: CelestialBodyName,
    ephemeris?: Record<CelestialBodyName, Ephemeris>
  ) {
    super(name, ephemeris);
  }

  public getPositionAtDate(
    UTCDate: Date,
    coordinatesCenter: "sun" | "earth"
  ): Position {
    const earthPosition = new Earth(this.ephemeris).getPositionAtDate(UTCDate);

    let planetPosition;

    if (this.ephemeris[this.bodyName]) {
      const planetEclipticCoords =
        this.ephemeris[this.bodyName]!.getPositionAtDate(UTCDate);

      planetPosition = new Position().setEclipticCoords(planetEclipticCoords);
    } else {
      const planetPolarCoords = calcCoordsPolarAtDate(
        UTCDate,
        this.orbitalParams
      );
      planetPosition = new Position().setOrbitalCoords(planetPolarCoords);
      planetPosition.convertOrbitalToEcliptic(this.orbitalParams);
    }

    if (coordinatesCenter === "earth") {
      console.log("CONVERT TO GEOGEOGOGOGOGFOGFOGFOOGF");
      planetPosition.convertToGeocentric(earthPosition);
    } else {
      console.log("do not conver for the love ot gufgofuhfghug");
    }

    return planetPosition;
  }

  public getMagnitude(date: Date) {
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
}
