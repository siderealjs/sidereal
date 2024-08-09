import { calcCoordsPolarAtDate } from "./../../astronomy/coords";
import { CelestialBodyName } from "../../types/ObjectName.type";
import { Position } from "./../position/Position";
import { CelestialBody } from "./CelestialBody";
import { Earth } from "./Earth";
import { calcPhaseAngle, calculateQ } from "../../astronomy/magnitude";
import { Ephemeris } from "../../types/Ephemeris.type";

export class Planet extends CelestialBody {
  constructor(
    name: CelestialBodyName,
    ephemeris?: Record<CelestialBodyName, Ephemeris>
  ) {
    super(name, ephemeris);
  }

  public getPositionAtDate(UTCDate: Date) {
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

    planetPosition.convertToGeocentric(earthPosition);

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
